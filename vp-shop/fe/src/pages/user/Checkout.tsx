import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { createOrder } from "../../features/order/orderSlice";
import { clearCart } from "../../features/cart/cartSlice";
import ShippingOptions from "../../components/user/ShippingOptions";
import PaymentOptions from "../../components/user/PaymentOptions";
import { createPaymentTransaction } from "../../features/payments/paymentTransactionsSlice";

type CheckoutForm = {
  address: string;
  phone: string;
};

function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const cart = useAppSelector((state) => state.cart);
  const { selected } = useAppSelector((state) => state.shipping);
  const paymentSelected = useAppSelector(
    (state) => state.paymentTransactions.selectedMethod
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>();

  const onSubmit = async (data: CheckoutForm) => {
    if (!auth.user) return;

    // ✅ Kiểm tra shipping
    if (!selected) {
      alert("Vui lòng chọn phương thức vận chuyển!");
      return;
    }

    // ✅ Kiểm tra payment
    if (!paymentSelected) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    // 1. Tạo Order
    const orderAction = await dispatch(
      createOrder({
        address: data.address,
        phone: data.phone,
        shipping_id: selected.id,
        payment_method_id: paymentSelected,
      })
    );

    const order = orderAction.payload;
    if (!order?.id) {
      alert("Tạo đơn hàng thất bại!");
      return;
    }

    // 2. Tạo Transaction
    await dispatch(
      createPaymentTransaction({
        order_id: order.id,
        payment_method_id: paymentSelected,
        amount:
          cart.items.reduce(
            (sum, i) => sum + Number(i.product.price) * i.quantity,
            0
          ) + Number(selected.fee),
      })
    );

    // 3. Clear cart + navigate
    dispatch(clearCart());
    alert("Đặt hàng thành công!");
    navigate("/orders");
  };

  if (cart.items.length === 0) return <p>Giỏ hàng trống</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Thanh toán
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Thông tin giao hàng */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">
            Địa chỉ nhận hàng
          </label>
          <input
            type="text"
            placeholder="Ví dụ: 123 Nguyễn Trãi, Q1, TP.HCM"
            {...register("address", {
              required: "Địa chỉ không được để trống",
              minLength: {
                value: 10,
                message: "Địa chỉ quá ngắn, hãy nhập rõ địa chỉ của bạn",
              },
              maxLength: {
                value: 200,
                message: "Địa chỉ quá dài, vui lòng rút gọn",
              },
              validate: (value) => {
                if (!/[0-9]/.test(value)) {
                  return "Địa chỉ cần có số nhà";
                }
                return true;
              },
            })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.address && (
            <p className="text-red-600 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block font-semibold text-gray-700">
            Số điện thoại
          </label>
          <input
            type="text"
            placeholder="Ví dụ: 0987654321"
            {...register("phone", {
              required: "Số điện thoại không được để trống",
              pattern: {
                value: /^[0-9]{9,11}$/,
                message: "Số điện thoại không hợp lệ",
              },
            })}
            className="border rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.phone && (
            <p className="text-red-600 text-sm">{errors.phone.message}</p>
          )}
        </div>

        {/* Shipping */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <ShippingOptions />
          {!selected && (
            <p className="text-red-600 text-sm mt-2">
              Vui lòng chọn phương thức vận chuyển
            </p>
          )}
        </div>

        {/* Payment */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <PaymentOptions />
          {!paymentSelected && (
            <p className="text-red-600 text-sm mt-2">
              Vui lòng chọn phương thức thanh toán
            </p>
          )}
        </div>

        {/* Tổng tiền */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg mb-2">Tóm tắt đơn hàng</h3>
          <p className="text-gray-700">
            Tổng sản phẩm:{" "}
            <span className="font-bold">{cart.items.length}</span>
          </p>
          <p className="text-gray-700">
            Phí vận chuyển:{" "}
            <span className="font-bold">
              {selected
                ? selected.fee.toLocaleString() + "₫"
                : "Chưa chọn phương thức"}
            </span>
          </p>
          <p className="text-gray-700 mt-2">
            Thời gian dự kiến:{" "}
            {selected ? `${selected.estimated_days} ngày` : "—"}
          </p>
        </div>

        {/* Nút submit */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Xác nhận đặt hàng
        </button>
      </form>
    </div>
  );
}

export default Checkout;
