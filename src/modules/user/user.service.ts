import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { User } from 'src/database/entities/user.entity';
import { CartRepository } from '../cart/cart.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CartsDto } from './dto/carts.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @InjectRepository(CartRepository)
    private cartRepository: CartRepository,
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(_id: string): Promise<User> {
    try {
      console.log(_id);
      const user = await this.userRepository.findOne(_id,
        { relations: ['cart', 'cart.product', 'cart.product.images'] });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    await this.userRepository.update(id, updateUserDto);
    return 'Done update';
  }

  async remove(id: string): Promise<string> {
    try {

      await this.userRepository.delete(id);

      return 'User has been deleted ...';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    };
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<string> {
    try {
      const user = await this.userRepository.findOne(id);

      const { newPassword, oldPassword, confirmPassword } = changePasswordDto;
      if (newPassword !== confirmPassword) {
        throw new BadRequestException('New password does not match')
      }

      const checkOldPass = await bcrypt.compare(oldPassword, user.password);
      if (!checkOldPass) {
        throw new BadRequestException('Old password does not match')
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await this.userRepository.update(user._id, { password: hashedPassword });

      return 'Done change password';
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async addCart(user: User, cart: CartsDto): Promise<string> {
    try {
      const check = await this.userRepository.findOne(user._id);
      if (!check) {
        throw new BadRequestException('User does not exist.');
      }

      await this.cartRepository.createQueryBuilder().delete().from(Cart).where('cart.user_id=:user', { user: user._id }).execute();

      for (let i: number = 0; i < cart.cart.length; i++) {
        // if (cart.cart[i].product.status){}
        const newCart = {
          user: user,
          product_id: cart.cart[i].product_id.toString(),
          quantity: Number(cart.cart[i].quantity),
        }

        await this.cartRepository.save(newCart);
      }


      return 'updated your cart';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
