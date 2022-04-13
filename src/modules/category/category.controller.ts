import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import Role from 'src/config/role.enum';
import { Category } from 'src/database/entities/category.entity';
import { GetUser } from 'src/decorators/get-user.decorator';
import RoleGuard from 'src/guards/role.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
  ) { }

  // @Post()
  // @UseGuards(RoleGuard(Role.admin))
  // createCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<string> {
  //   return this.categoryService.createCategory(createCategoryDto);
  // }

  // @Get()
  // getCategories(): Promise<Category[]> {
  //   return this.categoryService.getCategories();
  // }

  // @Put(':id')
  // @UseGuards(RoleGuard(Role.admin))
  // update(@Param('id') _id: string, @Body() updateCategoryDto: UpdateCategoryDto): Promise<string> {
  //   return this.categoryService.update(_id, updateCategoryDto);
  // }

  // @Delete(':id')
  // @UseGuards(RoleGuard(Role.admin))
  // remove(@Param('id') id: string): Promise<string> {
  //   return this.categoryService.remove(id);
  // }

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Post()
  @UseGuards(RoleGuard('admin'))
  createCategory(
    @GetUser() user: any,
    @Body('name') name: string
  ) {
    return this.categoryService.createCategory(user, name);
  }

  @Patch(':id')
  @UseGuards(RoleGuard('admin'))
  updateCategory(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.categoryService.updateCategory(id, name);
  }

  @Delete(':id')
  @UseGuards(RoleGuard('admin'))
  deleteCategory(
    @Param('id') id: string,
  ) {
    return this.categoryService.deleteCategory(id);
  }

}
