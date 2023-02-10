import { SetMetadata } from '@nestjs/common';

export const PUBLIC_DECORATOR_KEY = 'isPublic'
export const PERMISSIONS_DECORATOR_KEY = 'permissions'

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

export const Public = () => SetMetadata(PUBLIC_DECORATOR_KEY, true);

