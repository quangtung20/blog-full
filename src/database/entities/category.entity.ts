import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    _id: string;

    @Column({ unique: true })
    name: string;

    @OneToMany(type => Product, product => product.category, { onDelete: 'CASCADE' })
    products: Product[]
}