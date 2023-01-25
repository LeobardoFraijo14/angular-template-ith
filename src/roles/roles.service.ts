import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleDto } from './dto/role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { plainToClass } from 'class-transformer';
import { ERRORS } from 'src/common/constants/errors.const';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PermissionRole } from './entities/permission-role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(PermissionRole)
    private permissionRoleRepository: Repository<PermissionRole>,
  ){
    
  }
  async create(createRoleDto: CreateRoleDto): Promise<RoleDto> {
    if(createRoleDto.permissionsIds){
      const permissions = await this.permissionRepository.findBy({
         id: In(createRoleDto.permissionsIds) });
      if(!permissions) throw new HttpException(ERRORS.Permissions_Errors.ERR005, HttpStatus.NOT_FOUND);
      let role = await this.roleRepository.create(createRoleDto);
      role.permissions = permissions;
      await this.roleRepository.save(role);
      const roleDto = plainToClass(RoleDto, role);
      return roleDto;
    };
    const role = await this.roleRepository.create(createRoleDto);
    const roleDto = plainToClass(RoleDto, role);
    return roleDto;
    
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<RoleDto>> {
    const dbQuery: any = {
      where: { active: true },
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
      throw new HttpException(ERRORS.Roles_Errors.ERR006, HttpStatus.NOT_FOUND);

    const roleDto = plainToClass(RoleDto, role);
    return roleDto;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR006, HttpStatus.NOT_FOUND);
    }

    role = await this.roleRepository.save({ ...role, ...updateRoleDto });
    const roleDto = plainToClass(RoleDto, role);
    return roleDto;
  }

  async remove(id: number): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR006, HttpStatus.NOT_FOUND);
    }
    role.active = false;
    role = await this.roleRepository.save(role);
    const roleDto = plainToClass(RoleDto, role);
    return roleDto;
  }

  async active(id: number): Promise<RoleDto> {
    let role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new HttpException(ERRORS.Roles_Errors.ERR006, HttpStatus.NOT_FOUND);
    }
    role.active = true;
    role = await this.roleRepository.save(role);
    const roleDto = plainToClass(RoleDto, role);
    return roleDto;
  }
}
