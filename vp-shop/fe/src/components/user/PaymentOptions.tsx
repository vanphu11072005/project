import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchPaymentMethods } from "../../features/payments/paymentMethodsSlice";
import { selectMethod } from "../../features/payments/paymentTransactionsSlice"; // ✅ import action creator

function PaymentOptions() {
  const dispatch = useAppDispatch();
  const { methods, loading, error } = useAppSelector((state) => state.paymentMethods);
  const selected = useAppSelector((state) => state.paymentTransactions.selectedMethod);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, [dispatch]);

  if (loading) return <p>Đang tải phương thức thanh toán...</p>;
  if (error) return <p className="text-red-500">Lỗi: {error}</p>;
  if (!methods.length) return <p>Không có phương thức thanh toán nào.</p>;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
      <div className="space-y-2">
        {methods.map((m) => (
          <label
            key={m.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
              selected === m.id
                ? "border-blue-600 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              value={m.id}
              checked={selected === m.id}
              onChange={() => dispatch(selectMethod(m.id))}
              className="mr-3"
            />
            <div>
              <p className="font-medium">{m.name}</p>
              {m.description && (
                <p className="text-sm text-gray-500">{m.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default PaymentOptions;
