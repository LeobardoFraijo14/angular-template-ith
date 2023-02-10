import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { PERMISSIONS_DECORATOR_KEY, PUBLIC_DECORATOR_KEY } from '../decorators/commons.decorator';



@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_DECORATOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) { return true; }

    const routePermissions = this.reflector.get<string[]>(PERMISSIONS_DECORATOR_KEY, context.getHandler());
    if (!routePermissions) {
      return true;
    }
    return true;
  }
}
