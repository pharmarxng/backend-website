import { ModelDefinition } from '@nestjs/mongoose';
import { Collections } from 'src/collections';
import { ProductSchema } from './models/product.model';
import { CategorySchema } from './models/category.model';
import { ReviewsSchema } from './models/reviews.model';

export const productModuleCollections: ModelDefinition[] = [
  {
    name: Collections.products,
    schema: ProductSchema,
  },
  {
    name: Collections.categories,
    schema: CategorySchema,
  },
  {
    name: Collections.reviews,
    schema: ReviewsSchema,
  },
];
