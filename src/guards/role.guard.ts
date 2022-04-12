import Role from '../config/role.enum';
import { CanActivate, ExecutionContext, ForbiddenException, mixin, Type, UnauthorizedException } from '@nestjs/common';
import JwtAuthenticationGuard from './jwt-authentication.guard';


const RoleGuard = (role: Role | string): Type<CanActivate> => {
    class RoleGuardMixin extends JwtAuthenticationGuard {
        async canActivate(context: ExecutionContext) {
            await super.canActivate(context);

            const request = context.switchToHttp().getRequest();
            const user = request.user;

            if (user?.role === role || user?.role === 'admin') {
                return true;
            } else {
                throw new ForbiddenException('You are not alowed to do that!');
            }

        }
    }

    return mixin(RoleGuardMixin);
}

export default RoleGuard;