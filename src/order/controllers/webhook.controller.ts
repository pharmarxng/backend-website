import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import { WebhookService } from '../services';
import { isProd } from 'src/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Webhook')
@Controller({
  version: '1',
  path: 'app-payment',
})
export class WebhookController {
  constructor(
    private configService: ConfigService,
    private webhookSerice: WebhookService,
  ) {}
  @Post('webhook')
  @HttpCode(200)
  listen(@Req() req: Request, @Res() res: Response) {
    const eventObj = req.body;
    console.log('It got here into the webhook', eventObj);
    const hash = crypto
      .createHmac(
        'sha512',
        isProd
          ? process.env.PAYSTACK_SECRET_KEY
          : process.env.PAYSTACK_TEST_SECRET_KEY,
      )
      .update(JSON.stringify(req.body))
      .digest('hex');
    if (hash === req.headers['x-paystack-signature']) {
      this.webhookSerice.handleWebhookEvent(eventObj);
      return res.sendStatus(HttpStatus.OK);
    }
    return res.sendStatus(HttpStatus.BAD_REQUEST);
  }

  @Post('hello')
  handle() {
    return 'hello';
  }
}
