import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchOrdersByUser } from "../../features/order/orderSlice";
import type { Order } from "../../types/user/Order";

function Orders() {
  const dispatch = useAppDispatch();

  const auth = useAppSelector((state) => state.auth);
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (auth.user) {
      dispatch(fetchOrdersByUser(auth.user.id));
    }
  }, [auth.user, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>

      {/* Loading */}
      {loading && <p>Đang tải đơn hàng...</p>}

      {/* Error */}
      {error && <p className="text-red-500">Lỗi: {error}</p>}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <p>Chưa có đơn hàng.</p>
      )}

      {/* Orders */}
      {!loading &&
        !error &&
        orders.length > 0 &&
        orders.map((order: Order) => (
          <div key={order.id} className="border p-3 rounded mb-4">
            <p>
              <span className="font-semibold">Order #{order.id}</span> -{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "N/A"}
            </p>
            <p>Trạng thái: {order.status}</p>
            <p>
              Địa chỉ: {order.address} | Phone: {order.phone}
            </p>

            {/* Shipping info */}
            {order.shipping ? (
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  Vận chuyển:{" "}
                  <span className="font-semibold">{order.shipping.name}</span>
                </p>
                <p>
                  Phí ship:{" "}
                  <span className="font-semibold">
                    {order.shipping.fee.toLocaleString()}₫
                  </span>
                </p>
                <p>Dự kiến: {order.shipping.estimated_days} ngày</p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Phương thức vận chuyển (ID: {order.shipping_id})
              </p>
            )}

            {/* Transaction info */}
            {order.transactions?.length ? (
              <div className="mt-2 text-sm text-gray-700">
                <p>
                  🔄 Giao dịch:{" "}
                  <span className="font-semibold">
                    {order.transactions[0].status}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Chưa có giao dịch thanh toán
              </p>
            )}

            <p className="font-semibold mt-2">
              Tổng tiền: {Number(order.total_price).toLocaleString()}₫
            </p>

            {/* Items */}
            <div className="mt-2">
              <h4 className="font-semibold">Sản phẩm:</h4>
              {order.items?.length ? (
                order.items.map((item) => (
                  <p key={item.id}>
                    {item.product?.name ?? "Sản phẩm đã xóa"} x {item.quantity} ={" "}
                    {(item.price * item.quantity).toLocaleString()}₫
                  </p>
                ))
              ) : (
                <p className="text-gray-500">Không có sản phẩm</p>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default Orders;