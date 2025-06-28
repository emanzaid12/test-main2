import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import NoProduct from "../assets/images/no-found.png";

const FilterData = () => {
  const location = useLocation();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  // استخراج كلمة البحث من URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("search");

  // جلب المنتجات
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (!query || query.trim() === "") return;

      try {
        setLoading(true);
        const response = await fetch(
          `https://shopyapi.runasp.net/api/Products/search?query=${encodeURIComponent(
            query
          )}`
        );

        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setFilteredProducts(data);

        // ✅ استدعاء جلب المفضلات بعد نجاح المنتجات
        fetchFavorites();
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [query]);

  // جلب المفضلات
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

  // تبديل حالة المفضلة
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
    }
  };

  return (
    <div className="mx-auto py-12 px-4 md:px-16 lg:px-24">
      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : filteredProducts.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-6 text-center">Shop</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-6 cursor-pointer">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                product={{
                  productId: product.productId,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  imageUrl: product.image,
                  averageRating: product.averageRating,
                  totalReviews: product.totalReviews,
                }}
                isFavorite={favoriteProductIds.includes(product.productId)}
                onToggleFavorite={() => handleToggleFavorite(product.productId)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">
          <img
            src={NoProduct}
            alt="No Products Found"
            className="mx-auto mb-4"
          />
          <p className="text-gray-600">
            No products match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default FilterData;
