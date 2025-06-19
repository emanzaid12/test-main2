import React, { useState } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaHeart,
  FaHandsHelping,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setSearchTerm } from "../redux/productSlice";

const Navbar = () => {
  const [searchTerm, setSearch] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const products = useSelector((state) => state.cart.products);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchTerm));
    navigate("/filter-data");
  };

  return (
    <nav className="bg-red-800 text-white shadow-md">
      {/* Top Section */}
      <div className="container mx-auto px-4 md:px-16 lg:px-24 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-bold flex items-center gap-2">
          <FaHandsHelping className="text-white text-2xl" />
          <Link to="/" className="text-xl font-semibold">
            Spark Up
          </Link>
        </div>

        {/* Search */}
        <div className="relative flex-1 mx-4">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search product"
              className="w-full border py-2 px-4 rounded-full focus:ring-2 focus:ring-red-800 focus:outline-none focus:border-red-800 caret-red-800 text-black transition-all duration-300"
              value={searchTerm}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onFocus={() => console.log("Input Focused")}
              onBlur={() => console.log("Input Blurred")}
            />
            <FaSearch className="absolute top-3 right-3 text-red-800" />
          </form>
        </div>

        {/* Icons + Login/Register */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-lg" />
            {products.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-red-800 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-red-800">
                {products.length}
              </span>
            )}
          </Link>

          {/* Favorite */}
          <Link to="/favorites">
            <FaHeart className="text-lg" />
          </Link>

          {/* Settings */}
          <Link to="/settings">
            <FaUser className="text-lg" />
          </Link>

          {/* Login / Register */}
          {/* Login / Register */}
          <div className="text-sm ml-4 font-bold">
          <Link to="/loginregister" className="text-white hover:text-gray-300 transition-colors">
  Login | Sign Up
</Link>

</div>

        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center justify-center space-x-10 py-4 text-sm font-bold">
        {["Home", "Shop", "Contact", "About", "Services"].map((page, index) => {
          const path = page.toLowerCase().replace(" ", "-");
          const isActive = location.pathname.includes(path);
          return (
            <Link
              key={index}
              to={`/${path}`}
              className={`hover:text-gray-300 transition-all ${
                isActive ? "text-gray-300" : ""
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
