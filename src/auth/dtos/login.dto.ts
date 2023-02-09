import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  id: number;
  roles: any[];
  name: string;
  email: string;
  avatar?: string;
  accessToken: string;
  refreshToken: string;
}
