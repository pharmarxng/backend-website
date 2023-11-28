import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { OrderDiscountVoucherDocument } from '../models';

@Injectable()
export class OrderDiscountVoucherRepository extends AbstractRepository<OrderDiscountVoucherDocument> {
  constructor(
    @InjectModel(Collections.orderDiscountVoucher)
    private readonly OrderDiscountVoucherModel: Model<OrderDiscountVoucherDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(OrderDiscountVoucherModel, connection);
  }
}
