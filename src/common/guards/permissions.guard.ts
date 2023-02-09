import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const Permissions = (...permissions: string[]) => SetMetadata('permissions', permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const routePermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    if (!routePermissions) {
      return true;
    }
    return true;
  }
}
