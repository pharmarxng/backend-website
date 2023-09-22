import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { IUser } from 'src/common/interfaces/user/user.interface';

@Injectable()
export class UserService {
  logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepo: UserRepository) {}

  async findUserbyEmail(email: string) {
    return this.userRepo.findOne({
      email: { $ne: null, $eq: email },
    });
  }

  async createUser(user: Partial<IUser>) {
    await this.userRepo.create(user);
  }
}
