export interface IInitializeTransaction {
  amount: number;
  email?: string;
  reference?: string;
  callback_url?: string;
  plan?: string;
  metadata?: Record<string, any>;
}

export interface IInitializeTransactionRes {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface IBankList {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetBankList {
  status: boolean;
  message: string;
  data: IBankList[];
}

export interface IGetTransferRecipientDto {
  type?: string;
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}

export interface IInitializeTransferDto {
  reason?: string;
  amount: number;
  recipient: string;
  currency?: string;
  reference?: string;
}

export interface IDisableSubscription {
  code: string;
  token: string;
}

export interface IDisableSubscription {
  code: string;
  token: string;
}
