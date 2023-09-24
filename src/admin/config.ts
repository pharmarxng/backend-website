import { ModelDefinition } from '@nestjs/mongoose';
import { Collections } from 'src/collections';
import { AdminSchema } from './models/admin.model';

export const adminModuleCollections: ModelDefinition[] = [
  {
    name: Collections.admins,
    schema: AdminSchema,
  },
];
