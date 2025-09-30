import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import Header from "./components/user/Header";
import Footer from "./components/user/Footer";

import Home from "./pages/user/Home";
import ProductDetail from "./pages/user/ProductDetail";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import Orders from "./pages/user/Orders";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";

import { fetchUser } from "./features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "./hooks";

import { ProtectedRoute } from "./components/user/ProtectedRoute";

function App() {
  const dispatch = useAppDispatch();
  const { token, user } = useAppSelector((state) => state.auth);
  // const { token: adminToken, admin } = useAppSelector((state) => state.adminAuth);

  // Fetch user nếu có token
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [token, user, dispatch]);

  // Fetch admin nếu có token
  // useEffect(() => {
  //   if (adminToken && !admin) {
  //     dispatch(fetchAdmin());
  //   }
  // }, [adminToken, admin, dispatch]);

  return (
    <Routes>
      {/* ================= USER ================= */}
      <Route
        path="/"
        element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 px-12 p-4 bg-gray-50 dark:bg-gray-800 transition">
              <Outlet />
            </main>
            <Footer />
          </div>
        }
      >
        <Route index element={<Home />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route
          path="cart"
          element={
            <ProtectedRoute role="user">
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="checkout"
          element={
            <ProtectedRoute role="user">
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute role="user">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* ================= ADMIN ================= */}
      {/* <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      /> */}
    </Routes>
  );
}

export default App;
