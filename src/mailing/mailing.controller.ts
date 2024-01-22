import { Controller, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Mailing')
@ApiBearerAuth()
@Controller({
  version: '1',
  path: 'mailing',
})
export class MailingController {
  constructor(readonly mailingService: MailingService) {}
  @Get('send-mail')
  public sendMail() {
    this.mailingService.testSendMail();
  }
}
