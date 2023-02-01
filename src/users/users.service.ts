import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { In, Repository, JoinColumn } from 'typeorm';
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

//Entities
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { RoleUser } from './entities/role-user.entity';

//Constants
import { ERRORS } from '../common/constants/errors.const';

//Enums
import { HttpStatus } from '@nestjs/common/enums';
import { InsertRolesDto } from './dto/insert-roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(RoleUser)
    private roleUserRepository: Repository<RoleUser>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      if (createUserDto.roleIds) {
        const hash = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hash;
        let user = await this.userRepository.create(createUserDto);
        const roles = await this.roleRepository.findBy({
          id: In(createUserDto.roleIds),
        });
        if (!roles)
          throw new HttpException(
            ERRORS.Roles_Errors.ERR008,
            HttpStatus.NOT_FOUND,
          );
        await this.userRepository.save(user);
        const listOfInserts: object[] = [];
        roles.forEach((role) => {
          const roleUserObject = {
            roleId: role.id,
            userId: user.id,
            isActive: true,
          };
          listOfInserts.push(roleUserObject);
        });
        const roleUsers = await this.roleUserRepository
          .createQueryBuilder('RoleUser')
          .insert()
          .into('role_users')
          .values(listOfInserts)
          .execute();

        const userDto = plainToInstance(UserDto, user);
        const rolesDto = plainToInstance(RoleDto, roles);
        userDto.roles = rolesDto;

        return userDto;
      }
      const hash = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hash;
      const user = await this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      const userDto = plainToClass(UserDto, user);

      return userDto;
    } catch (error) {
      console.log(error);
    }
  }

  async findAll(pageOptionsDto: PageOptionsDto) {
    try {
      const dbQuery: any = {
        where: { isActive: true },
        order: { createdAt: pageOptionsDto.order },
        take: pageOptionsDto.take,
        skip: pageOptionsDto.skip,
      };

      const itemCount = (await this.userRepository.find(dbQuery)).length;
      const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
      const users = await this.userRepository.find(dbQuery);
      if (!users)
        throw new HttpException(
          ERRORS.User_Errors.ERR002,
          HttpStatus.NOT_FOUND,
        );
      const usersDto = plainToInstance(UserDto, users);

      for (let user of usersDto) {
        const roleList = await this.getRoleList(user.id);
        user.roles = roleList;
      }
      return new PageDto(usersDto, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    const rolesDto = await this.getRoleList(id);
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = rolesDto;
    return userDto;
  }

  async findByName(userName: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { name: userName },
    });
    if (!user) {
      // throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
      throw new BadRequestException('Usuario no encontrado'); // todo
    }

    const rolesDto = await this.getRoleList(user.id);
    const userDto = plainToClass(UserDto, user);
    userDto.roles = rolesDto;
    return userDto;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      // throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
      throw new BadRequestException('Usuario no encontrado'); // todo
    }

    user = await this.userRepository.save({ ...user, ...updateUserDto });
    const userDto = plainToClass(UserDto, user);
    return userDto;
  }

  //todo: Ver como manejar las relaciones entre usuarios y roles cuando se elimina un usuario
  async remove(id: number): Promise<UserDto> {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }
    user.isActive = false;
    user = await this.userRepository.save(user);
    const userDto = plainToClass(UserDto, user);
    return userDto;
  }

  async active(id: number): Promise<UserDto> {
    let user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }
    user.isActive = true;
    user = await this.userRepository.save(user);
    const roles = await this.getRoleList(user.id);
    const rolesDto = plainToInstance(RoleDto, roles);
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = rolesDto;
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
    const actualRoleList = await this.getRoleList(addRolesDto.userId);
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

    const updatedRoleList = await this.getRoleList(user.id);
    const rolesDto = plainToInstance(RoleDto, updatedRoleList);
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = rolesDto;
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
    const roleListDto = await this.getRoleList(user.id);
    const userDto = plainToInstance(UserDto, user);
    userDto.roles = roleListDto;
    return userDto;
  }

  //custom functions

  async getRoleList(userId: number): Promise<RoleDto[]> {
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
}
