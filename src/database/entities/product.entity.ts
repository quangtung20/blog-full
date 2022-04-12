import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./cart.entity";
import { Category } from "./category.entity";
import { Image } from "./image.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    _id: string;

    @Column({ unique: true, nullable: false })
    product_id: string;

    @Column()
    title: string;

    @Column()
    price: number;

    @Column()
    description: string;

    @Column()
    content: string;

    @Column({ default: false })
    checked: boolean;

    @Column({ default: 0 })
    sold: number;

    @Column({ default: true })
    status: boolean;

    @OneToOne(() => Image)
    @JoinColumn()
    images: Image;

    @ManyToOne(type => Category, category => category.products)
    category: Category;

    @OneToMany(() => Cart, cart => cart.product, {
        createForeignKeyConstraints: false
    })
    @JoinColumn({
        referencedColumnName: 'product_id',
        name: 'product_id'
    })
    cart: Cart[]

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at: Date;


}