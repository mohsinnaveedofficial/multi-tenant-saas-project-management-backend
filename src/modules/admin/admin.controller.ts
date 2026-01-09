import { Controller, Get, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminServices: AdminService) {}

  @Roles(UserRole.ADMIN)
  @Get('dashboard')
  dashboard(@Req() req) {
    return this.adminServices.dashboard(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get('finance')
  finance(@Req() req) {
    return this.adminServices.financePageData(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get('report')
  report(@Req() req) {
    return this.adminServices.ReportPageData(req.user.id);
  }

   @Roles(UserRole.ADMIN)
  @Get('billing')
  billing(@Req() req) {
    return this.adminServices.billingPageData(req.user.id);
  }


}
