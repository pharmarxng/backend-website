import { Module } from '@nestjs/common';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { ConfigService } from '@nestjs/config';
import { ZeptoMailService } from './Zeptomail.service';

@Module({
  controllers: [MailingController],
  providers: [MailingService, ConfigService, ZeptoMailService],
  exports: [MailingService, ZeptoMailService],
})
export class MailingModule {}
