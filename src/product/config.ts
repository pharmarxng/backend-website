import { ModelDefinition } from '@nestjs/mongoose';
import { Collections } from 'src/collections';
import { ProductSchema } from './models/product.model';

export const productModuleCollections: ModelDefinition[] = [
  {
    name: Collections.products,
    schema: ProductSchema,
  },
];
