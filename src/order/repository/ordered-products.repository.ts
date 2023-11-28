import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { OrderedProductsDocument } from '../models';

@Injectable()
export class OrderedProductsRepository extends AbstractRepository<OrderedProductsDocument> {
  constructor(
    @InjectModel(Collections.orderedProducts)
    private readonly OrderedProductsModel: Model<OrderedProductsDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(OrderedProductsModel, connection);
  }
}
