import { Category } from "src/database/entities/category.entity";
import { Image } from "src/database/entities/image.entity";
import { Product } from "src/database/entities/product.entity";
import { User } from "src/database/entities/user.entity";

export class CartsDto {
    cart: {
        product: Product;
        quantity: number;
        product_id: string;
        user: User;
        image: Image;
        category: Category;

    }[]
}