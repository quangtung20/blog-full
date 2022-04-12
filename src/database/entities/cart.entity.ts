import { Column, Entity, Generated, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "./payment.entity";
import { Product } from "./product.entity";
import { User } from "./user.entity";

@Entity()
export class Cart {

    @PrimaryGeneratedColumn()
    _id: string;

    @Column()
    product_id: string;

    @ManyToOne(() => Product, product => product.cart, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        referencedColumnName: 'product_id',
        name: 'product_id'
    })
    product: Product;

    @ManyToOne(type => User, user => user.cart)
    user: User;

    @Column({ default: 0 })
    quantity: number;

    @Column({ default: 0 })
    total: number;

}
