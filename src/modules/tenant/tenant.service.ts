import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class TenantService {

  constructor(@InjectRepository(Tenant) private tenantRepo:Repository<Tenant>){}

  async create(createTenantDto: CreateTenantDto,manager?:EntityManager) {
   const tenant= this.tenantRepo.create(createTenantDto);
   if(manager){
    return manager.save(tenant)
   }
  await this.tenantRepo.save(tenant);
  return tenant 
  }

  // findAll() {
  //   return `This action returns all tenant`;
  // }

  async findOne(id: string) {
    return await this.tenantRepo.findOneBy({id})
  }

  // update(id: number, updateTenantDto: UpdateTenantDto) {
  //   return `This action updates a #${id} tenant`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tenant`;
  // }
}
