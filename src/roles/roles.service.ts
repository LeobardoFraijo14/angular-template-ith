import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

//Entities
import { Role } from './entities/role.entity';
import { PermissionRole } from './entities/permission-roles.entity';
import { Permission } from '../permissions/entities/permission.entity';

//Dtos
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionRolesDto } from './dto/permission-roles.dto';
import { PageQueryOptions } from '../common/dtos/page-query-options.dto';
import { ERRORS } from '../common/constants/errors.const';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { RelationsOptionsDto } from '../common/dtos/relations-options.dto';
import { PermissionDto } from '../permissions/dto/permission.dto';

//Helpers
import { createLogObject } from '../common/helpers/createLog.helper';

//Enums
import { LOG_MOVEMENTS } from '../common/enums/log-movements.enum';
import { SYSTEM_CATALOGUES } from '../common/enums/system-catalogues.enum';

//Services
import { LogsService } from '../system-logs/logs.service';
import { RoleUser } from '../users/entities/role-user.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionRole)
    private permissionRoleRepository: Repository<PermissionRole>,
    @InjectRepository(RoleUser)
    private roleUserRepository: Repository<RoleUser>,
    private logService: LogsService,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDto> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);

    const roleDto = plainToInstance(RoleDto, role);

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.ROLES, LOG_MOVEMENTS.NEW_REGISTER, roleDto);
    await this.logService.create(logDto);
    
    return roleDto;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    relations?: RelationsOptionsDto,
  ): Promise<PageDto<RoleDto>> {
    const whereCluase =
      pageOptionsDto.withDeleted === 'true' ? {} : { isActive: true };

    const itemCount = (
      await this.roleRepository.find({
        where: whereCluase,
      })
    ).length;

    if (pageOptionsDto.all === 'true') {
      pageOptionsDto.take = itemCount;
      pageOptionsDto.page = 1;
    }

    const dbQuery: PageQueryOptions = {
      where: whereCluase,
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    const roles = await this.roleRepository.find(dbQuery);
    const rolesDto = plainToInstance(RoleDto, roles);

    for (let role of rolesDto) {
      const permissionList = await this.getPermissionList(role.id);
      role.permissions = permissionList;
    }

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });

    return new PageDto(rolesDto, pageMeta);
  }

  async findOne(id: number): Promise<RoleDto> {
    const role = await this.roleRepository.findOne({ where: { id } });

    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }

    const permissionsDto = await this.getPermissionList(role.id);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionsDto;

    return roleDto;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id, isActive: true },
    });
    const actualRoleDto = plainToInstance(RoleDto, role);

    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }
    const roleUpdated = this.roleRepository.create({
      ...role,
      ...updateRoleDto,
    });

    await this.roleRepository.save(roleUpdated);

    const roleDto = plainToInstance(RoleDto, roleUpdated);

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.ROLES, LOG_MOVEMENTS.EDIT, roleDto, actualRoleDto);
    await this.logService.create(logDto);

    return roleDto;
  }

  async remove(id: number): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }
    const actualRoleDto = plainToInstance(RoleDto, role);
    role.isActive = false;
    role = await this.roleRepository.save(role);

    //Cascade delete role-users
    const roleUsers = await this.roleUserRepository.find({
      where: { roleId: role.id }
    });
    if(roleUsers){
      await this.roleUserRepository.update({roleId: role.id}, { isActive: false}, );
    }
    const roleDto = plainToInstance(RoleDto, role);

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.ROLES, LOG_MOVEMENTS.DELETE, roleDto, actualRoleDto);
    await this.logService.create(logDto);

    return roleDto;
  }

  async active(id: number): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }
    const actualRoleDto = plainToInstance(RoleDto, role);
    role.isActive = true;
    role = await this.roleRepository.save(role);
    const permissionsDto = await this.getPermissionList(role.id);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionsDto;

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.ROLES, LOG_MOVEMENTS.REACTIVATE, roleDto, actualRoleDto);
    await this.logService.create(logDto);

    return roleDto;
  }

  async setPermissions(
    id: number,
    permissionRoleDto: PermissionRolesDto,
  ): Promise<RoleDto> {
    const role = await this.roleRepository.findOneBy({
      id: id,
      isActive: true,
    });

    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }

    const permissionList = await this.getPermissionList(role.id);
    const permissionListIds = permissionList.map((permission) => permission.id);
    const renovatePermissionsRoleIds = permissionRoleDto.permissionIds;

    //Actual roleDto
    const actualRoleDto = plainToInstance(RoleDto, role);
    const actualPermissionListDto = plainToInstance(PermissionDto, permissionList);
    actualRoleDto.permissions = actualPermissionListDto;

    const permissionsToRemove = this.getArrayDiff(
      permissionListIds,
      renovatePermissionsRoleIds,
    );

    const permissionsToAdd = this.getArrayDiff(
      renovatePermissionsRoleIds,
      permissionListIds,
    );

    const listOfInserts: object[] = [];
    permissionsToAdd.forEach((permission) => {
      //Validates if the permission is already assignated to the user
      const roleUserObject = {
        roleId: id,
        permissionId: permission,
        isActive: true,
      };
      listOfInserts.push(roleUserObject);
    });

    // adding permissions
    if (listOfInserts) {
      await this.permissionRoleRepository
        .createQueryBuilder('permission_roles')
        .insert()
        .into(PermissionRole)
        .values(listOfInserts)
        .execute();
    }

    // removing permissions
    if (permissionsToRemove) {
      const res = await this.permissionRoleRepository
        .createQueryBuilder('permission_roles')
        .update(PermissionRole)
        .set({ isActive: false })
        .where('roleId = :roleId', { roleId: id })
        .andWhere({ permissionId: In(permissionsToRemove) })
        .execute();
    }

    const updatedPermissionList = await this.getPermissionList(id);
    const permissionDto = plainToInstance(PermissionDto, updatedPermissionList);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionDto;

    //Send info to log
    const logDto = await createLogObject(SYSTEM_CATALOGUES.ROLES, LOG_MOVEMENTS.ADD_PERMISSIONS_TO_ROLE, roleDto, actualRoleDto);
    await this.logService.create(logDto);

    return roleDto;
  }

  async addPermissions(
    addPermissionsDto: PermissionRolesDto,
  ): Promise<RoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id: addPermissionsDto.roleId },
    });
    const permissionstoAdd = await this.permissionRepository.findBy({
      id: In(addPermissionsDto.permissionIds),
    });
    if (!role || !permissionstoAdd)
      throw new HttpException(
        ERRORS.Permissions_Errors.ERR007,
        HttpStatus.NOT_FOUND,
      );

    //Actual permissions of the role
    const actualPermissionList = await this.getPermissionList(
      addPermissionsDto.roleId,
    );
    const actualPermissionIds: number[] = [];
    actualPermissionList.forEach((permission) => {
      actualPermissionIds.push(permission.id);
    });

    //Permissions to add
    const listOfInserts: object[] = [];
    permissionstoAdd.forEach((permission) => {
      if (!actualPermissionIds.includes(permission.id)) {
        const permissionRoleObject = {
          roleId: role.id,
          permissionId: permission.id,
          isActive: true,
        };
        listOfInserts.push(permissionRoleObject);
      }
    });

    const insertPermissions = await this.permissionRoleRepository
      .createQueryBuilder('permission_roles')
      .insert()
      .into(PermissionRole)
      .values(listOfInserts)
      .execute();

    const updatedPermissionList = await this.getPermissionList(role.id);
    const permissionsDto = plainToInstance(
      PermissionDto,
      updatedPermissionList,
    );
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionsDto;
    return roleDto;
  }

  async deletePermissions(
    deletePermissionRolesDto: PermissionRolesDto,
  ): Promise<RoleDto> {
    const permissions = await this.permissionRepository.findBy({
      id: In(deletePermissionRolesDto.permissionIds),
    });
    const role = await this.roleRepository.findOne({
      where: { id: deletePermissionRolesDto.roleId },
    });
    if (!permissions || !role)
      throw new HttpException(
        ERRORS.Permissions_Errors.ERR007,
        HttpStatus.NOT_FOUND,
      );

    const listOfPermissionIds: number[] = [];
    permissions.forEach((permission) => {
      listOfPermissionIds.push(permission.id);
    });
    const updatePermissions = await this.permissionRoleRepository
      .createQueryBuilder('permission_roles')
      .update(PermissionRole)
      .set({
        isActive: false,
      })
      .where('roleId = :roleId', { roleId: role.id })
      .andWhere({ permissionId: In(listOfPermissionIds) })
      .execute();

    const permissionListDto = await this.getPermissionList(role.id);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionListDto;
    return roleDto;
  }

  //custom functions
  async getPermissionList(roleId: number): Promise<PermissionDto[]> {
    const permissionList: object[] = [];
    const permissionRoles = await this.permissionRoleRepository.find({
      where: {
        roleId: roleId,
        isActive: true,
      },
      relations: { permission: true },
    });
    permissionRoles.forEach((permissionRole) => {
      permissionList.push(permissionRole.permission);
    });
    const permissionsDto = plainToInstance(PermissionDto, permissionList);
    return permissionsDto;
  }

  // todo: ver si crear un helper
  getArrayDiff(a: any[], b: any[]) {
    return a.filter((element: any) => {
      return !b.includes(element);
    });
  }
}
