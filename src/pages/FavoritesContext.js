import React, { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addToFavorites = (item) => {
    if (!favorites.find((fav) => fav.id === item.id)) {
      setFavorites([...favorites, item]);
    }
  };

  const removeFromFavorites = (id) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);