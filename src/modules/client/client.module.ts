import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports:[TypeOrmModule.forFeature([Client]) ,UserModule],
  controllers: [ClientController],
  providers: [ClientService],
  exports:[TypeOrmModule]
})
export class ClientModule {}
