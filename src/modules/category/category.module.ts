import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from 'src/database/schemas/category.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    AuthModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule { }
