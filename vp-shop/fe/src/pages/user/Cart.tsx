import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchCart, updateCart, deleteCart } from "../../features/cart/cartSlice";

function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }
    if (auth.user?.id) {
      dispatch(fetchCart(auth.user.id));
    }
  }, [auth.user, auth.isAuthenticated, dispatch, navigate]);

  const onIncrease = (itemId: number, currentQty: number) => {
    dispatch(updateCart({ id: itemId, quantity: currentQty + 1 }));
  };

  const onDecrease = (itemId: number, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(updateCart({ id: itemId, quantity: currentQty - 1 }));
    }
  };

  const onRemove = (itemId: number) => {
    dispatch(deleteCart(itemId));
  };

  const onCheckout = () => {
    if (!auth.isAuthenticated) {
      alert("Vui lòng đăng nhập để thanh toán");
      navigate("/login");
      return;
    }
    if (cart.items.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }
    navigate("/checkout");
  };

  // Tổng tiền giỏ hàng
  const total = cart.items.reduce(
    (sum, it) => sum + Number(it.product.price) * it.quantity,
    0
  );

  if (cart.loading) return <div>Loading cart...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>
      {cart.items.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.items.map((item) => {
              const price = Number(item.product.price);
              const itemTotal = price * item.quantity;

              return (
                <div key={item.id} className="flex items-center border p-3 rounded">
                  <Link to={`/products/${item.product.id}`}>
                    <img
                      src={item.product.image_url || "/placeholder.png"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover mr-4"
                    />
                  </Link>

                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-sm">
                      Giá: {new Intl.NumberFormat("vi-VN").format(price)}₫
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onDecrease(item.id, item.quantity)}
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => onIncrease(item.id, item.quantity)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="ml-4 text-red-600"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>

                  <div className="text-right w-40">
                    <p>
                      {new Intl.NumberFormat("vi-VN").format(itemTotal)}₫
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-right">
            <p className="text-xl font-bold">
              Tổng: {new Intl.NumberFormat("vi-VN").format(total)}₫
            </p>
            <button
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              onClick={onCheckout}
            >
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
