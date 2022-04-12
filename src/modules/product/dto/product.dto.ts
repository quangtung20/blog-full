import { Category } from "src/database/entities/category.entity";
import { Image } from "src/database/entities/image.entity";

export class ProductDto {
    product_id?: string;

    title: string;

    price: number;

    description: string;

    content: string;

    images: Image;

    category: Category;

    status: boolean;

    _id?: string;


}
