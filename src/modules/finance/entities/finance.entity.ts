import { Project } from 'src/modules/project/entities/project.entity';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectStatus } from '../enums/project-status.enum';

@Entity('finance')
export class Finance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  projectId: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @Column({ type: 'decimal', precision: 30, scale: 2, default: 0 })
  revenue: number;

  @Column({ type: 'decimal', precision: 30, scale: 2, default: 0 })
  cost: number;

  @Column({ type: 'decimal', precision: 30, scale: 2, default: 0 })
  profit: number;

  @Column({ type: 'date' })
  date: Date;


  @Column({type:"enum",enum:ProjectStatus,default:ProjectStatus.IN_PROGRESS})
  status:ProjectStatus;


  @CreateDateColumn()
  createdAt: Date;
}
