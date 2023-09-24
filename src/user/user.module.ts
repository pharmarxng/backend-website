import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userModuleCollections } from './config';
// import { UserMongooseProvider } from './models/user-mongoose.provider';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature(userModuleCollections),
    // MongooseModule.forFeatureAsync([UserMongooseProvider]),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
