import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindManyDto } from 'src/common';
import { ProductRepository } from '../repository/product.repository';
import { AddProductDto } from '../dtos/add-product.dto';
import { GetAllProductQueryDto } from '../dtos/get-products.dto';
import { CategoryRepository } from '../repository';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(
    private readonly productsRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async getAllProducts(query: GetAllProductQueryDto) {
    const { search, categoryId } = query;
    const condition = {};

    if (search) {
      condition['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (categoryId) {
      condition['category'] = categoryId;
    }

    const foundProducts = await this.productsRepo.findManyWithPagination(
      condition,
      query,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved products',
      data: foundProducts,
    };
  }

  async getProductsByCategory(query: FindManyDto, categoryId: string) {
    const foundProducts = await this.productsRepo.findManyWithPagination(
      { category: categoryId },
      query,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved products',
      data: foundProducts,
    };
  }

  async getFlashProducts() {
    const foundCategory = await this.categoryRepo.find();
    console.log({ foundCategory });
    const foundProductsInDb = [];
    for (let index = 0; index < foundCategory.length; index++) {
      const element = foundCategory[index];
      const foundProd = await this.productsRepo.findOne(
        {
          category: element._id,
        },
        null,
        { sort: { rating: -1 } },
      );
      foundProductsInDb.push(foundProd);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved products',
      data: foundProductsInDb,
    };
  }

  async getTrendingProducts() {
    const foundProducts = await this.productsRepo.find({}, null, {
      sort: { rating: -1 },
      limit: 8,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved products',
      data: foundProducts,
    };
  }

  async getProductById(id: string) {
    try {
      const foundProductInDb = await this.productsRepo.findById(id);
      if (!foundProductInDb)
        throw new NotFoundException(`Product with id: ${id} not found`);

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully retrieved product',
        data: foundProductInDb,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Product with id: ${id} not found`,
      };
    }
  }

  async addProduct(body: AddProductDto) {
    const addedProduct = await this.productsRepo.create({ ...body });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully added product',
      data: addedProduct,
    };
  }
}
