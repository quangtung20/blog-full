import { Cart } from "src/database/entities/cart.entity";
import { Product } from "src/database/entities/product.entity";

export class CreatePaymentDto {
    cart: any[]

    paymentID: string;

    address: {
        city: string
    };

    total: number;
}
