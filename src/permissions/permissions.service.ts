import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';

//Constants
import { ERRORS } from 'src/common/constants/errors.const';

//Dtos
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionDto } from './dto/permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

//Entities
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {

  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ){
    
  }
  async create(createPermissionDto: CreatePermissionDto) {
    const permission = await this.permissionRepository.create(createPermissionDto);
    await this.permissionRepository.save(permission);
    const permissionDto = plainToClass(PermissionDto, permission);

    return permissionDto;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<PermissionDto>> {
    const dbQuery: any = {
      where: { active: true },
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    const itemCount = (await this.permissionRepository.find(dbQuery)).length;
    const pageMeta = new PageMetaDto({pageOptionsDto, itemCount});
    const permissions = await this.permissionRepository.find(dbQuery);

    const pageDto = new PageDto(permissions, pageMeta);
    return pageDto; 
  }

  async findOne(id: number): Promise<PermissionDto> {
    const permission = await this.permissionRepository.findOne({ where: 
      {id}});
    if(!permission) throw new HttpException(ERRORS.Permissions_Errors.ERR005, HttpStatus.NOT_FOUND);

    const permissionDto = plainToClass(PermissionDto, permission);
    return permissionDto;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto): Promise<PermissionDto> {
    let permission = await this.permissionRepository.findOne({ where: {id}});
    if(!permission){
      throw new HttpException(ERRORS.Permissions_Errors.ERR005, HttpStatus.NOT_FOUND);
    }

    permission = await this.permissionRepository.save({...permission, ...updatePermissionDto});
    const permissionDto = plainToClass(PermissionDto, permission);
    return permissionDto;
  }

  async remove(id: number) {
    let permission = await this.permissionRepository.findOne({where: {id}});
    if(!permission){
      throw new HttpException(ERRORS.Permissions_Errors.ERR005, HttpStatus.NOT_FOUND);
    }
    permission.active = false;
    permission = await this.permissionRepository.save(permission);
    const permissionDto = plainToClass(PermissionDto, permission);
    return permissionDto;
  }
}
