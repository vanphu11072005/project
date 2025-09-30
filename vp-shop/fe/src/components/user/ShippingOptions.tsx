import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchShippings, selectShipping } from "../../features/shipping/shippingSlice";

const ShippingOptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { methods, selected, loading } = useAppSelector((state) => state.shipping);

  useEffect(() => {
    dispatch(fetchShippings());
  }, [dispatch]);

  if (loading) {
    return (
      <p className="text-gray-500 italic">Đang tải phương thức vận chuyển...</p>
    );
  }

  if (!methods.length) {
    return <p className="text-gray-600">Chưa có phương thức vận chuyển</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-700">Phương thức vận chuyển</h3>
      {methods.map((m) => {
        const isSelected = selected?.id === m.id;
        return (
          <label
            key={m.id}
            className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition ${
              isSelected ? "border-blue-500 bg-blue-50" : "hover:bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="shipping"
              value={m.id}
              checked={isSelected}
              onChange={() => dispatch(selectShipping(m))}
              className="accent-blue-600"
              aria-label={`Chọn ${m.name}`}
            />
            <span className="text-gray-800">
              {m.name}{" "}
              <span className="font-semibold">
                {m.fee.toLocaleString()}₫
              </span>{" "}
              <span className="text-gray-500 text-sm">
                (dự kiến {m.estimated_days} ngày)
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default ShippingOptions;
