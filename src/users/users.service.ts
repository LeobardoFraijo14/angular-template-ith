import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

//Entities
import { User } from './entities/user.entity';

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

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();

    const usersDto = plainToClass(UserDto, users);
    return usersDto;
  }

  async findOne(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: {id}});
    const userDto = plainToClass(UserDto, user);

    return userDto;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

