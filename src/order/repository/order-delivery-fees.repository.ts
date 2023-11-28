import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { OrderDeliveryFeesDocument } from '../models';

@Injectable()
export class OrderDeliveryFeesRepository extends AbstractRepository<OrderDeliveryFeesDocument> {
  constructor(
    @InjectModel(Collections.orderDeliveryFees)
    private readonly OrderDeliveryFeesModel: Model<OrderDeliveryFeesDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(OrderDeliveryFeesModel, connection);
  }
}
