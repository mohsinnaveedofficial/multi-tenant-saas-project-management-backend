import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyName: string;

  @Column({ unique: true })
  companyEmail: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true }) 
  address?: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
    default: SubscriptionPlan.Free,
  })
  subscriptionPlan: SubscriptionPlan;

  @Column({ default: 3 })
  planProjectLimit: number;

  @Column({ default: 5 })
  planTeamLimit: number;

  @Column({
    nullable: true,
  })
  nextBillingDate?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
