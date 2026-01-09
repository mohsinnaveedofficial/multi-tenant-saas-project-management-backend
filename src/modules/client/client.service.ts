import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client) private clientRepo: Repository<Client>,
    private userService: UserService,
  ) {}

  async create(createClientDto: CreateClientDto, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const client = this.clientRepo.create({
      companyName: createClientDto.companyName,
      name: createClientDto.name,
      email: createClientDto.email,
      phone: createClientDto.phone,
      tenantId: user.tenantId,
    });
    await this.clientRepo.save(client);
    return client;
  }

  async findAll(userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const tenantId = user.tenantId;
    const clients = await this.clientRepo.find({
      where: { tenantId },
      relations: ['projects'],
    });

    const result = clients.map((client) => ({
      ...client,
      projectCount: client.projects.length,
    }));

    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  async update(id: string, updateClientDto: UpdateClientDto, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const client = await this.clientRepo.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID ${id} not found for this tenant`,
      );
    }
    await this.clientRepo.update({ id }, updateClientDto);

    return await this.clientRepo.findOne({ where: { id } });
  }

  async remove(id: string, userId: string) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const client = await this.clientRepo.findOne({
      where: { id, tenantId: user.tenantId },
    });

    if (!client) {
      throw new NotFoundException(
        `Client with ID ${id} not found for this tenant`,
      );
    }
    const result = await this.clientRepo.delete(id);
    if (result.affected === 0) {
      throw new ConflictException(`Client with ID ${id} not deleted`);
    }
    return { message: 'Successfully Deleted' };
  }
}
