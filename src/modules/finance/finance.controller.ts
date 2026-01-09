import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/enums/user-role.enum';
import { ParamUUIDPipe } from 'src/common/pipes/param-uuid.pipe';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto ,@Req() req) {
    return this.financeService.create(createFinanceDto,req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Req() req) {
    return this.financeService.findAll(req.user.id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id',new ParamUUIDPipe()) id: string, @Body() updateFinanceDto: UpdateFinanceDto,@Req() req) {
    return this.financeService.update(id, updateFinanceDto,req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string ,@Req() req) {
    return this.financeService.remove(id,req.user.id);
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.financeService.findOne(+id);
  // }
}
