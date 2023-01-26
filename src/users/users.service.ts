import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import * as bcrypt from 'bcrypt';

//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

//Entities
import { User } from './entities/user.entity';

//Constants
import { ERRORS } from '../common/constants/errors.const';

//Enums
import { HttpStatus } from '@nestjs/common/enums';

//Dtos
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { Role } from 'src/roles/entities/role.entity';
import { RoleDto } from '../roles/dto/role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      if (createUserDto.roleIds) {
        const hash = await bcrypt.hash(createUserDto.password, 10);
        createUserDto.password = hash;
        const user = await this.userRepository.create(createUserDto);
        const roles = await this.roleRepository.findBy({
          id: In(createUserDto.roleIds),
        });
        if (!roles)
          throw new HttpException(
            ERRORS.Roles_Errors.ERR006,
            HttpStatus.NOT_FOUND,
          );
        user.roles = roles;
        await this.userRepository.save(user);
        const userDto = plainToClass(UserDto, user);
        const rolesDto = plainToClass(RoleDto, roles);
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

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    const dbQuery: any = {
      where: { isActive: true },
      order: { name: 'ASC' }, // todo: verificar el ordenamiento
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    try {
      const itemCount = (await this.userRepository.find(dbQuery)).length;
      const pageMeta = new PageMetaDto({ pageOptionsDto, itemCount });
      const users = await this.userRepository.find(dbQuery);

      return new PageDto(users, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);

    const userDto = plainToClass(UserDto, user);
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

    const userDto = plainToClass(UserDto, user);
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
    const userDto = plainToClass(UserDto, user);
    return userDto;
  }
}
