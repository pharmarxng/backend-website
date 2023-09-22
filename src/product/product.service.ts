import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindManyDto } from 'src/common';
import { ProductRepository } from './repository/product.repository';
import { AddProductDto } from './dtos/add-product.dto';

@Injectable()
export class ProductService {
  private readonly logger: Logger = new Logger(ProductService.name);

  constructor(private readonly productsRepo: ProductRepository) {}

  async getAllProducts(query: FindManyDto) {
    const foundProducts = await this.productsRepo.findManyWithPagination(
      {},
      query,
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved products',
      data: foundProducts,
    };
  }

  async getProductById(id: string) {
    const foundProductInDb = await this.productsRepo.findById(id);
    if (!foundProductInDb)
      throw new NotFoundException(`Product with id: ${id} not found`);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved product',
      data: foundProductInDb,
    };
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
