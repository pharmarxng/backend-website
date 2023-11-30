export enum TransactionType {
  SUBSCRIPTION_PAYMENT = 'SUBSCRIPTION_PAYMENT',
  WALLET_FUNDING = 'WALLET_FUNDING',
  PAYOUT = 'PAYOUT',
  CASH_COLLECTION = 'CASH_COLLECTION',
  REFERRAL_BONUS = 'REFERRAL_BONUS',
}

export enum PaymentGateway {
  FLUTTERWAVE = 'FLUTTERWAVE',
  PAYSTACK = 'PAYSTACK',
}

export enum TransactionStatus {
  pending = 'pending',
  success = 'success',
  failed = 'failed',
}

export enum TransactionDirection {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface PaymentMetaData {
  custom_fields?: any[];
  full_name: string;
  deliveryCount?: number; // for subscription payment. user selects the number of deliveries they want for that plan
  planId?: number; // for subscription payment. plan payment is for must be selected
  paymentType:
    | 'WALLET_FUNDING'
    | 'PAYOUT'
    | 'SUBSCRIPTION_PAYMENT'
    | 'SUBSCRIPTION_RENEWAL'
    | 'ORDER_PAYMENT';
  userId?: number;
  orderId?: string;
}

export interface PaymentRequestPayload {
  email: string;
  amount: number; // in kobo
  currency?: string;
  reference?: string;
  callback_url?: string;
  channels?: string[]; //["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer", "eft"]
  metadata: PaymentMetaData;
}

export interface ChargeAuthorizationPayload {
  email: string;
  amount: number; // in kobo
  authorization_code: string; //e.g AUTH_72btv547
  metadata: PaymentMetaData;
}
