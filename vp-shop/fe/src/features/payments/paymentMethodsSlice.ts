import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { PaymentMethod } from "../../types/user/PaymentMethod";

interface PaymentMethodState {
  methods: PaymentMethod[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentMethodState = {
  methods: [],
  loading: false,
  error: null,
};

// Thunk: Lấy danh sách phương thức thanh toán
export const fetchPaymentMethods = createAsyncThunk(
  "paymentMethods/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/payments/methods");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load methods");
    }
  }
);

const paymentMethodsSlice = createSlice({
  name: "paymentMethods",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentMethodsSlice.reducer;
