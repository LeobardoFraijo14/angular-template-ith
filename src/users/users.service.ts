import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

//Entities
import { User } from './entities/user.entity';

//Constants
import { ERRORS } from '../common/constants/errors.const';
import { HttpStatus } from '@nestjs/common/enums';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ){
    
  }
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    const userDto = plainToClass(UserDto, user);

    return userDto;
  }

  async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    const dbQuery: any = {
      where: { active: true },
      order: { createdAt: pageOptionsDto.order },
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
    };

    const itemCount = (await this.userRepository.find(dbQuery)).length;
    const pageMeta = new PageMetaDto({pageOptionsDto, itemCount});
    const users = await this.userRepository.find(dbQuery);

    return new PageDto(users, pageMeta);
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: 
      {id}});
    if(!user) throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);

    const userDto = plainToClass(UserDto, user);
    return userDto;
  }

  async findByName(userName: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: 
      {name: userName}});
    if(!user) throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);

    const userDto = plainToClass(UserDto, user);
    return userDto;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserDto> {
    let user = await this.userRepository.findOne({ where: {id}});
    if(!user){
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }

    user = await this.userRepository.save({...user, ...updateUserDto});
    const userDto = plainToClass(UserDto, user);
    return userDto;
  }

  async remove(id: number): Promise<UserDto> {
    let user = await this.userRepository.findOne({where: {id}});
    if(!user){
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }
    user.active = false;
    user = await this.userRepository.save(user);
    const userDto = plainToClass(UserDto, user);
    return userDto;
  }

  async active(id: number): Promise<UserDto> {
    let user = await this.userRepository.findOne({where: {id}})
    if(!user){
      throw new HttpException(ERRORS.User_Errors.ERR002, HttpStatus.NOT_FOUND);
    }
    user.active = true;
    user = await this.userRepository.save(user);
    const userDto = plainToClass(UserDto, user);
    return userDto;
  }
}

