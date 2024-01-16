import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { StoreRole } from 'src/users/users.entity';
import { StoreRoles } from '../decorators/store-roles.decorator';

@Injectable()
export class StoreRoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<StoreRole[]>(
      StoreRoles,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.matchRoles(roles, user.storeRole);
  }

  private matchRoles(roles: StoreRole[], userRole: StoreRole): boolean {
    return roles.some((role) => role === userRole);
  }
}
