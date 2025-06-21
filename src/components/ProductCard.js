import React from "react";
import { FaStar, FaCheckCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({ product, isFavorite, onToggleFavorite }) => {
  const token = localStorage.getItem("authToken");

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      toast.warn("Please login first.");
      return;
    }

    try {
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Cart/toggle?productId=${product.productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = await response.text();

      if (response.ok) {
        toast(
          <div className="flex items-center gap-2 text-red-800">
            <FaCheckCircle className="text-red-800 text-lg" />
            <span>{message}</span>
          </div>,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            style: {
              backgroundColor: "#ffffff",
              border: "1px solid #8b0000",
              borderRadius: "6px",
              padding: "10px 16px",
              fontSize: "0.875rem",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            },
          }
        );
      } else {
        toast.error(message || "Failed to add to cart.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong while adding to cart.");
    }
  };

  return (
    <Link to={`/product/${product.productId}`}>
      <div className="bg-white p-4 border rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 relative">
        {/* زر المفضلة */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="absolute top-2 left-2 text-red-600 hover:text-red-800 z-10"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>

        <img
          src={
            product.imageUrls?.[0] ||
            product.imageUrl ||
            "https://via.placeholder.com/200"
          }
          alt={product.name || product.productName}
          className="w-full h-48 object-contain mb-4"
        />

        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          {product.name || product.productName}
        </h3>

        <p className="text-gray-500 text-sm">
          ${product.price?.toFixed(2) || "N/A"}
        </p>

        {/* ⭐⭐ التقييم بالنجوم وعدد التقييمات ⭐⭐ */}
        <div className="flex items-center mt-2">
          {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className={
                index < Math.round(product.averageRating || 0)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({product.totalReviews || 0})
          </span>
        </div>

        {/* زر الإضافة إلى العربة */}
        <div
          className="absolute bottom-4 right-2 flex items-center justify-center w-8 h-8 bg-red-600  
          group text-white text-sm rounded-full hover:w-32 hover:bg-red-700 transition-all cursor-pointer"
          onClick={handleAddToCart}
        >
          <span className="group-hover:hidden">+</span>
          <span className="hidden group-hover:block">Add to Cart</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
