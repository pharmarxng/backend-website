import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AdminDocument, AdminSchema } from './admin.model';
import { Collections } from 'src/collections';

export const AdminMongooseProvider = {
  name: Collections.admins,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const adminSchema = AdminSchema;
    adminSchema.pre<AdminDocument>('save', async function (next) {
      const admin = this as AdminDocument;
      console.log('It called the preSave function');
      if (!admin.isModified('password')) return next();
      const salt = await bcrypt.genSalt(
        Number(config.get<string>('BCRYPT_HASH_SALT_ROUNDS')),
      );
      admin.password = await bcrypt.hash(admin.password, salt);
      next();
    });

    return adminSchema;
  },
};
