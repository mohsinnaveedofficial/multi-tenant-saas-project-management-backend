import { Client } from 'src/modules/client/entities/client.entity';
import { Tenant } from 'src/modules/tenant/entities/tenant.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectStatus } from '../enums/project-status.enum';
import { Projectcomment } from 'src/modules/projectcomments/entities/projectcomment.entity';
import { ProjectAssignedUser } from 'src/modules/project-assigned-users/entities/project-assigned-user.entity';
import { Task } from 'src/modules/task/entities/task.entity';

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenantId: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  clientId: string;

  @ManyToOne(() => Client, { onDelete: 'CASCADE' })
  client: Client;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  budget?: number;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.NOT_STARTED,
  })
  status: ProjectStatus;

  @OneToMany(() => Projectcomment, (comment) => comment.project)
  comments: Projectcomment[];

  @OneToMany(() => ProjectAssignedUser, (assignedUser) => assignedUser.project)
  assignedUsers: ProjectAssignedUser[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @Column({ nullable: true })
  start?: Date;

  @Column({ nullable: true })
  end?: Date;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
