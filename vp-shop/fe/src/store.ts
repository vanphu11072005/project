import { configureStore } from "@reduxjs/toolkit";  // configureStore là một hàm của redux giúp tạo ra Redux store. Store = nơi chứa toàn bộ state global của app React.
import authReducer from "./features/auth/authSlice";          
// import adminAuthReducer from "./features/admin/adminAuthSlice";  
import productReducer from "./features/product/productSlice";   
import cartReducer from "./features/cart/cartSlice"; 
import orderReducer from "./features/order/orderSlice";
import categoryReducer from "./features/category/categorySlice";
import shippingReducer from "./features/shipping/shippingSlice";
import paymentMethodsReducer from "./features/payments/paymentMethodsSlice";
import paymentTransactionsReducer from "./features/payments/paymentTransactionsSlice";
                                     
export const store = configureStore({   
  reducer: {
    auth: authReducer,                     // Gọi từ authSlice.ts
    // adminAuth: adminAuthReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    categories: categoryReducer,
    shipping: shippingReducer,
    paymentMethods: paymentMethodsReducer,
    paymentTransactions: paymentTransactionsReducer,
  },                                      // Đây là object gom tất cả reducers (từ các slice) lại.
});

export type RootState = ReturnType<typeof store.getState>;   // RootState đại diện cho toàn bộ shape/state của Redux store, được TypeScript suy luận tự động từ store.getState().
export type AppDispatch = typeof store.dispatch;             // AppDispatch là kiểu chính xác của dispatch trong app. dispatch là hàm duy nhất để gửi (trigger) một action đến Redux store.
