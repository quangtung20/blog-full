import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentItem } from 'src/database/entities/payment-item.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { ProductRepository } from '../product/product.repository';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: PaymentRepository,
    @InjectRepository(ProductRepository) private readonly productRepository: ProductRepository,
    @InjectRepository(PaymentItem) private paymentItemRepository: Repository<PaymentItem>
  ) { }

  async create(createPaymentDto: CreatePaymentDto, user: User): Promise<string> {
    try {
      const { cart, paymentID, address, total } = createPaymentDto;
      const { _id, name, email } = user;
      const city = address.city;
      const newPayment = await this.paymentRepository.create({
        name, email, paymentID, user: user, address: city
      })
      const payment = await this.paymentRepository.save(newPayment);
      const paymentItems = cart.filter(item => {
        return (item.status === true)
      });

      for (let p of paymentItems) {
        const paymentItem = new PaymentItem();

        paymentItem.payment = payment;
        paymentItem.product_id = p.product_id;
        paymentItem.quantity = p.quantity;
        paymentItem.total = p.total;
        paymentItem.product = p;

        await this.paymentItemRepository.save(paymentItem);
      }


      paymentItems.filter(item => {
        if (item.status) {
          return this.sold(item._id, item.quantity, item.sold)
        }
      })


      return 'This action adds a new payment';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(): Promise<Payment[]> {
    try {
      const payments = await this.paymentRepository.find({
        relations: ['cart', 'cart.product', 'cart.product.images', 'user']
      });
      return payments;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async history(_id: string, user: User): Promise<Payment[]> {
    try {
      const history = await this.paymentRepository.find(
        {
          where: { user: user },
          relations: ['cart', 'cart.product', 'cart.product.images', 'user'],
          order: {
            created_at: 'DESC'
          }
        }
      );
      return history;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  sold = async (_id, quantity, oldSold) => {
    await this.productRepository.update(_id, {
      sold: quantity + oldSold
    })
  }
}
