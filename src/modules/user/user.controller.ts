import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import RoleGuard from 'src/guards/role.guard';
import Role from 'src/config/role.enum';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Cart } from 'src/database/entities/cart.entity';
import { CartsDto } from './dto/carts.dto';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';




@Controller('')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,

  ) { }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // @UseGuards(RoleGuard('admin'))
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get('/infor')
  // @UseGuards(RoleGuard(Role.user))
  // findOne(@GetUser() user: User): Promise<User> {
  //   return this.userService.findOne(user._id);
  // }

  // @Put('/update/:id')
  // @UseGuards(RoleGuard(Role.user))
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<string> {
  //   return this.userService.update(id, updateUserDto);
  // }

  // @Put('/password/:id')
  // @UseGuards(RoleGuard(Role.user))
  // changPassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto): Promise<string> {
  //   return this.userService.changePassword(id, changePasswordDto);
  // }

  // @Delete(':id')
  // @UseGuards(RoleGuard(Role.admin))
  // remove(@Param('id') id: string): Promise<string> {
  //   return this.userService.remove(id);
  // }

  // @Patch('/addcart')
  // @UseGuards(RoleGuard(Role.user))
  // addCart(@GetUser() user: User, @Body() cart: CartsDto): Promise<string> {
  //   return this.userService.addCart(user, cart);
  // }
  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Patch('reset_password')
  @UseGuards(RoleGuard('user'))
  resetPassword(
    @GetUser() user: any,
    @Body('password') password: string
  ) {
    return this.userService.resetPassword(user, password);
  }

  @Patch('user')
  @UseGuards(RoleGuard('user'))
  updateUser(
    @GetUser() user: any,
    @Body('avatar') avatar: string,
    @Body('name') name: string
  ) {
    return this.userService.updateUser(user, avatar, name);
  }

  @Get('haha')
  @UseGuards(RoleGuard('user'))
  test() {
    console.log('hahah');
  }

}
