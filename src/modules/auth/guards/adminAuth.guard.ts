import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Role } from 'src/modules/roles/enums/roles';

@Injectable()
export class AdminAuthGuard extends AuthGuard('jwt-access') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user_role: Role = req.user.roles;
    return user_role === Role.ADMIN;
  }
}
