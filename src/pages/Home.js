import React, { useEffect, useState } from "react";
import { Categories, mockData } from "../assets/mockData";
import HeroImage from "../assets/images/99.jpg";
import InfoSection from "../components/InfoSection";

import { setProducts } from "../redux/productSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product);
  const [topProducts, setTopProducts] = useState([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState([]);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "https://shopyapi.runasp.net/api/Products/random-products"
        );
        const data = await res.json();
        dispatch(setProducts(data));
      } catch (err) {
        console.error("Failed to fetch products:", err);
        dispatch(setProducts(mockData));
      }
    };

    const fetchTopProducts = async () => {
      try {
        const res = await fetch(
          "https://shopyapi.runasp.net/api/ProductStatistics/top-SiteSelling-product"
        );
        const data = await res.json();
        setTopProducts(data);
      } catch (err) {
        console.error("Failed to fetch top products:", err);
        setTopProducts([]);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await fetch(
          "https://shopyapi.runasp.net/api/Favourite/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setFavoriteProductIds(data.map((f) => f.productId));
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    if (!products.products || products.products.length === 0) {
      fetchProducts();
    }

    fetchTopProducts();
    if (token) fetchFavorites();
  }, [dispatch, products.products, token]);

  const handleToggleFavorite = async (productId) => {
    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Favourite/toggle?productId=${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to toggle favorite");

      setFavoriteProductIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Error updating favorites");
    }
  };

  const handleToggleCart = async (productId) => {
    if (!token) {
      toast.warn("Please login first.");
      return;
    }

    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Cart/toggle?productId=${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const msg = await res.text();
      if (res.ok) {
        toast.success(msg);
      } else {
        toast.error(msg);
      }
    } catch (err) {
      console.error("Error toggling cart:", err);
      toast.error("Failed to update cart.");
    }
  };

  return (
    <div>
      <div className="bg-white mt-2 px-4 md:px-16 lg:px-24">
        {/* Hero Section */}
        <div className="container mx-auto py-4 flex flex-col md:flex-row">
  <div className="relative w-full h-[600px]">
    <img
      src={HeroImage}
      alt="Hero"
      className="h-full w-full object-cover"
    />
    <div
      className="absolute flex flex-col items-start mt-9"
      style={{
        top: '40%',
        left: '6%',
        transform: 'translateY(-50%)',
      }}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-white text-left">
        WELCOME TO OUR E-COMMERCE
      </h2>
      <p className="text-xl md:text-2xl mt-2.5 font-bold text-gray-200 text-left">
        SPARK UP
      </p>
    <button
  onClick={() => (window.location.href = "/shop")}
  className="border-2 border-red-800 text-red-800 bg-white px-8 py-3 mt-12 rounded-full transform hover:scale-105 transition-colors duration-300 self-start"
>
  SHOP NOW
</button>


    </div>
  </div>
</div>

        {/* Info Section */}
        <InfoSection />

       

        {/* ✅ Top Products Section */}
        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Top Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  isFavorite={favoriteProductIds.includes(product.productId)}
                  onToggleFavorite={() =>
                    handleToggleFavorite(product.productId)
                  }
                  onToggleCart={() => handleToggleCart(product.productId)}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No top products available.
              </p>
            )}
          </div>
        </div>

        {/* ✅ Random Products Section */}
        <div className="container mx-auto py-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Random Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.products?.length > 0 ? (
              products.products
                .slice(0, 10)
                .map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    isFavorite={favoriteProductIds.includes(product.productId)}
                    onToggleFavorite={() =>
                      handleToggleFavorite(product.productId)
                    }
                    onToggleCart={() => handleToggleCart(product.productId)}
                  />
                ))
            ) : (
              <p className="text-center col-span-full text-gray-500">
                No random products available.
              </p>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;
