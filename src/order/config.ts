import { ModelDefinition } from '@nestjs/mongoose';
import { Collections } from 'src/collections';
import {
  OrderDeliveryFeesSchema,
  OrderDiscountVoucherSchema,
  OrderSchema,
  OrderedProductsSchema,
} from './models';

export const orderModuleCollections: ModelDefinition[] = [
  {
    name: Collections.orders,
    schema: OrderSchema,
  },
  {
    name: Collections.orderDeliveryFees,
    schema: OrderDeliveryFeesSchema,
  },
  {
    name: Collections.orderedProducts,
    schema: OrderedProductsSchema,
  },
  {
    name: Collections.orderDiscountVoucher,
    schema: OrderDiscountVoucherSchema,
  },
];
