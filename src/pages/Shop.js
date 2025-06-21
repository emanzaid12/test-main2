import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoriteProductIds, setFavoriteProductIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  const fetchAllProducts = async () => {
    const res = await fetch("https://shopyapi.runasp.net/api/Products/all");
    const data = await res.json();
    setProducts(data);
  };

  const fetchProductsByCategory = async (categoryId) => {
    const res = await fetch(
      `https://shopyapi.runasp.net/api/Category/by-category/${categoryId}`
    );
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch(
      "https://shopyapi.runasp.net/api/Category/categories"
    );
    const data = await res.json();
    setCategories(data);
  };

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await fetch("https://shopyapi.runasp.net/api/Favourite/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setFavoriteProductIds(data.map((f) => f.productId));
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchCategories(), fetchFavorites()])
      .catch(() => toast.error("Error loading data"))
      .finally(() => setLoading(false));
  }, []);

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
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Cart/toggle?productId=${productId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const message = await response.text();
      if (response.ok) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.error("Error toggling cart:", error);
      toast.error("Something went wrong while updating cart.");
    }
  };

  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === null) {
      await fetchAllProducts();
    } else {
      await fetchProductsByCategory(categoryId);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="mx-auto py-12 px-4 md:px-16 lg:px-24">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-8 text-center">Shop</h2>

      {/* Categories Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <button
          className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
            selectedCategory === null
              ? "bg-red-800 text-white"
              : "bg-white text-gray-800 border-gray-300 hover:bg-red-100"
          }`}
          onClick={() => handleCategoryClick(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
              selectedCategory === cat.id
                ? "bg-red-800 text-white"
                : "bg-white text-gray-800 border-gray-300 hover:bg-red-100"
            }`}
            onClick={() => handleCategoryClick(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 cursor-pointer">
        {products.map((product) => (
          <ProductCard
            key={product.productId}
            product={product}
            isFavorite={favoriteProductIds.includes(product.productId)}
            onToggleFavorite={() => handleToggleFavorite(product.productId)}
            onToggleCart={() => handleToggleCart(product.productId)}
          />
        ))}
      </div>
    </div>
  );
};

export default Shop;
