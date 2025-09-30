import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "https://picsum.photos/id/1015/1200/500",
  "https://picsum.photos/id/1016/1200/500",
  "https://picsum.photos/id/1018/1200/500",
];

const Banner: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [index]);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-200">
      {/* Ảnh */}
      <div className="absolute inset-0 w-full h-full">
        {images.map((src, i) => (
          <motion.img
            key={i}
            src={src}
            alt={`Banner ${i}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white px-4">
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold drop-shadow-lg"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          🎉 Big Sale 2025 🎉
        </motion.h1>
        <motion.p
          className="mt-2 text-lg md:text-2xl font-medium"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Giảm giá tới{" "}
          <span className="font-bold text-yellow-300">50% OFF</span> mọi mặt hàng
        </motion.p>
      </div>

      {/* Nút điều hướng */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-pink-600 p-2 rounded-full hover:bg-pink-400 transition"
      >
        <FaChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-pink-600 p-2 rounded-full hover:bg-pink-400 transition"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
