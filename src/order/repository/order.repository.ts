import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { OrderDocument } from '../models';

@Injectable()
export class OrderRepository extends AbstractRepository<OrderDocument> {
  constructor(
    @InjectModel(Collections.orders)
    private readonly OrderModel: Model<OrderDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(OrderModel, connection);
  }
}
