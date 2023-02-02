import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

//Entities
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from './entities/role.entity';
import { PermissionRole } from './entities/permission-roles.entity';

//Dtos
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { RelationsOptionsDto } from 'src/common/dtos/relations-options.dto';
import { PermissionDto } from 'src/permissions/dto/permission.dto';
import { PermissionRolesDto } from './dto/permission-roles.dto';

//Errors
import { ERRORS } from 'src/common/constants/errors.const';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionRole)
    private permissionRoleRepository: Repository<PermissionRole>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleDto> {
    if (createRoleDto.permissionsIds) {
      const permissions = await this.permissionRepository.findBy({
        id: In(createRoleDto.permissionsIds),
      });
      if (!permissions)
        throw new HttpException(
          ERRORS.Permissions_Errors.ERR006,
          HttpStatus.NOT_FOUND,
        );
      const role = await this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(role);
      const listOfInserts: object[] = [];
      permissions.forEach((permission) => {
        const permissionRoleObject = {
          roleId: role.id,
          permissionId: permission.id,
          isActive: true,
        };
        listOfInserts.push(permissionRoleObject);
      });
      const permissionRole = await this.permissionRoleRepository
        .createQueryBuilder('RoleUser')
        .insert()
        .into('permission_roles')
        .values(listOfInserts)
        .execute()
      
      const permissionsDto = plainToInstance(PermissionDto, permissions);
      const roleDto = plainToInstance(RoleDto, role);
      roleDto.permissions = permissionsDto;
      return roleDto;
    } else {
      const role = await this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(role);
      const roleDto = plainToInstance(RoleDto, role);
      return roleDto;
    }
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    relations?: RelationsOptionsDto,
  ): Promise<PageDto<RoleDto>> {
    const itemCount = (await this.roleRepository.find(
      {where: 
        pageOptionsDto.withDeleted === 'true' ? [{ active: true}, {active: false}] : { active: true }
      })).length;

    if(pageOptionsDto.all === 'true'){
      pageOptionsDto.take = itemCount;
      pageOptionsDto.page = 1;
    }

    const dbQuery: any = {
      where: pageOptionsDto.withDeleted === 'true' ? [{ active: true}, {active: false}] : { active: true },
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };
    
    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
    const roles = await this.roleRepository.find(dbQuery);
    const rolesDto = plainToInstance(RoleDto, roles);
    for (let role of rolesDto) {
      const permissionList = await this.getPermissionList(role.id);
      role.permissions = permissionList;
    }
    return new PageDto(rolesDto, pageMeta);
    
  }

  async findOne(id: number): Promise<RoleDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role)
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    const permissionsDto = await this.getPermissionList(role.id);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionsDto;
    return roleDto;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }
    role = await this.roleRepository.save({ ...role, ...updateRoleDto });
    const roleDto = plainToInstance(RoleDto, role);
    return roleDto;
  }

  async remove(id: number): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }
    role.active = false;
    role = await this.roleRepository.save(role);
    const roleDto = plainToInstance(RoleDto, role);
    return roleDto;
  }

  async active(id: number): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }
    role.active = true;
    role = await this.roleRepository.save(role);
    const permissionsDto = await this.getPermissionList(role.id);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionsDto;
    return roleDto;
  }

  async addPermissions(addPermissionsDto: PermissionRolesDto): Promise<RoleDto>{
    const role = await this.roleRepository.findOne({ where: { id: addPermissionsDto.roleId }});
    const permissionstoAdd = await this.permissionRepository.findBy({
      id: In(addPermissionsDto.permissionsIds) });
    if(!role || !permissionstoAdd) throw new HttpException(ERRORS.Permissions_Errors.ERR007, HttpStatus.NOT_FOUND);

    //Actual permissions of the role
    const actualPermissionList = await this.getPermissionList(addPermissionsDto.roleId);
    const actualPermissionIds: number[] = [];
    actualPermissionList.forEach(permission => {
      actualPermissionIds.push(permission.id);
    });

    //Permissions to add
    const listOfInserts: object[] = [];
    permissionstoAdd.forEach(permission => {
      if(!actualPermissionIds.includes(permission.id)){
        const permissionRoleObject = { roleId: role.id, permissionId: permission.id, isActive: true }
        listOfInserts.push(permissionRoleObject);
      }
      
    });
    
    const insertPermissions = await this.permissionRoleRepository.createQueryBuilder("permission_roles")
      .insert()
      .into(PermissionRole)
      .values(listOfInserts)
      .execute();
    
    const updatedPermissionList = await this.getPermissionList(role.id);
    const permissionsDto = plainToInstance(PermissionDto, updatedPermissionList);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionsDto;
    return roleDto;
  }

  async deletePermissions(
    deletePermissionRolesDto: PermissionRolesDto,
  ): Promise<RoleDto> {
    const permissions = await this.permissionRepository.findBy({
      id: In(deletePermissionRolesDto.permissionsIds) });
    const role = await this.roleRepository.findOne({ where: { id: deletePermissionRolesDto.roleId }});
    if(!permissions || !role) throw new HttpException(ERRORS.Permissions_Errors.ERR007, HttpStatus.NOT_FOUND);

    const listOfPermissionIds: number[] = [];
    permissions.forEach(permission => {          
      listOfPermissionIds.push(permission.id);
    });
    const updatePermissions = await this.permissionRoleRepository.createQueryBuilder("permission_roles")
      .update(PermissionRole)
      .set({
        isActive: false,
      })
      .where("roleId = :roleId", { roleId: role.id })
      .andWhere({ permissionId: In(listOfPermissionIds) })
      .execute()
    
    const permissionListDto = await this.getPermissionList(role.id);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionListDto;
    return roleDto;
  }

  //custom functions

  async getPermissionList(roleId: number): Promise<PermissionDto[]>{
    const permissionList: object[] = [];
    const permissionRoles = await this.permissionRoleRepository.find({ where: {
        roleId: roleId,
        isActive: true
      },
      relations: { permission: true }
    });
    permissionRoles.forEach(permissionRole => {
      permissionList.push(permissionRole.permission)
    });
    const permissionsDto = plainToInstance(PermissionDto, permissionList);
    return permissionsDto;
  }
}
