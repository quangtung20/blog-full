import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) { }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<string> {
    const { name } = createCategoryDto;
    try {
      const category = await this.categoryRepository.findOne({ name });
      if (category) {
        throw new BadRequestException(`this category ${name} already exists`);
      }
      await this.categoryRepository.save(createCategoryDto);
      return 'Created a category'
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.find()
      return categories;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(_id: string, updateCategoryDto: UpdateCategoryDto): Promise<string> {
    try {

      await this.categoryRepository.update(_id, updateCategoryDto);
      return 'Updated a category';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      const category = await this.categoryRepository.findOne(id, {
        relations: ['products']
      })
      if (category.products.length)
        throw new InternalServerErrorException('You must delete all products before delete category');
      await this.categoryRepository.delete(id);
      return 'Deleted a Category';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
