import { Column, Entity, Generated, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Image {
    @PrimaryGeneratedColumn('uuid')
    _id: string;

    @Column({ unique: true })
    public_id: string;

    @Column()
    url: string;

}