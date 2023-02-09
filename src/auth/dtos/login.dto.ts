import { IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

// export class LoginDto {
//   id: number;
//   roles: any[];
//   name: string;
//   email: string;
//   avatar?: string;
//   accessToken: string;
//   refreshToken: string;
// }
export class LoginDto {
  user: UserLoginDto;
  // roles: string[];
  permissions: string[];
  accessToken: string;
  refreshToken: string;
  constructor(user: User) {
    this.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar
    }
  }
}

export interface UserLoginDto {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}
