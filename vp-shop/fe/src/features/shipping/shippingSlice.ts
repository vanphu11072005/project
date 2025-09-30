import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { Shipping } from "../../types/user/Shipping";

interface ShippingState {
  methods: Shipping[];
  loading: boolean;
  error: string | null;
  selected?: Shipping; // dùng undefined thay vì null
}

const initialState: ShippingState = {
  methods: [],
  loading: false,
  error: null,
  selected: undefined,
};

export const fetchShippings = createAsyncThunk("shipping/fetch", async () => {
  const res = await api.get("/shippings");
  return res.data as Shipping[];
});

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    selectShipping(state, action: PayloadAction<Shipping>) {
      state.selected = action.payload;
    },
    clearSelectedShipping(state) {
      state.selected = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShippings.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = action.payload;
      })
      .addCase(fetchShippings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching shippings";
      });
  },
});

export const { selectShipping, clearSelectedShipping } = shippingSlice.actions;
export default shippingSlice.reducer;