import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { PERMISSIONS_DECORATOR_KEY, PUBLIC_DECORATOR_KEY } from '../decorators/commons.decorator';
import { UsersService } from '../../users/users.service';
import { UtilsService } from '../../utils.service';



@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector,
    private _user: UsersService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_DECORATOR_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) { return true; }

    const routePermissions = this.reflector.get<number[]>(PERMISSIONS_DECORATOR_KEY, context.getHandler());
    if (!routePermissions) {
      return true;
    }
    const req = context.switchToHttp().getRequest(),
    userPermissions = (await this._user.getUserPermission(req.user.id) || []),
    match = UtilsService.matchArrays(userPermissions.map((i) => i.id), routePermissions)
    return match.length > 0;
  }
}
