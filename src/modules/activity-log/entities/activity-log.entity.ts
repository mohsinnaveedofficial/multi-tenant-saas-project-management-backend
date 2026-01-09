import { Project } from 'src/modules/project/entities/project.entity';
import { Task } from 'src/modules/task/entities/task.entity';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  user: User;

  @Column()
  actionType: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  relatedProjectId?: string;

  @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
  relatedProject?: Project;

  @Column({ nullable: true })
  relatedTaskId?: string;

  @ManyToOne(() => Task, { onDelete: 'SET NULL', nullable: true })
  relatedTask?: Task;

  @CreateDateColumn()
  createdAt: Date;
}
