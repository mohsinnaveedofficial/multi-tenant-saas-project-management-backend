import { UserRole } from 'src/modules/user/enums/user-role.enum';

export type CurrentUser = {
  id: string;
  role: UserRole;
};
