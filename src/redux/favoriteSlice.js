import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [], // مصفوفة لتخزين المنتجات المفضلة
  },
  reducers: {
    // ✅ إضافة منتج إلى المفضلة (تستخدم productId بدل id)
    addToFavorites: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) => item.productId === product.productId
      );
      if (!existingItem) {
        state.items.push(product);
      }
    },

    // ✅ إزالة منتج من المفضلة باستخدام productId
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);
    },

    // تعيين قائمة المفضلة من مصدر خارجي (مثلاً من localStorage أو API)
    setFavorites: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, setFavorites } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
