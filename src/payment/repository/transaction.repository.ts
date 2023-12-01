import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { TransactionDocument } from '../model';

@Injectable()
export class TransactionRepository extends AbstractRepository<TransactionDocument> {
  constructor(
    @InjectModel(Collections.transactions)
    private readonly TransactionModel: Model<TransactionDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(TransactionModel, connection);
  }
}
