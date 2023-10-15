import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { CategoryDocument } from '../models/category.model';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryDocument> {
  constructor(
    @InjectModel(Collections.categories)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(categoryModel, connection);
  }
}
