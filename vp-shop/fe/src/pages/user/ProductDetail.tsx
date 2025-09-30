import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchProductById } from "../../features/product/productSlice";
import { addToCart } from "../../features/cart/cartSlice";

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedProduct: product, loading } = useAppSelector((state) => state.products);
  const auth = useAppSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) dispatch(fetchProductById(Number(id)));
  }, [dispatch, id]);

  if (loading || !product) return <p>Loading...</p>;

  const handleAddToCart =  () => {
    if (!auth.isAuthenticated) {
      alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    if (quantity > product.stock) {
      alert(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      return;
    }

    dispatch(addToCart({ productId: product.id, quantity }));
    alert("Thêm vào giỏ hàng thành công!");
  }

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col md:flex-row gap-4">
      <img src={product.image_url} alt={product.name} className="w-full md:w-1/2 h-auto object-cover"/>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-blue-600 text-xl mb-2">{new Intl.NumberFormat("vi-VN").format(Number(product.price))}₫</p>
        <p className="mb-2">{product.description}</p>
        <p className="mb-2">Stock: {product.stock}</p>

        {/* Chọn số lượng */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
            className="px-2 py-1 border rounded"
          >-</button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity(prev => Math.min(prev + 1, product.stock))}
            className="px-2 py-1 border rounded"
          >+</button>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white p-2 rounded mt-2 w-full"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
