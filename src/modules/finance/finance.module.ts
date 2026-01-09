import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Finance } from './entities/finance.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Finance]),UserModule],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports:[TypeOrmModule]
})
export class FinanceModule {}
