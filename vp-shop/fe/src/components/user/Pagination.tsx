import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface Props {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;      // void không trả về gì
}

const Pagination: React.FC<Props> = ({ total, page, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);     // Làm tròn trên

  if (totalPages <= 1) return null;                   // Nếu chỉ có một trang hoặc k có sản phẩm, thì không cần hiển thị component phân trang (Pagination) nữa.

  // Hàm tạo danh sách số trang với "..."
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];            // Các số trang --> kiểu number, Dấu "..." để rút gọn --> kiểu string.
    const delta = 2;                                  // Hiển thị 2 trang liền kề trang chính VD: 3 4 (5) 6 7

    // luôn có trang đầu
    if (page > 1 + delta) {                           // VD: page = 5 > 1 + delta = 5 > 3 thì thêm trang 1
      pages.push(1);
      if (page > 2 + delta) pages.push("...");        // VD: page = 5 > 2 + delta = 5 > 4 quá xa trang 1 thì hiển thị thêm "...". Kết quả lúc này: [1, "..."].
    }

    // các trang gần page hiện tại
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {   // Math.max(1, ...): không < 1, Math.min(totolPages, ...): không > tổng số trang, page - delta: trang bắt đầu hiển thị bên trái, page + delta: trang bắt đầu hiển thị bên phải
      pages.push(i);                                                                          // i chạy từ trang bắt đầu → trang kết thúc (xác định bởi page - delta và page + delta).
    }

    // luôn có trang cuối
    if (page < totalPages - delta) {
      if (page < totalPages - delta - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };
  
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      {/* Nút Prev - chỉ hiện nếu chưa ở trang 1 */}
      {page > 1 && (
        <button
          onClick={() => onPageChange(page - 1)}
          className="text-white bg-pink-600 p-1 rounded-full hover:bg-pink-400"
        >
          <FaChevronLeft size={25} />
        </button>
      )}

      {/* Nút số trang */}
      {getPageNumbers().map((p, idx) =>
        p === "..." ? (
          <span key={idx} className="px-3 py-1 text-gray-500">...</span>
        ) : (
          <button
            key={`page-${p}-${idx}`}
            onClick={() => onPageChange(p as number)}
            className={`px-3 py-1 border rounded transition 
              ${p === page ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {p}
          </button>
        )
      )}

      {/* Nút Next - chỉ hiện nếu chưa ở trang cuối */}
      {page < totalPages && (
        <button
          onClick={() => onPageChange(page + 1)}
          className="text-white bg-pink-600 p-1 rounded-full hover:bg-pink-400"
        >
          <FaChevronRight size={25} />
        </button>
      )}
    </div>
  );
};

export default Pagination;
