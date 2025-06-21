import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FavoritesPage = () => {
  const [favoriteItems, setFavoriteItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ تعديل: استخدم authToken بدلًا من token
  const token = localStorage.getItem("authToken");

  const fetchFavorites = async () => {
    try {
      const res = await fetch("https://shopyapi.runasp.net/api/Favourite/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ معالجة التوكن المنتهي أو غير الصحيح
      if (res.status === 401 || res.status === 403) {
        alert("Your session has expired. Please log in again.");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch favorites");

      const data = await res.json();
      setFavoriteItems(data);
    } catch (error) {
      console.error("Fetch favorites error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (productId) => {
    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Favourite/remove?productId=${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setFavoriteItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
      } else {
        console.error("Failed to remove from favorites");
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-16 lg:px-24">
      <h1 className="text-4xl font-bold mb-8 text-center">Your Favorites</h1>

      {loading ? (
        <p className="text-center text-gray-600 text-xl">Loading...</p>
      ) : favoriteItems.length === 0 ? (
        <p className="text-center text-gray-600 text-xl">
          You haven't added any favorite products yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteItems.map((product) => (
            <div
              key={product.productId}
              className="border p-4 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              <Link to={`/product/${product.productId}`} className="block">
                <img
                  src={product.imageUrl || "/default.jpg"}
                  alt={product.productName}
                  className="h-48 w-full object-contain mb-4"
                />
                <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                  {product.productName}
                </h2>
              </Link>

              <button
                onClick={() => handleRemoveFromFavorites(product.productId)}
                className="mt-4 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
