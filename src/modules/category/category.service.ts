import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Model } from "mongoose";
import { Category, CategoryDocument } from 'src/database/schemas/category.schema';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
    // @InjectRepository(CategoryRepository)
    // private categoryRepository: CategoryRepository,
  ) { }

  // async createCategory(createCategoryDto: CreateCategoryDto): Promise<string> {
  //   const { name } = createCategoryDto;
  //   try {
  //     const category = await this.categoryRepository.findOne({ name });
  //     if (category) {
  //       throw new BadRequestException(`this category ${name} already exists`);
  //     }
  //     await this.categoryRepository.save(createCategoryDto);
  //     return 'Created a category'
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }

  // async getCategories(): Promise<Category[]> {
  //   try {
  //     const categories = await this.categoryRepository.find()
  //     return categories;
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async update(_id: string, updateCategoryDto: UpdateCategoryDto): Promise<string> {
  //   try {

  //     await this.categoryRepository.update(_id, updateCategoryDto);
  //     return 'Updated a category';
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  // async remove(id: string): Promise<string> {
  //   try {
  //     const category = await this.categoryRepository.findOne(id, {
  //       relations: ['products']
  //     })
  //     if (category.products.length)
  //       throw new InternalServerErrorException('You must delete all products before delete category');
  //     await this.categoryRepository.delete(id);
  //     return 'Deleted a Category';
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
  async createCategory(user: any, name: string) {
    try {
      const check = await this.categoryModel.findOne({ name });
      if (check) {
        throw new BadRequestException({ msg: 'This category is already exists' });
      }
      const newCat = await this.categoryModel.create({ name })

      console.log(newCat);

      return { newCategory: newCat };

    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }

  async getCategories() {
    try {
      const categories = await this.categoryModel.find().sort('-createdAt');
      return { categories };
    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }

  async updateCategory(id: string, name: string) {
    try {
      const category = await this.categoryModel.findByIdAndUpdate({
        _id: id
      }, {
        name: name.toLowerCase()
      });

      return { msg: 'Update Success!' };
    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }

  async deleteCategory(id: string) {
    try {
      await this.categoryModel.findByIdAndDelete(id);
    } catch (error) {
      throw new InternalServerErrorException({ msg: error.message });
    }
  }
}
