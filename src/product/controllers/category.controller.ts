import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { MongoIdDto } from 'src/common';

@ApiTags('Category')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'category',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('get-all')
  @ApiOperation({ summary: `Lists all Categorys` })
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: `Gets a Category by id` })
  async getCategoryById(@Param() params: MongoIdDto) {
    return this.categoryService.getCategoryById(params.id);
  }
}
