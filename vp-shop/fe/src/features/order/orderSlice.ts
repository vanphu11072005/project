import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { Order } from "../../types/user/Order";

interface OrderState {
  orders: Order[];
  loading: boolean;
  error?: string | null;
}

const initialState: OrderState = { 
  orders: [], 
  loading: false, 
  error: null 
};

// tạo order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async ({ 
    address, 
    phone, 
    shipping_id,
    payment_method_id
   }: { 
    address: string; 
    phone: string;
    shipping_id: number;
    payment_method_id: number;
  }) => {
    const res = await api.post("/orders", { 
      address, 
      phone, 
      shipping_id,
      payment_method_id
    });
    return res.data;
  }
);

// lịch sử user
export const fetchOrdersByUser = createAsyncThunk(
  "orders/fetchOrdersByUser",
  async (userId: number) => {
    const res = await api.get(`/orders/${userId}`);
    return res.data;
  }
);

// admin tất cả orders
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async () => {
    const res = await api.get("/orders");
    return res.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: { clearOrders(state) { state.orders = []; } },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createOrder.fulfilled, (s) => { s.loading = false; })
      .addCase(createOrder.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(fetchOrdersByUser.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchOrdersByUser.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchOrdersByUser.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(fetchAllOrders.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAllOrders.fulfilled, (s, a) => { s.loading = false; s.orders = a.payload; })
      .addCase(fetchAllOrders.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
  }
});

export default orderSlice.reducer;
