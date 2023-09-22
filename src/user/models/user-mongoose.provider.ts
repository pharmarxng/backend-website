import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserSchema, UserDocument } from './user.model';

export const UserMongooseProvider = {
  name: 'users',
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const userSchema = UserSchema;
    userSchema.pre<UserDocument>('save', async function (next) {
      const user = this as UserDocument;
      if (!user.isModified('password')) return next();
      const salt = await bcrypt.genSalt(
        Number(config.get<string>('BCRYPT_HASH_SALT_ROUNDS')),
      );
      user.password = await bcrypt.hash(user.password, salt);
      next();
    });

    return userSchema;
  },
};
