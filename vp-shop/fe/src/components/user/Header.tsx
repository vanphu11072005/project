import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { logout } from "../../features/auth/authSlice";
import { fetchCart, clearCart } from "../../features/cart/cartSlice";
import ThemToggle from "./ThemeToggle";
import CartIcon from "./CartIcon";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  // 🔑 Khi user login thì load giỏ hàng
  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.id) {
      dispatch(fetchCart(auth.user.id) as any);
    } else {
      dispatch(clearCart());
    }
  }, [auth.isAuthenticated, auth.user?.id, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-16 py-6 flex justify-between items-center transition">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-pink-600 tracking-wide">
        <Link to="/">Shop VP</Link>
      </h1>

      {/* Search box */}
      <form onSubmit={handleSearch} className="flex flex-1 max-w-lg mx-8">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-l-lg px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1 rounded-r-lg transition"
        >
          Search
        </button>
      </form>

      {/* Navigation */}
      <nav className="space-x-6 flex items-center text-gray-700 dark:text-gray-200 font-medium">
        <ThemToggle />
        <CartIcon />

        {auth.isAuthenticated ? (
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="flex items-center dark:text-white space-x-1 text-gray-700 font-semibold">
              {auth.user?.avatar ? (
                <img 
                  src={auth.user.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  alt="default avatar"
                  className="w-8 h-8 rounded-full border"
                />
              )}
              <span>{auth.user?.name}</span>
            </button>

            {/* Dropdown menu */}
            {open && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-20">
                {/* Hack: invisible hover area để giữ open */}
                <div className="absolute -top-3 right-0 w-full h-3 bg-transparent"></div>

                {/* Mũi tên nhỏ */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>

                {/* Nội dung menu */}
                <div className="relative z-10">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700"
                  >
                    Tài Khoản Của Tôi
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-pink-50 dark:hover:bg-gray-700"
                  >
                    Đơn Mua
                  </Link>
                  <button
                    onClick={() => dispatch(logout())}
                    className="w-full text-left block px-4 py-2 hover:bg-pink-50 dark:hover:bg-gray-700"
                  >
                    Đăng Xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-3">
            <Link
              to="/login"
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg transition"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-3 py-1 rounded-lg transition"
            >
              Đăng ký
            </Link>
            <Link
              to="/admin/login"
              className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg transition"
            >
              Admin
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
