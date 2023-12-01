import { ModelDefinition } from '@nestjs/mongoose';
import { Collections } from 'src/collections';
import { TransactionSchema } from './model';

export const paymentModuleCollections: ModelDefinition[] = [
  {
    name: Collections.transactions,
    schema: TransactionSchema,
  },
];
