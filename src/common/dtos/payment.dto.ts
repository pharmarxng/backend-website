export class CustomeFieldDto {
  display_name: string;
  variable_name: string;
  value: string;
}

export class MetadataDto {
  custom_fields?: any[];
  paymentType:
    | 'WALLET_FUNDING'
    | 'PAYOUT'
    | 'SUBSCRIPTION_PAYMENT'
    | 'SUBSCRIPTION_RENEWAL'
    | 'ORDER_PAYMENT';
  orderId?: number;
}

export class AuthorizationDto {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  receiver_bank_account_number?: string;
  receiver_bank?: string;
  signature: string;
}

export class CustomerDto {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  customer_code: string;
  phone: string;
  metadata: any;
  risk_action: string;
}

export class PlanDto {
  id: number;
  name: string;
  plan_code: string;
  description: string;
  amount: number;
  interval: string;
  send_invoices: boolean;
  send_sms: boolean;
  currency: string;
}

export class SubaccountDto {
  // No properties defined in original C# class.
}

export class ChargeDataDto {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: any;
  gateway_response: string;
  paid_at: Date;
  created_at: Date;
  channel: string;
  currency: string;
  ip_address: any;
  metadata: MetadataDto;
  log: any;
  fees: number;
  fees_split: any;
  authorization: AuthorizationDto;
  customer: CustomerDto;
  plan: PlanDto;
  subaccount: SubaccountDto;
  paidAt: Date;
  transaction_date: any;
}

export type ChangeEventType =
  | 'charge.success'
  | 'subscription.create'
  | 'invoice.create'
  | 'subscription.not_renew'
  | 'subscription.disable'
  | 'subscription.expiring_cards'
  | 'transfer.failed'
  | 'transfer.success'
  | 'transfer.reversed';

export class ChargeEventDto {
  event: ChangeEventType;
  data: ChargeDataDto;
}

export class PaymentDto {
  email: string;
  amount: number;
}
