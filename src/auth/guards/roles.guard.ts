import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const classRoles =
      this.reflector.get<string[]>('roles', context.getClass()) || [];
    const handlerRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];

    const roles = [...classRoles, ...handlerRoles];

    if (roles.length === 0) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!roles.includes(user.role)) throw new UnauthorizedException();
    return true;
  }
}
