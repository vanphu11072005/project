import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { PaymentTransaction } from "../../types/user/PaymentTransaction";

interface PaymentTransactionState {
  transactions: PaymentTransaction[];
  loading: boolean;
  error: string | null;
  selectedMethod: number | null;
}

const initialState: PaymentTransactionState = {
  transactions: [],
  loading: false,
  error: null,
  selectedMethod: null,
};

// Thunk: Tạo transaction khi checkout
export const createPaymentTransaction = createAsyncThunk(
  "paymentTransactions/create",
  async (
    data: { order_id: number; payment_method_id: number; amount: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("/payments/transactions", data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to create transaction");
    }
  }
);

// Thunk: Lấy transactions theo order_id
export const fetchTransactionsByOrder = createAsyncThunk(
  "paymentTransactions/fetchByOrder",
  async (orderId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/payments/transactions/order/${orderId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load transactions");
    }
  }
);

const paymentTransactionsSlice = createSlice({
  name: "paymentTransactions",
  initialState,
  reducers: {
    // Chọn phương thức thanh toán
    selectMethod: (state, action: PayloadAction<number>) => {
      state.selectedMethod = action.payload;
    },
    // clear transaction list (optional)
    clearTransactions: (state) => {
      state.transactions = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // create
      .addCase(createPaymentTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(createPaymentTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetch by order
      .addCase(fetchTransactionsByOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectMethod, clearTransactions } = paymentTransactionsSlice.actions;
export default paymentTransactionsSlice.reducer;
