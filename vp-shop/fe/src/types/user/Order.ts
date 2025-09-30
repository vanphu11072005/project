import type { PaymentTransaction } from "./PaymentTransaction";
import type { Shipping } from "./Shipping";

export interface OrderItemType {
  id: number;
  product: { id:number, name:string, price:number };
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  address: string;
  phone: string;
  total_price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  shipping_id: number;
  shipping?: Shipping;
  items: OrderItemType[];
  transactions?: PaymentTransaction[];
}