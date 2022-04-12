import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentItem } from 'src/database/entities/payment-item.entity';
import { Payment } from 'src/database/entities/payment.entity';
import { ProductRepository } from '../product/product.repository';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, ProductRepository, PaymentItem]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule { }
