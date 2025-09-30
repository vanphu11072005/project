export interface PaymentTransaction {
  id: number;
  order_id: number;
  payment_method_id: number;
  status: "pending" | "success" | "failed";
  transaction_id?: string;
  amount: number;
}