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
import { PageDto } from '../common/dtos/page.dto';
import { FindByDependencyDto } from './dto/find-by-dependency.dto';
import { ProfileDto } from './dto/profile.dto';
import { EditProfileDto } from './dto/edit-profile.dto';

//Interfaces
import { TypePermissions } from '../common/interfaces/commons.interface';

//Decorators
import { Permissions } from '../common/decorators/commons.decorator';


@Controller('usuarios')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post()
  @Permissions(TypePermissions.CREATE_USER)
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions(TypePermissions.GET_LIST_USER)
  findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<PageDto<UserDto>> {
    return this.usersService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @Permissions(TypePermissions.GET_LIST_USER)
  findOne(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id/editar')
  @Permissions(TypePermissions.EDIT_USER)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,    
  ): Promise<UserDto> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id/eliminar')
  @Permissions(TypePermissions.DEACTIVATE_USER)
  remove(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.remove(+id);
  }

  @Patch(':id/activar')
  @Permissions(TypePermissions.CREATE_USER)
  active(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.active(+id);
  }

  @Post('findByDependency')
  @Permissions(TypePermissions.CREATE_PROPOSAL)
  findLinkDependencyInfo(@Body() findByDependencyId: FindByDependencyDto): Promise<UserDto> {
    return this.usersService.findUserByDependency(findByDependencyId);
  }

  //Profile endpoints
  @Patch('profile/:id/editar')
  @Permissions(TypePermissions.EDIT_PROFILE)
  async editProfile(@Param('id') id: string, 
    @Body() editProfileDto: EditProfileDto): Promise<ProfileDto> {
    const editedProfile = await this.usersService.editProfile(+id, editProfileDto);
    return editedProfile;
  }
}
