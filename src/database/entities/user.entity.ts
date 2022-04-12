import { Exclude } from 'class-transformer';
import Sex from 'src/config/sex.enum';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import Role from '../../config/role.enum';
import { Cart } from './cart.entity';
import { Payment } from './payment.entity';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: Sex,
    default: Sex.male
  })
  public sex: Sex;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.user
  })
  public role: Role;

  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];

  @OneToMany(() => Cart, cart => cart.user, { eager: true })
  cart: Cart[];

  @OneToMany(() => Task, (task) => task.user, { onDelete: 'CASCADE', eager: true })
  tasks: Task[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at: Date;
}
