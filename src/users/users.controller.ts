import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//Services
import { UsersService } from './users.service';

//Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { UserRolesDto } from './dto/UserRoles.dto';

@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post('registrar')
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

  @Put('editar/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
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

  @Post('roles')
  async addRoles(@Body() addRoles: UserRolesDto): Promise<UserDto> {
    const userDto = await this.usersService.addRoles(addRoles);
    return userDto;
  }

  @Post('roles/borrar')
  async deleteRoles(@Body() deleteRoles: UserRolesDto): Promise<UserDto> {
    const userDto = await this.usersService.deleteRoles(deleteRoles);
    return userDto;
  }
}
