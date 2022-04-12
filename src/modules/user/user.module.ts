import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { CartRepository } from '../cart/cart.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, CartRepository])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule { }
