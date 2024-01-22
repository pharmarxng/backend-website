import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { OrderDocument } from 'src/order';
import { DeliveryType } from 'src/common';

@Injectable()
export class MailingService {
  private sendingEmail;
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
    this.sendingEmail = this.configService.get<string>('EMAIL');
  }

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('CLIENT_ID'),
      this.configService.get('CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );

    oauth2Client.setCredentials({
      refresh_token:
        this.configService.get('REFRESH_TOKEN') || process.env.REFRESH_TOKEN,
    });

    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log(err);
          reject('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('EMAIL'),
        clientId: this.configService.get('CLIENT_ID'),
        clientSecret: this.configService.get('CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendMail(data: OrderDocument, template: string) {
    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: data.email,
        from: this.sendingEmail, // sender address
        subject: 'Order Confirmation', // Subject line
        template,
        context: {
          // Data to be sent to template engine..
          customer_email: data.email,
          order_status_url: 'http://localhost:3000',
          firstName: data.firstName,
          lastName: data.lastName,
          // order_date: data.createdAt,
          id: data.id,
          orderId: data.orderId,
          products: data.products.map((product) => {
            return {
              product: product.productId,
              quantity: product.quantity,
              price: product.productId.price * product.quantity,
            };
          }),
          subTotal: data.subTotal,
          shippingFee: data.deliveryFee.price,
          total: data.total,
          address: data.address,
          isPaid: data.isPaid,
          deliveryType: data.deliveryType,
          deliverToUser: data.deliveryType === DeliveryType.delivery,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async testSendMail() {
    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to: 'sammiejay813@gmail.com',
        from: this.sendingEmail, // sender address
        subject: 'Order Confirmation', // Subject line
        template: 'order-confirmation',
        context: {
          // Data to be sent to template engine..
          code: '38320',
          customer_email: 'tets@test.com',
          order_status_url: 'http://localhost:3000',
          firstName: 'John',
          lastName: 'Smith',
          order_date: new Date(),
          order_name: 'uydjhvhda',
          order_total: 3440,
          help_url: 'http://localhost:3000',
          year: new Date().getFullYear(),
          orderNo: 'PH001',
          orderId: 'huhiqvuhadbu',
          products: [
            {
              product: {
                name: 'Book',
                image:
                  'https://images.ctfassets.net/hrltx12pl8hq/1fM15fDUZmFEbMgBRcQ3sg/a39055e22414adce43083bd0d2a7141a/thumb_creativerends_05_cyberpunk.jpg',
              },
              price: 300,
              quantity: 2,
            },
          ],
          subTotal: 10000,
          shippingFee: 2344,
          total: 12344,
          address: '10, Abimbola Way',
          isPaid: true,
          deliveryType: 'delivery',
          deliverToUser: true,
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
