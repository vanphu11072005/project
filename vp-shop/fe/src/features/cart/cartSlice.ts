import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { CartItem } from "../../types/user/Cart";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error?: string | null;
}

const initialState: CartState = {
   items: [], 
   loading: false, 
   error: null 
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }: { productId: number; quantity: number }) => {
    const res = await api.post("/carts", { productId, quantity });
    return res.data; // server sẽ trả về một cart item kèm luôn thông tin sản phẩm.
  }
);

// Lấy giỏ hàng
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId: number) => {
    const res = await api.get(`/carts/${userId}`);
    return res.data as CartItem[];    // là mảng các item trong giỏ hàng.
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({ id, quantity }: { id: number; quantity: number }) => {
    const res = await api.put(`/carts/${id}`, { quantity });
    return res.data as CartItem;
  }
);

export const deleteCart = createAsyncThunk(
  "cart/deleteCart",
  async (id: number) => {
    await api.delete(`/carts/${id}`);
    return id;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];    // dòng này gán lại items thành [] (mảng rỗng).
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(addToCart.fulfilled, (s, a) => {
        s.loading = false;
        // backend trả về item with product: {Product fields}
        const payload = a.payload;
        // tránh duplicate: tìm item id
        const exist = s.items.find(it => it.id === payload.id);  // Nếu it.id === payload.id thì sản phẩm đã tồn tại trong giỏ hàng
        if (exist) {
          exist.quantity = payload.quantity;                     // Khi sản phẩm đã tồn tại trong giỏ → cập nhật lại số lượng bằng số lượng mới từ payload.
        } else {                                                 // Nếu chưa có trong giỏ → tạo object cart item mới rồi push vào s.items.
          s.items.push({
            id: payload.id,
            quantity: payload.quantity,
            product: {
              id: payload.product.id,
              name: payload.product.name,
              price: payload.product.price,
              image_url: payload.product.image_url
            }
          });
        }
      })
      .addCase(addToCart.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(fetchCart.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchCart.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.map((it: any) => ({
          id: it.id,
          quantity: it.quantity,
          product: {
            id: it.product.id,
            name: it.product.name,
            price: it.product.price,
            image_url: it.product.image_url
          }
        }));
      })
      .addCase(fetchCart.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(updateCart.fulfilled, (s, a) => {
        const payload = a.payload;
        const idx = s.items.findIndex(i => i.id === payload.id);      // s.items = mảng các sản phẩm đang có trong giỏ. findIndex tìm vị trí item nào có id trùng với payload.id
        if (idx >= 0) s.items[idx].quantity = payload.quantity;       // Cập nhật lại số lượng của sản phẩm đó trong giỏ hàng bằng số lượng mới từ backend.
      })

      .addCase(deleteCart.fulfilled, (s, a) => {
        s.items = s.items.filter(i => i.id !== a.payload);
      });
  }
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
