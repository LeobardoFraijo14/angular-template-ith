import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { In, Repository, JoinColumn, DataSource, Not } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { RoleDto } from '../roles/dto/role.dto';
import { UserRolesDto } from './dto/UserRoles.dto';
import { PermissionDto } from '../permissions/dto/permission.dto';

//Entities
import { User } from './entities/user.entity';
import { RoleUser } from './entities/role-user.entity';
import { Role } from '../roles/entities/role.entity';

//Constants
import { ERRORS } from '../common/constants/errors.const';

//Enums
import { HttpStatus } from '@nestjs/common/enums';
import { PageQueryOptions } from '../common/dtos/page-query-options.dto';



import { LOG_MOVEMENTS } from '../common/enums/log-movements.enum';
import { SYSTEM_CATALOGUES } from '../common/enums/system-catalogues.enum';
import { createLogObject } from '../common/helpers/createLog.helper';

//Services
import { LogsService } from '../system-logs/logs.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleUser)
    private roleUserRepository: Repository<RoleUser>,
    private dataSource: DataSource,
    private logService: LogsService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    let rolesInserted = false;
    let rolesDto: RoleDto[];

    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);

    const user = this.userRepository.create(createUserDto);

    await this.userRepository.save(user);

    if (createUserDto.roleIds) {
      const roles = await this.roleRepository.findBy({
        id: In(createUserDto.roleIds),
        isActive: true,
      });

      if (!roles) {
        throw new HttpException(
          ERRORS.Roles_Errors.ERR008,
          HttpStatus.NOT_FOUND,
        );
      }

      const userRolesToInsert: object[] = [];

      roles.forEach((role) => {
        userRolesToInsert.push({
          roleId: role.id,
          userId: user.id,
          isActive: true,
        });
      });

      await this.roleUserRepository
        .createQueryBuilder('RoleUser')
        .insert()
        .into('role_users')
        .values(userRolesToInsert)
        .execute();

      rolesInserted = true;

      rolesDto = plainToInstance(RoleDto, roles);
    }

    const userDto = plainToClass(UserDto, user);

    if (rolesInserted) {
      userDto.roles = rolesDto;
    }
    
    //Send log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.USERS, LOG_MOVEMENTS.NEW_REGISTER, userDto);
    await this.logService.create(logDto);

    return userDto;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    const whereCluase =
      pageOptionsDto.withDeleted === 'true' ? {} : { isActive: true };

    const dbQuery: PageQueryOptions = {
      where: whereCluase,
      order: { name: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    const users = await this.userRepository.find(dbQuery);
    const itemCount = users.length;
    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });

    if (!users) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }

    const usersDto = plainToInstance(UserDto, users);

    for (const user of usersDto) {
      const roleList = await this.getUserRoles(user.id);
      user.roles = roleList;
    }

    return new PageDto(usersDto, pageMeta);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }

    const userDto = plainToInstance(UserDto, user);
    const rolesDto = await this.getUserRolesList(id);

    userDto.roles = rolesDto;

    return userDto;
  }

  async findByName(userName: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { name: userName },
    });

    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }

    const rolesDto = await this.getUserRolesList(user.id);
    const userDto = plainToClass(UserDto, user);
    userDto.roles = rolesDto;
    return userDto;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });
    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }

    const validateEmail = await this.userRepository.findOne({
      where: {
        id: Not(id),
        email: updateUserDto.email        
      }
    });
    if (validateEmail) {
      throw new HttpException(ERRORS.Validation_errors.ERR011, HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.password && updateUserDto.password.trim()) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    } else {
      delete updateUserDto.password;
    }

    if (updateUserDto.roleIds) {
      await this.addUserRoles(updateUserDto.roleIds, user);
    }

    const savedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    const updatedRoleList = await this.getUserRoles(user.id);
    const rolesDto = plainToInstance(RoleDto, updatedRoleList);
    const userDto = plainToInstance(UserDto, savedUser);
    const oldUserDto = plainToInstance(UserDto, user);
    userDto.roles = rolesDto;

    //Send info to log
    //todo: insert relation with user when jwt is implemented
    const logDto = await createLogObject(SYSTEM_CATALOGUES.USERS, LOG_MOVEMENTS.EDIT, userDto, oldUserDto);
    await this.logService.create(logDto);

    return userDto;
  }

  async remove(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
    });

    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }
    const originalUser = plainToInstance(UserDto, user);

    user.isActive = false;

    const deletedUser = await this.userRepository.save(user);
    const userDto = plainToClass(UserDto, deletedUser);

    const logDto = await createLogObject(SYSTEM_CATALOGUES.USERS, LOG_MOVEMENTS.DELETE, userDto, originalUser);
    await this.logService.create(logDto);
    return userDto;
  }

  async active(id: number): Promise<UserDto> {
    let user = await this.userRepository.findOne({
      where: { id, isActive: false },
    });

    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }
    const originalUser = plainToInstance(UserDto, user);

    user.isActive = true;
    user.deletedAt = null;

    const activatedUser = await this.userRepository.save(user);

    const roles = await this.getUserRolesList(user.id);
    const rolesDto = plainToInstance(RoleDto, roles);
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = rolesDto;

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.USERS, LOG_MOVEMENTS.DELETE, userDto, originalUser);
    await this.logService.create(logDto);   

    return userDto;
  }

  //Done
  async addRoles(addRolesDto: UserRolesDto): Promise<UserDto> {
    const rolesToAdd = await this.roleRepository.findBy({
      id: In(addRolesDto.roleIds),
    });
    const user = await this.userRepository.findOne({
      where: { id: addRolesDto.userId },
      
    });
    if (!rolesToAdd || !user)
      throw new HttpException(ERRORS.User_Errors.ERR005, HttpStatus.NOT_FOUND);

    //Actual roles of the user
    const actualRoleList = await this.getUserRolesList(addRolesDto.userId);
    const actualRoleIds: number[] = [];
    actualRoleList.forEach((role) => {
      actualRoleIds.push(role.id);
    });

    //Roles to add
    const listOfInserts: object[] = [];
    rolesToAdd.forEach((role) => {
      //Validates if the role is already assignated to the user
      if (!actualRoleIds.includes(role.id)) {
        const roleUserObject = {
          roleId: role.id,
          userId: user.id,
          isActive: true,
        };
        listOfInserts.push(roleUserObject);
      }
    });

    const insertRoles = await this.roleUserRepository
      .createQueryBuilder('role_users')
      .insert()
      .into('role_users')
      .values(listOfInserts)
      .execute();
    
    //Updated role list dto
    const updatedRoleList = await this.getUserRolesList(user.id);
    const rolesDto = plainToInstance(RoleDto, updatedRoleList);
    
    //Original User Dto
    const originalUserDto = plainToInstance(UserDto, user);
    const originalRoleListDto = plainToInstance(RoleDto, actualRoleList);
    originalUserDto.roles = originalRoleListDto;

    //Updated User Dto
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = rolesDto;

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.USERS, LOG_MOVEMENTS.ADD_ROLES_TO_USER, userDto, originalUserDto);
    await this.logService.create(logDto);   

    return userDto;
  }

  async deleteRoles(userRolesDto: UserRolesDto): Promise<UserDto> {
    const roles = await this.roleRepository.findBy({
      id: In(userRolesDto.roleIds),
    });
    const roleIds: number[] = [];
    roles.forEach((role) => {
      roleIds.push(role.id);
    });
    const user = await this.userRepository.findOne({
      where: { id: userRolesDto.userId },
    });
    if (!roles || !user)
      throw new HttpException(ERRORS.User_Errors.ERR005, HttpStatus.NOT_FOUND);

    const roleUser = await this.roleUserRepository
      .createQueryBuilder('roleUser')
      .update(RoleUser)
      .set({ isActive: false })
      .where('userId = :userId', { userId: user.id })
      .andWhere({ roleId: In(roleIds) })
      .execute();
    
    //Original User Dto
    const originalUserDto = plainToInstance(UserDto, user);
    const actualRoleListDto = plainToInstance(RoleDto, roles);
    originalUserDto.roles = actualRoleListDto;

    //Updated role List dto
    const roleListDto = await this.getUserRolesList(user.id);
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = roleListDto;

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.USERS, LOG_MOVEMENTS.REMOVE_ROLES_FROM_USER, userDto, originalUserDto);
    await this.logService.create(logDto); 

    return userDto;
  }

  //custom functions

  async getUserRolesList(userId: number): Promise<RoleDto[]> {
    const rolesList: object[] = [];
    const roleUsers = await this.roleUserRepository.find({
      where: {
        userId: userId,
        isActive: true,
      },
      relations: { role: true },
    });

    roleUsers.forEach((roleUser) => {
      rolesList.push(roleUser.role);
    });

    const rolesDto = plainToInstance(RoleDto, rolesList);
    return rolesDto;
  }

  async addUserRoles(roleIds: number[], user: UserDto): Promise<UserDto> {
    const rolesToAdd = await this.roleRepository.findBy({
      id: In(roleIds),
      isActive: true,
    });

    if (!rolesToAdd || !user) {
      throw new HttpException(ERRORS.User_Errors.ERR005, HttpStatus.NOT_FOUND);
    }

    const actualRoleList = await this.getUserRoles(user.id);

    //Actual role ids of the user
    const actualRoleIds = actualRoleList.map((role) => role.id);
    // Role ids to add of the user
    const rolesToAddArr = rolesToAdd.map((role) => role.id);

    // roles to insert
    const rolesToInsert = this.getArrayDiff(rolesToAddArr, actualRoleIds);
    // roles to remove
    const rolesToRemove = this.getArrayDiff(actualRoleIds, rolesToAddArr);

    //Roles to add
    const listOfInserts: object[] = [];
    rolesToInsert.forEach((role) => {
      //Validates if the role is already assignated to the user
      const roleUserObject = {
        roleId: role,
        userId: user.id,
        isActive: true,
      };
      listOfInserts.push(roleUserObject);
    });

    // adding roles
    if (listOfInserts) {
      await this.roleUserRepository
        .createQueryBuilder('role_users')
        .insert()
        .into('role_users')
        .values(listOfInserts)
        .execute();
    }

    // removing roles
    if (rolesToRemove) {
      await this.roleUserRepository
        .createQueryBuilder('roleUser')
        .update(RoleUser)
        .set({ isActive: false })
        .where('userId = :userId', { userId: user.id })
        .andWhere({ roleId: In(rolesToRemove) })
        .execute();
    }

    const updatedRoleList = await this.getUserRoles(user.id);
    const rolesDto = plainToInstance(RoleDto, updatedRoleList);
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = rolesDto;

    return userDto;
  }

  async getUserRoles(userId: number): Promise<RoleDto[]> {
    const roleUsers = await this.roleUserRepository.find({
      where: {
        userId,
        isActive: true,
      },
      relations: { role: true },
    });

    const rolesList = roleUsers.map((roleUser) => roleUser.role);

    const rolesDto = plainToInstance(RoleDto, rolesList);

    return rolesDto;
  }

  // todo: ver si crear un helper
  getArrayDiff(a: any[], b: any[]) {
    return a.filter((element: any) => {
      return !b.includes(element);
    });
  }
  async getUserPermission(userId: number): Promise<PermissionDto[]> {
    const up: PermissionDto[] = await this.dataSource.manager.query(`SELECT p.* from role_users ru
    INNER JOIN permission_roles pr ON ru."roleId" = pr."roleId" 
    INNER JOIN permissions p ON pr."permissionId" = p.id 
    WHERE ru."userId" = $1 AND pr."isActive" = true`, [userId])

    return plainToInstance(PermissionDto, up) 
  }
}
