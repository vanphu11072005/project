import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";   // createSlice là hàm để tạo slice Redux (một "mảnh" state + reducer + action). createAsyncThunk dùng để tạo action async (thường là gọi API)
import api from "../../api/api";
import type { Product } from "../../types/user/Product";

interface ProductState {
  products: Product[];
  total: number;                      // Tổng số sản phẩm có trong DB(dùng khi có phân trang)
  page: number;
  pageSize: number;
  loading: boolean;
  selectedProduct: Product | null;    // Dùng để lưu sản phẩm đang được xem chi tiết(/product/:id).
}

const initialState: ProductState = {
  products: [],
  total: 0,
  page: 1,
  pageSize: 12,
  loading: false,
  selectedProduct: null,
};

// Async thunk để lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",                           // Là action type prefix.
  async (params: any) => {
    const res = await api.get("/products", { params });   // Gọi API GET /products đến backend. { params } sẽ tự động chuyển object thành query string --> GET http://localhost:5000/products?page=2&limit=5
    return res.data;
  }
);

// Async thunk lấy chi tiết sản phẩm
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id: number) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  }
);

// Lấy sản phẩm bán chạy nhất
export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (limit: number = 8) => {
    const res = await api.get("/products/best-sellers", {
      params: { limit },
  });
    return res.data;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // danh sách sản phẩm
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pageSize = action.payload.pageSize;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })

      // chi tiết sản phẩm
      .addCase(fetchProductById.pending, (state) => { state.loading = true; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductById.rejected, (state) => { state.loading = false; })
  }
});

export default productSlice.reducer;
