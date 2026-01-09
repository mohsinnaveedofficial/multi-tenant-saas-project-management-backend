import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Finance } from './entities/finance.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance) private financeRepo: Repository<Finance>,
    private userServices: UserService,
  ) {}
  async create(createFinanceDto: CreateFinanceDto, userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const finance = this.financeRepo.create({
      cost: createFinanceDto.cost,
      profit: createFinanceDto.profit,
      projectId: createFinanceDto.projectId,
      revenue: createFinanceDto.revenue,
      status: createFinanceDto.status,
      tenantId: user.tenantId,
      date: new Date(),
    });

    await this.financeRepo.save(finance);

    return finance;
  }

  async findAll(userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    return await this.financeRepo.find({
      where: { tenantId: user.tenantId },
      relations: { project: true },
    });
  }

  async update(id: string, updateFinanceDto: UpdateFinanceDto, userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const finance = await this.financeRepo.findOne({
      where: { id: id, tenantId: user.tenantId },
    });
    if (!finance) {
      throw new NotFoundException(`Finance record not found`);
    }

    await this.financeRepo.update(id, updateFinanceDto);

    return await this.financeRepo.findOne({
      where: { id: id },
      relations: { project: true },
    });
  }

  async remove(id: string, userId: string) {
    const user = await this.userServices.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const finance = await this.financeRepo.findOne({
      where: { id: id, tenantId: user.tenantId },
    });
    if (!finance) {
      throw new NotFoundException(`Finance record not found`);
    }

    const result = await this.financeRepo.delete(id);
    if (result.affected === 0) {
      throw new ConflictException('Finance Record is not deleted');
    }

    return { message: 'Finance record deleted Successfully' };
  }
}
