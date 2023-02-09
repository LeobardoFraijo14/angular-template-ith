import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
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
import { Group } from 'src/groups/entities/group.entity';
import { PageQueryOptions } from '../common/dtos/page-query-options.dto';
@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionDto> {
    const permission = this.permissionRepository.create(createPermissionDto);

    const group = await this.groupRepository.findOne({
      where: { id: createPermissionDto.groupId, isActive: true },
    });

    if (!group) {
      throw new HttpException(ERRORS.Group_Errors.ERR009, HttpStatus.NOT_FOUND);
    }

    permission.group = group;

    const permissionCreated = this.permissionRepository.create(permission);
    await this.permissionRepository.save(permission);

    const permissionDto = plainToClass(PermissionDto, permissionCreated);

    return permissionDto;
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<PermissionDto>> {
    const whereCluase =
      pageOptionsDto.withDeleted === 'true' ? {} : { isActive: true };

    const itemCount = (
      await this.permissionRepository.find({
        where: whereCluase,
      })
    ).length;

    if (pageOptionsDto.all === 'true') {
      pageOptionsDto.take = itemCount;
      pageOptionsDto.page = 1;
    }

    const dbQuery: PageQueryOptions = {
      where: whereCluase,
      relations: { group: true },
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
    const permissions = await this.permissionRepository.find(dbQuery);

    const pageDto = new PageDto(permissions, pageMeta);
    return pageDto;
  }

  async findOne(id: number): Promise<PermissionDto> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: { group: true },
    });

    if (!permission) {
      throw new HttpException(
        ERRORS.Permissions_Errors.ERR006,
        HttpStatus.NOT_FOUND,
      );
    }

    const permissionDto = plainToClass(PermissionDto, permission);
    return permissionDto;
  }

  async update(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionDto> {
    let permission = await this.permissionRepository.findOne({
      where: { id, isActive: true },
      relations: { group: true },
    });

    if (!permission) {
      throw new HttpException(
        ERRORS.Permissions_Errors.ERR006,
        HttpStatus.NOT_FOUND,
      );
    }

    if (updatePermissionDto.groupId) {
      const group = await this.groupRepository.findOne({
        where: { id: updatePermissionDto.groupId, isActive: true },
      });

      if (!group) {
        throw new HttpException(
          ERRORS.Group_Errors.ERR009,
          HttpStatus.NOT_FOUND,
        );
      }
      permission.group = group;
    }

    const permissionUpdated = this.permissionRepository.create({
      ...permission,
      ...updatePermissionDto,
    });

    await this.permissionRepository.save(permissionUpdated);

    const permissionDto = plainToClass(PermissionDto, permission);

    return permissionDto;
  }

  async remove(id: number): Promise<PermissionDto> {
    const permission = await this.permissionRepository.findOne({
      where: { id, isActive: true },
      relations: { group: true },
    });

    if (!permission) {
      throw new HttpException(
        ERRORS.Permissions_Errors.ERR006,
        HttpStatus.NOT_FOUND,
      );
    }

    permission.isActive = false;

    const permissionRemoved = this.permissionRepository.create(permission);
    await this.permissionRepository.save(permissionRemoved);

    const permissionDto = plainToClass(PermissionDto, permission);

    return permissionDto;
  }

  async active(permissionId: number): Promise<PermissionDto> {
    const permission = await this.permissionRepository.findOne({
      where: { id: permissionId, isActive: false },
      relations: { group: true },
    });
    permission.isActive = true;

    const permissionActivated = this.permissionRepository.create(permission);
    await this.permissionRepository.save(permissionActivated);

    const permissionDto = plainToInstance(PermissionDto, permission);

    return permissionDto;
  }
}
