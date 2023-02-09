import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

//Entities
import { Permission } from 'src/permissions/entities/permission.entity';
import { Group } from './entities/group.entity';

//Dtos
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupDto } from './dto/group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

//Constants
import { ERRORS } from 'src/common/constants/errors.const';
import { plainToInstance } from 'class-transformer';
import { PageDto } from 'src/common/dtos/page.dto';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { AddPermissionsDto } from './dto/add-permission.dto';
import { PageQueryOptions } from '../common/dtos/page-query-options.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<GroupDto> {
    const group = this.groupRepository.create(createGroupDto);

    await this.groupRepository.save(group);

    const groupDto = plainToInstance(GroupDto, group);

    return groupDto;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<GroupDto>> {
    const whereCluase =
      pageOptionsDto.withDeleted === 'true' ? {} : { isActive: true };

    const itemCount = (
      await this.groupRepository.find({
        where: whereCluase,
      })
    ).length;

    if (pageOptionsDto.all === 'true') {
      pageOptionsDto.take = itemCount;
      pageOptionsDto.page = 1;
    }

    const dbQuery: PageQueryOptions = {
      where: whereCluase,
      relations: { permissions: true },
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
    const groups = await this.groupRepository.find(dbQuery);
    const groupsDto = plainToInstance(GroupDto, groups);
    return new PageDto(groupsDto, pageMeta);
  }

  async findOne(id: number): Promise<GroupDto> {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: { permissions: true },
    });

    if (!group) {
      throw new HttpException(ERRORS.Group_Errors.ERR009, HttpStatus.NOT_FOUND);
    }

    const groupDto = plainToInstance(GroupDto, group);

    return groupDto;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<GroupDto> {
    const group = await this.groupRepository.findOne({
      where: { id, isActive: true },
      relations: { permissions: true },
    });

    const updatedGroup = this.groupRepository.create({
      ...group,
      ...updateGroupDto,
    });

    await this.groupRepository.save(updatedGroup);

    const groupDto = plainToInstance(GroupDto, group);

    return groupDto;
  }

  async remove(id: number): Promise<GroupDto> {
    let group = await this.groupRepository.findOne({
      where: { id, isActive: true },
      relations: { permissions: true },
    });

    if (!group) {
      throw new HttpException(ERRORS.Group_Errors.ERR009, HttpStatus.NOT_FOUND);
    }

    group.isActive = false;

    const groupRemoved = this.groupRepository.create(group);

    await this.groupRepository.save(groupRemoved);

    const groupDto = plainToInstance(GroupDto, groupRemoved);

    return groupDto;
  }

  async active(id: number): Promise<GroupDto> {
    let group = await this.groupRepository.findOne({
      where: { id, isActive: false },
      relations: { permissions: true },
    });

    if (!group) {
      throw new HttpException(ERRORS.Roles_Errors.ERR008, HttpStatus.NOT_FOUND);
    }

    group.isActive = true;

    const groupActivated = this.groupRepository.create(group);

    await this.groupRepository.save(groupActivated);

    const groupDto = plainToInstance(GroupDto, groupActivated);

    return groupDto;
  }

  // async addPermissions(addPermissionsDto: AddPermissionsDto): Promise<GroupDto>{
  //   let group = await this.groupRepository.findOne({where: { id: addPermissionsDto.groupId }});
  //   const permissions = await this.permissionRepository.findBy({
  //     id: In(addPermissionsDto.permissionIds) });
  //   if(!group || !permissions) throw new HttpException(ERRORS.Group_Errors.ERR010, HttpStatus.NOT_FOUND);

  //   group.permissions = permissions;
  //   group = await this.groupRepository.save(group);
  //   const groupUpdated = await this.groupRepository.findOne({ where: { id: addPermissionsDto.groupId }, relations: { permissions: true }})
  //   const groupDto = plainToInstance(GroupDto, groupUpdated);
  //   return groupDto;
  // }
}
