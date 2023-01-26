import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//Services
import { UsersService } from './users.service';

//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';

@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

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
  async findOne(@Param('id') id: string): Promise<UserDto> {
    const userDto = await this.usersService.findOne(+id);
    return userDto;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    const userDto = await this.usersService.update(+id, updateUserDto);
    return userDto;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<UserDto> {
    const userDto = await this.usersService.remove(+id);
    return userDto;
  }

  @Patch(':id/active')
  async active(@Param('id') id: string): Promise<UserDto> {
    const userDto = await this.usersService.active(+id);
    return userDto;
  }
}
