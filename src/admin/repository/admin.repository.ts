import { Injectable } from '@nestjs/common';
import { AbstractRepository } from 'src/common/abstract.repository';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Collections } from 'src/collections';
import { AdminDocument } from '../models/admin.model';

@Injectable()
export class AdminRepository extends AbstractRepository<AdminDocument> {
  constructor(
    @InjectModel(Collections.admins)
    private readonly adminModel: Model<AdminDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(adminModel, connection);
  }
}
