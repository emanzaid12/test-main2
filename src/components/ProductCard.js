import React from "react";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(addToCart(product));

    toast(
      <div className="flex items-center gap-2 text-red-800">
        <FaCheckCircle className="text-red-800 text-lg" />
        <span>Product added successfully!</span>
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
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div
        className="bg-white p-4 border rounded-lg shadow-md  
        transform transition-transform duration-300 hover:scale-105 relative"
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-contain mb-4"
        />

        <h3 className="mt-4 text-lg font-semibold text-gray-800">
          {product.title}
        </h3>

        <p className="text-gray-500 text-sm">${product.price.toFixed(2)}</p>

        <div className="flex items-center mt-2">
          {[...Array(3)].map((_, index) => (
            <FaStar key={index} className="text-yellow-500" />
          ))}
        </div>

        <div
          className="absolute bottom-4 right-2 flex items-center justify-center w-8 h-8 bg-red-600  
          group text-white text-sm rounded-full hover:w-32 hover:bg-red-700 transition-all cursor-pointer"
          onClick={(e) => handleAddToCart(e, product)}
        >
          <span className="group-hover:hidden">+</span>
          <span className="hidden group-hover:block">Add to Cart</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
