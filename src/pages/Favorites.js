import React from "react";
import { FaHeartBroken } from "react-icons/fa";
import { useFavorites } from "../pages/FavoritesContext";

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();

  return (
    <div className="bg-gray-100 min-h-[calc(100vh-80px)] py-16">
      {favorites.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[calc(100vh-80px)] text-center">
          <FaHeartBroken className="text-red-800 text-7xl mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">No favorites yet</h2>
          <p className="text-gray-600 text-lg max-w-md">
            You haven’t added anything to your favorites yet. Start exploring and mark what you love!
          </p>
        </div>
      ) : (
        <div className="pt-8 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <button
                className="mt-4 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => removeFromFavorites(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;