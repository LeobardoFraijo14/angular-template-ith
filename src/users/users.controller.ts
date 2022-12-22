import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//Services
import { UsersService } from './users.service';

//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private configService: ConfigService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const userDto = await this.usersService.create(createUserDto);

    return userDto;
  }

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    const usersDto = await this.usersService.findAll(pageOptionsDto);
    return usersDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const userDto = await this.usersService.findOne(+id);
    return userDto;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
