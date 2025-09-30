import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchProducts } from "../../features/product/productSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/user/Pagination";

function Products() {
  const dispatch = useAppDispatch();                                                    // dùng để gửi action vào Redux Store.
  const { products, loading, page, pageSize, total } = useAppSelector(
    (state) => state.products
  );   // useAppSelector dùng để lấy state từ Redux store. { products, loading } → lấy ra danh sách sản phẩm + trạng thái loading từ productSlice.

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);   // location.search Chứa query string trong URL (phần sau dấu ?). URLSearchParams là class có sẵn trong JS để thao tác tạo, đọc, chỉnh sửa query string dễ dàng
                                                         // "Parse query string trong URL thành một object tiện lợi để lấy giá trị từng key".
  // Lấy query params
  const search = params.get("search") || "";             // Lấy giá trị query string có key là "search" trong URL, nếu k có thì gán chuỗi rỗng.
  const currentPage = Number(params.get("page")) || 1;
  const categoryId = params.get("category") || "";

  // Load sản phẩm mỗi khi search hoặc page thay đổi
  useEffect(() => {
    dispatch(fetchProducts({ 
      page: currentPage, 
      limit: pageSize || 4, 
      search,
      category: categoryId,
    }));
  }, [dispatch, currentPage, pageSize, search, categoryId, location.search]);  // Thêm location.search đảm bảo rằng mỗi lần URL query thay đổi, dữ liệu sản phẩm đều được fetch lại, an toàn hơn.

  // Khi đổi trang -> cập nhật URL
  const handlePageChange = (newPage: number) => {
    params.set("page", String(newPage));
    if (search) params.set("search", search);
    if (categoryId) params.set("category", categoryId);
    navigate(`?${params.toString()}`);
  };

  if (loading) return <p className="text-center py-6">Đang tải sản phẩm...</p>;

  return (
    <div className="p-4">
      {/* Grid sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition bg-white"
          >
            <div className="relative w-full h-48 bg-gray-50">
              <img
                src={p.image_url}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-3 space-y-1">
              <h3 className="font-semibold text-gray-800 line-clamp-2 h-12">
                {p.name}
              </h3>
              <p className="text-pink-600 font-bold text-lg">
                {new Intl.NumberFormat("vi-VN").format(Number(p.price))}₫
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Products;
