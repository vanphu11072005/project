import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { fetchCategories } from "../../features/category/categorySlice";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategoryMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useAppSelector((state) => state.categories);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) return <p className="p-4 text-gray-500">Loading categories...</p>;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative rounded-3xl p-6 bg-white mt-8 mb-6">
      <h2 className="text-xl font-semibold mb-8 text-center">
        DANH MỤC
      </h2>

      {/* Scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-pink-600 shadow rounded-full p-2 z-10 hover:bg-pink-400"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white bg-pink-600 shadow rounded-full p-2 z-10 hover:bg-pink-400"
      >
        <FaChevronRight />
      </button>

      {/* Categories scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-10"
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => navigate(`/?category=${cat.id}`)}
            className="flex-shrink-0 w-32 flex flex-col items-center cursor-pointer group"
          >
            <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-md shadow-sm overflow-hidden group-hover:shadow-md transition">
              <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <img
                  src={cat.image_url || "https://via.placeholder.com/150"}
                  alt={cat.name}
                  className="object-contain w-3/4 h-3/4"
                />
              </div>
            </div>
            <p className="mt-2 text-md font-medium text-gray-700 group-hover:text-blue-600">
              {cat.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
