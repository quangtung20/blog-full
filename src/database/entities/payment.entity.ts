import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { PaymentItem } from "./payment-item.entity";
import { User } from "./user.entity";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    paymentID: string;

    @Column()
    address: string;

    @Column({ default: false })
    status: boolean;

    @ManyToOne(() => User, user => user.payments)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => PaymentItem, paymentItem => paymentItem.payment)
    cart: PaymentItem[];

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;
}