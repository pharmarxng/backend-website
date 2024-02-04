// Import required modules and entities
import { Injectable, Logger } from '@nestjs/common';
import { AdminRole } from 'src/common';
import { AdminRepository } from '../repository/admin.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminSeeder {
  private readonly logger: Logger = new Logger(AdminSeeder.name);
  constructor(
    private readonly adminRepo: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async seedAdminUser() {
    try {
      const adminPhone = this.configService.get<string>('ADMIN_PHONE');
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
      const adminFirstname = this.configService.get<string>('AMIN_FIRSTNAME');
      const adminLastname = this.configService.get<string>('ADMIN_LASTNAME');
      const adminEmail = this.configService.get<string>('ADMIN_EMAIL');

      const foundAdminInDb = await this.adminRepo.findOne({
        email: adminEmail,
      });

      if (foundAdminInDb) return;

      await this.adminRepo.create({
        phone: adminPhone,
        email: adminEmail,
        password: adminPassword,
        firstName: adminFirstname,
        lastName: adminLastname,
        roles: [AdminRole.SUPER_ADMIN],
      });

      this.logger.log('Admin user seeded successfully.');
    } catch (error) {
      this.logger.error('Error seeding admin user:', error);
    }
  }
}
