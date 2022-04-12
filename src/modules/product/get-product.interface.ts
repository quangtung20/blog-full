import { Product } from "src/database/entities/product.entity";

export interface GetProductInterface {
    status: string;

    result: number;

    products: Product[];
}