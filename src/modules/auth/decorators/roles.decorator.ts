import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/enums/user-role.enum';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: [UserRole, ...UserRole[]]) =>
  SetMetadata(ROLE_KEY, roles);
