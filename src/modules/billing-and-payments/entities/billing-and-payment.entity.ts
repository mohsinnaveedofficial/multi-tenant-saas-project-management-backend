import { Tenant } from 'src/modules/tenant/entities/tenant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BillingStatus } from '../enums/billing-status.enum';

@Entity('billing_payments')
export class BillingAndPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  amount: number;

  @Column()
  planName: string;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column({ type: 'enum', enum: BillingStatus, default: BillingStatus.PENDING })
  status: BillingStatus;

  @Column({ type: 'date', nullable: true })
  paymentDate?: Date;

  @CreateDateColumn()
  createdAt: Date;
}
