import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

interface UserRole {
  id: number;
  name: string;
}

export class LoginDto {
  user: UserLoginDto;
  // roles: string[];
  permissions: string[];
  roles: string[];
  accessToken: string;
  refreshToken: string;
  constructor(user: User) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      organismTypeId: user.organismTypeId,
      organismId: user.organismId,
      suborganismId: user.suborganismId,
    };
  }
}

export interface UserLoginDto {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  organismTypeId: number;
  organismId: number;
  suborganismId: number;
}
