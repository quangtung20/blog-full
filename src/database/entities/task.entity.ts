import { Exclude } from 'class-transformer';
import { userInfo } from 'os';
import { User } from '../entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../../modules/tasks/task-status.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, user => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: User

}
