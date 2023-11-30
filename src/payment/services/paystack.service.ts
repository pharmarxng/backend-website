import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Observable, map, tap } from 'rxjs';
import {
  ChargeAuthorizationPayload,
  IDisableSubscription,
  IGetBankList,
  IGetTransferRecipientDto,
  IInitializeTransferDto,
  isProd,
} from 'src/common';

@Injectable()
export class PaystackPayService {
  constructor(
    private http: HttpService,
    private readonly configService: ConfigService,
  ) {}

  API_URL = 'https://api.paystack.co/';
  private readonly PAYSTACK_SECRET_KEY: string = isProd
    ? this.configService.getOrThrow<string>('PAYSTACK_SECRET_KEY')
    : this.configService.getOrThrow<string>('PAYSTACK_TEST_SECRET_KEY');
  private readonly logger: Logger = new Logger(PaystackPayService.name);

  private instance = new HttpService(
    axios.create({
      baseURL: this.API_URL,
      headers: {
        Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
        'content-Type': 'application/json',
        'cache-control': 'no-cache',
      },
    }),
  );

  /**
   * It makes a POST request to the Paystack API to initialize a transaction
   * @param {any} data - This is the data object that contains the transaction details.
   * @returns The response from the API call.
   */
  initializeTransaction(data: any): Observable<any> {
    return this.instance.post(`transaction/initialize`, data).pipe(
      map((res) => res.data),
      tap((res) => {
        this.logger.log(res);
      }),
    );
  }

  /**
   * It makes a GET request to the Paystack API to verify a transaction
   * @param {string} reference - The transaction reference you got from the initial transaction
   * request.
   */
  verifyTransaction(reference: string): Observable<any> {
    return this.instance.get(`transaction/verify/${reference}`).pipe(
      map((res) => res.data),
      tap((res) => {
        this.logger.log(res, 'verify payment paystack api called');
      }),
    );
  }

  /**
   * It makes a GET request to the Paystack API to get a list of banks
   */
  getBankList(): Observable<IGetBankList> {
    return this.instance.get(`bank?currency=NGN`).pipe(map((res) => res.data));
  }

  /**
   * It makes a GET request to the Paystack API to get the account details of an account
   * @param accountNumber The account number to get the details from
   * @param bankCode The bank code the account belongs to
   */
  getAccountDetails(
    accountNumber: string,
    bankCode: string,
  ): Observable<IGetBankList> {
    return this.instance
      .get(`bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`)
      .pipe(
        map((res) => res.data),
        tap((res) => {
          this.logger.log(res);
        }),
      );
  }

  /**
   * It makes a POST request to the Paystack API to create a transfer recipient
   * @param body The passed in body object
   */
  getTransferRecipient(
    body: IGetTransferRecipientDto,
  ): Observable<IGetBankList> {
    const { type, currency } = body;
    return this.instance
      .post(`transferrecipient`, {
        ...body,
        type: type ? type : 'nuban',
        currency: currency ? currency : 'NGN',
      })
      .pipe(map((res) => res.data));
  }

  /**
   * It makes a POST request to the Paystack API to initiate a transfer
   * @param payload The passed in body object
   */
  initiateTransfer(payload: IInitializeTransferDto): Observable<any> {
    return this.instance.post('transfer', { ...payload, source: 'balance' });
  }

  /**
   * It makes a POST request to the Paystack API to initiate a charge
   * @param payload The passed in body object
   */
  initiateCharge(payload: any): Observable<any> {
    return this.instance.post('charge', payload);
  }

  /**
   * It makes a Get request to the Paystack API to verify a charge
   * @param payload The passed in body object
   */
  verifyCharge(reference: string): Observable<any> {
    return this.instance.get(`charge/${reference}`);
  }

  /**
   * It makes a Post request to the Paystack API to disable a subscription
   * @param payload The passed in body object
   */
  disableSubscription(payload: IDisableSubscription): Observable<any> {
    return this.instance.post(`subscription/disable`, payload);
  }

  /**
   * It makes a Get request to the Paystack API to fetch the details for a customer
   * @param payload The passed in body object
   */
  getCustomerDetails(email: string): Observable<any> {
    return this.instance
      .get(`customer/${email}`)
      .pipe(map((res) => res.data.data));
  }

  createCustomer(payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  }): Observable<any> {
    return this.instance
      .post('customer', payload)
      .pipe(map((res) => res.data.data));
  }

  updateCustomer(payload: {
    first_name: string;
    last_name: string;
    phone: string;
    customer_code: string;
  }) {
    const { customer_code, first_name, last_name, phone } = payload;
    return this.instance
      .put(`customer/${customer_code}`, { first_name, last_name, phone })
      .pipe(map((res) => res.data.data));
  }

  createDedicatedVirtualAccount(customer_code: string) {
    return this.instance
      .post('dedicated_account', {
        customer: customer_code,
        preferred_bank: isProd ? 'titan-paystack' : 'test-bank',
      })
      .pipe(map((res) => res.data.data));
  }

  /**
   * It makes a Get request to the Paystack API to fetch the details for a subscription
   * @param payload The passed in body object
   */
  fetchSubscription(code: string): Observable<any> {
    return this.instance.get(`subscription/${code}`);
  }

  chargeAuthorization(body: ChargeAuthorizationPayload): Observable<any> {
    return this.instance.post('transaction/charge_authorization', body).pipe(
      map((res) => {
        return res.data.data;
      }),
    );
  }
}
