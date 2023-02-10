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
import { PageDto } from '../common/dtos/page.dto';
import { Permissions } from '../common/decorators/commons.decorator';

@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions('user_get_all')
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    return this.usersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id/editar')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id/eliminar')
  remove(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.remove(+id);
  }

  @Patch(':id/activar')
  active(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.active(+id);
  }

  // @Post('roles')
  // addRoles(@Body() addRoles: UserRolesDto): Promise<UserDto> {
  //   return this.usersService.addRoles(addRoles);
  // }

  // @Post('roles/borrar')
  // async deleteRoles(@Body() deleteRoles: UserRolesDto): Promise<UserDto> {
  //   const userDto = await this.usersService.deleteRoles(deleteRoles);
  //   return userDto;
  // }
}
