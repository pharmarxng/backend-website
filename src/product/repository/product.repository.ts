import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { ProductDocument } from '../models/product.model';

@Injectable()
export class ProductRepository extends AbstractRepository<ProductDocument> {
  constructor(
    @InjectModel(Collections.products)
    private readonly productModel: Model<ProductDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(productModel, connection);
  }
}
