import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDto } from './dto/product.dto';
import { GetProductInterface } from './get-product.interface';
import { ProductRepository } from './product.repository';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository
  ) { }

  async create(productDto: ProductDto): Promise<string> {
    try {
      if (!productDto.images) throw new BadRequestException('No image upload');

      const product = await this.productRepository.findOne({ product_id: productDto.product_id });
      if (product) {
        new BadRequestException('This product already exists.');
      }

      productDto.title = productDto.title.toLowerCase();
      delete productDto?._id;

      await this.productRepository.save(productDto);

      return 'Created a product';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getProducts(queryString): Promise<GetProductInterface> {
    try {

      const page: number = <number>queryString.page * 1 || 1;
      const limit: number = <number>queryString.limit * 1 || 9;
      const skip = limit * (page - 1);
      const category = queryString.category;

      if (Object.keys(queryString).length === 0) {
        const products = await this.productRepository.createQueryBuilder('product')
          .where('product.status=:status', { status: true })
          .leftJoinAndSelect('product.images', 'images')
          .leftJoinAndSelect('product.category', 'category')
          .orderBy('product.created_at', 'DESC')
          .getMany()

        return { status: 'success', result: products.length, products: products };
      } else {

        const title = queryString.title;
        let search: string = queryString.sort || '';
        let inc: ('ASC' | 'DESC') = 'ASC';

        if (search.search('-') !== -1) {
          inc = 'DESC';
          search = search.split('-').join('');
        }

        const query = this.productRepository.createQueryBuilder('product')
          .where('product.status=:status', { status: true })
          .leftJoinAndSelect('product.images', 'images')
          .leftJoinAndSelect('product.category', 'category');

        if (queryString.sort) {
          query.orderBy(`product.${search}`, `${inc}`);
        } else {
          query.orderBy(`product.created_at`, `DESC`);
        }

        if (title) {
          query.andWhere(
            '(LOWER(product.title) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search) OR LOWER(product.content) LIKE LOWER(:search))',
            { search: `%${title}%` },
          )
        }

        if (category) {
          query.andWhere('product.category = :category', { category: category });
        }

        query.take(limit);

        const products = await query.getMany();

        return { status: 'success', result: products.length, products: products };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }


  async update(id: string, updateProductDto: ProductDto): Promise<string> {
    try {
      if (!updateProductDto.images) {
        throw new BadRequestException('No image upload');
      }
      await this.productRepository.update(id, updateProductDto);

      return 'Updated a Product';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<string> {
    try {
      await this.productRepository.update(id, { status: false });
      return 'Deleted a Product';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
