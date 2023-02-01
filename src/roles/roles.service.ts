import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';

//Entities
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from './entities/role.entity';

//Dtos
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { RelationsOptionsDto } from 'src/common/dtos/relations-options.dto';
import { PermissionDto } from 'src/permissions/dto/permission.dto';

//Errors
import { ERRORS } from 'src/common/constants/errors.const';
import { PermissionRolesDto } from './dto/permission-roles.dto';
import { PermissionRole } from './entities/permission-roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionRole)
    private permissionRoleRepository: Repository<PermissionRole>
  ){
    
  }
  async create(createRoleDto: CreateRoleDto): Promise<RoleDto> {    
    if(createRoleDto.permissionsIds){
      const permissions = await this.permissionRepository.findBy({
         id: In(createRoleDto.permissionsIds) });
      if(!permissions) throw new HttpException(ERRORS.Permissions_Errors.ERR006, HttpStatus.NOT_FOUND);
      const role = await this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(role);
      const listOfInserts: object[] = [];
      permissions.forEach(permission => {
          const permissionRoleObject = { roleId: role.id, permissionId: permission.id, isActive: true }
          listOfInserts.push(permissionRoleObject);
        });
      const permissionRole = await this.permissionRoleRepository.createQueryBuilder("RoleUser")
        .insert()
        .into("permission_roles")
        .values(listOfInserts)
        .execute()
      // const permissionsIds: number[] = permissions.map((item) => item.id);
      // const permissionRolesList = await this.createPermissionRoles(role.id, permissionsIds);
      // await this.roleRepository.save(role);
      // await this.permissionRoleRepository.save(permissionRolesList);

      
      const permissionsDto = plainToInstance(PermissionDto, permissions);
      const roleDto = plainToInstance(RoleDto, role);
      roleDto.permissions = permissionsDto;
      return roleDto;
    }else{
      const role = await this.roleRepository.create(createRoleDto);
      await this.roleRepository.save(role);
      const roleDto = plainToInstance(RoleDto, role);
      return roleDto;
    }
        
  }

  async findAll(pageOptionsDto: PageOptionsDto, relations?: RelationsOptionsDto): Promise<PageDto<RoleDto>> {
    const dbQuery: any = {
      where: { active: true },
      relations: relations,
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };
    try {
      const itemCount = (await this.roleRepository.find(dbQuery)).length;
      const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
      const roles = await this.roleRepository.find(dbQuery);
      return new PageDto(roles, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number): Promise<RoleDto> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role)
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    const permissions = await this.roleRepository.createQueryBuilder("permissions")
      .leftJoinAndSelect("permission_roles.permission", "permissions")
      .where("roleId = :roleId", { roleId: role.id })
      .getMany();
    const permissionDto = plainToInstance(PermissionDto, permissions);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionDto;
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
    const roleDto = plainToInstance(RoleDto, role);
    return roleDto;
  }

  async addPermissions(addPermissionsDto: PermissionRolesDto): Promise<RoleDto>{
    const role = await this.roleRepository.findOne({ where: { id: addPermissionsDto.roleId }});
    const permissions = await this.permissionRepository.findBy({
      id: In(addPermissionsDto.permissionsIds) });
    if(!role || !permissions) throw new HttpException(ERRORS.Permissions_Errors.ERR007, HttpStatus.NOT_FOUND);
    // role.permissions = [...role.permissions||[], ...permissions];
    const listOfInserts: object[] = [];
        permissions.forEach(permission => {
          const permissionRoleObject = { roleId: role.id, permissionId: permission.id, isActive: true }
          listOfInserts.push(permissionRoleObject);
        });
    const insertPermissions = await this.permissionRoleRepository.createQueryBuilder("permission_roles")
      .insert()
      .into(PermissionRole)
      .values(listOfInserts)
      .execute();
    await this.roleRepository.save(role);
    const permissionsDto = plainToInstance(PermissionDto, permissions);
    const roleDto = plainToInstance(RoleDto, role);
    roleDto.permissions = permissionsDto;
    return roleDto;
  }

  async deletePermissions(deletePermissionRolesDto: PermissionRolesDto): Promise<RoleDto>{
    const permissions = await this.permissionRepository.findBy({
      id: In(deletePermissionRolesDto.permissionsIds) });
    const role = await this.roleRepository.findOne({ where: { id: deletePermissionRolesDto.roleId }});
    if(!permissions || !role) throw new HttpException(ERRORS.Permissions_Errors.ERR007, HttpStatus.NOT_FOUND);
    
    // permissions.forEach((permission) =>{
    //   const index = role.permissions.findIndex( (item) =>item.id === permission.id);
    //   role.permissions.splice(index, 1);
    // });   
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
      .andWhere({ where: { permissionId: In([...listOfPermissionIds]) } } )
      .execute()
    await this.roleRepository.save(role);
    const roleDto = plainToInstance(RoleDto, role);
    return roleDto;
  }
}
