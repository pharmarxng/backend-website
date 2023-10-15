import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from '../repository/category.repository';
import { AddCategoryDto } from '../dtos/add-category.dto';

@Injectable()
export class CategoryService {
  private readonly logger: Logger = new Logger(CategoryService.name);

  constructor(private readonly categoryRepo: CategoryRepository) {}

  async getAllCategories() {
    const foundCategorys = await this.categoryRepo.find();

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully retrieved Categories',
      data: foundCategorys,
    };
  }

  async getCategoryById(id: string) {
    try {
      const foundCategoryInDb = await this.categoryRepo.findById(id);
      if (!foundCategoryInDb) {
        throw new NotFoundException(`Category with id: ${id} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully retrieved Category',
        data: foundCategoryInDb,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: `Category with id: ${id} not found`,
      };
    }
  }

  async addCategory(body: AddCategoryDto) {
    const addedCategory = await this.categoryRepo.create({ ...body });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Successfully added category',
      data: addedCategory,
    };
  }
}
