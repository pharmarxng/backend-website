import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient } from 'zeptomail';

@Injectable()
export class ZeptoMailService {
  private logger: Logger = new Logger(ZeptoMailService.name);
  private client;
  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get('ZEPTO_AUTH_TOKEN');
    const url = 'api.zeptomail.com/';
    this.client = new SendMailClient({ url, token });
  }

  async sendmail(
    templateId: string,
    to: { email: string; name: string },
    context: Record<string, any>,
  ) {
    try {
      const response = await this.client.sendMailWithTemplate({
        template_key: templateId,
        from: {
          address: 'info@pharmarxng.com',
          name: 'pharmarx',
        },
        to: [
          {
            email_address: {
              address: to.email,
              name: to.name,
            },
          },
        ],
        merge_info: context,
        cc: [
          {
            email_address: {
              address: 'pharmarxng@gmail.com',
              name: 'pharmarxng',
            },
          },
        ],
      });
      console.log({ response });
      return response;
    } catch (error) {
      console.log({ error });
      this.logger.error(error);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
