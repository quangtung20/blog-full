import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import Role from 'src/config/role.enum';
import { Payment } from 'src/database/entities/payment.entity';
import { User } from 'src/database/entities/user.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentService } from './payment.service';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('api/payment')
  @UseGuards(RoleGuard(Role.user))
  create(@Body() createPaymentDto: CreatePaymentDto, @GetUser() user: User): Promise<string> {
    return this.paymentService.create(createPaymentDto, user);
  }

  @Get('api/payment')
  @UseGuards(RoleGuard(Role.admin))
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get('user/history')
  @UseGuards(RoleGuard(Role.user))
  history(@GetUser() user: User): Promise<Payment[]> {
    return this.paymentService.history(user._id, user);
  }

}
