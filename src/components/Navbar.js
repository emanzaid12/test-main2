import React, { useState } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaHeart,
  FaHandsHelping,
  FaTachometerAlt,
  FaPlus,
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

  const parseJwt = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return null;
    }
  };

  const getUserRole = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return null;

      const decoded = parseJwt(token);
      if (!decoded) return null;

      const role =
        decoded?.role ||
        decoded?.Role ||
        decoded?.[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        decoded?.[
          "https://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] ||
        decoded?.["role"];

      let normalizedRole = "";
      if (typeof role === "number") {
        normalizedRole = role.toString();
      } else if (typeof role === "string") {
        normalizedRole = role.toLowerCase().trim();
      }

      if (normalizedRole === "1" || normalizedRole === "seller") {
        return "seller";
      } else if (normalizedRole === "2" || normalizedRole === "admin") {
        return "admin";
      } else if (normalizedRole === "3" || normalizedRole === "pending") {
        return "pending";
      } else {
        return "user";
      }
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  };

  // دالة جديدة للتحقق من وجود طلب إنشاء متجر
  const getUserHasRequest = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return false;

      const decoded = parseJwt(token);
      if (!decoded) return false;

      const hasRequest = decoded?.hasRequest;
      return hasRequest === true || hasRequest === "true";
    } catch (error) {
      console.error("Error getting hasRequest:", error);
      return false;
    }
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("authToken");
    return token && token !== "";
  };

  const userRole = getUserRole();
  const hasRequest = getUserHasRequest();
  const loggedIn = isLoggedIn();

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchTerm));
    navigate("/filter-data");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
    window.location.reload();
  };

  const currentPath = location.pathname;

  // تحديد ما إذا كان يجب إظهار شريط البحث
  const shouldShowSearch = () => {
    const isMainPage = currentPath === "/" || currentPath === "/shop";

    // إذا لم يكن في الصفحة الرئيسية أو صفحة المتجر، لا يظهر البحث
    if (!isMainPage) return false;

    // إذا لم يكن مسجل دخول، يظهر البحث
    if (!loggedIn) return true;

    // إذا كان pending مع طلب، لا يظهر البحث
    if (userRole === "pending" && hasRequest) return false;

    // إذا كان pending بدون طلب، يظهر البحث
    if (userRole === "pending" && !hasRequest) return true;

    // للمستخدمين العاديين يظهر البحث
    if (userRole === "user") return true;

    // للـ seller والـ admin لا يظهر البحث
    return false;
  };

  // تحديد ما إذا كان يجب إظهار Cart و Favorites
  const shouldShowUserFeatures = () => {
    // إذا لم يكن مسجل دخول، يظهر للزوار
    if (!loggedIn) return true;

    // إذا كان pending مع طلب، لا يظهر
    if (userRole === "pending" && hasRequest) return false;

    // إذا كان pending بدون طلب، يظهر
    if (userRole === "pending" && !hasRequest) return true;

    // للمستخدمين العاديين فقط يظهر
    if (userRole === "user") return true;

    // للـ seller والـ admin لا يظهر
    return false;
  };

  // تحديد الصفحات المتاحة حسب نوع المستخدم
  const getAvailablePages = () => {
    let pages = ["Home", "Shop", "Contact", "About", "Services"];

    // إخفاء Contact للـ seller أو pending
    if (loggedIn && (userRole === "seller" || userRole === "pending")) {
      pages = pages.filter((page) => page !== "Contact");
    }

    return pages;
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

        {/* Search - يظهر حسب الشروط الجديدة */}
        {shouldShowSearch() && (
          <div className="relative flex-1 mx-4">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search product"
                className="w-full border py-2 px-4 rounded-full focus:ring-2 focus:ring-red-800 focus:outline-none focus:border-red-800 caret-red-800 text-black transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FaSearch className="absolute top-3 right-3 text-red-800" />
            </form>
          </div>
        )}

        {/* Icons + Login/Register/Logout */}
        <div className="flex items-center space-x-4">
          {/* Cart - Only show for users without pending requests */}
          {shouldShowUserFeatures() && (
            <Link to="/cart" className="relative">
              <FaShoppingCart className="text-lg" />
              {products.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-red-800 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-red-800">
                  {products.length}
                </span>
              )}
            </Link>
          )}

          {/* Favorite - Only show for users without pending requests */}
          {shouldShowUserFeatures() && (
            <Link to="/favorites">
              <FaHeart className="text-lg" />
            </Link>
          )}

          {/* Add New Brand - Only show for pending users without request */}
          {loggedIn && userRole === "pending" && !hasRequest && (
            <Link
              to="/add-new-brand"
              className="flex items-center gap-1 bg-white text-red-800 px-3 py-1 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              <FaPlus className="text-sm" />
              Add Brand
            </Link>
          )}

          {/* رسالة للمستخدمين الذين لديهم طلب pending */}
          {loggedIn && userRole === "pending" && hasRequest && (
            <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
              Store Request Pending
            </div>
          )}

          {/* Settings/Dashboard */}
          {loggedIn && (userRole === "seller" || userRole === "admin") && (
            <Link
              to={
                userRole === "admin" ? "/admin-dashboard" : "/dashboard-seller"
              }
            >
              <FaTachometerAlt className="text-lg" />
            </Link>
          )}

          {/* Dashboard for pending users */}
          {loggedIn && userRole === "pending" && hasRequest && (
            <Link to="/dashboard-seller">
              <FaTachometerAlt className="text-lg" />
            </Link>
          )}

          {/* Settings for pending users without request */}
          {loggedIn && userRole === "pending" && !hasRequest && (
            <Link to="/settings">
              <FaUser className="text-lg" />
            </Link>
          )}

          {/* Login/Register or Logout */}
          {!loggedIn ? (
            <div className="text-sm ml-4 font-bold">
              <Link
                to="/loginregister"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Login | Sign Up
              </Link>
            </div>
          ) : (
            <div className="text-sm ml-4 font-bold">
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center justify-center space-x-10 py-4 text-sm font-bold">
        {getAvailablePages().map((page, index) => {
          const path = page.toLowerCase().replace(" ", "-");
          const isActive = location.pathname.includes(path);
          return (
            <Link
              key={index}
              to={page === "Home" ? "/" : `/${path}`}
              className={`hover:text-gray-300 transition-all ${
                location.pathname === "/" && page === "Home"
                  ? "text-gray-300"
                  : isActive && page !== "Home"
                  ? "text-gray-300"
                  : ""
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
