import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./cartSlice";
import productSlice from "./productSlice";
import shippingReducer from "./shippingSlice";
import paymentReducer from "./paymentSlice";
import favoriteReducer from "./favoriteSlice";
const store = configureStore({
  reducer: {
    cart: cartSlice,
    product: productSlice,
    shipping: shippingReducer,
    favorites: favoriteReducer,
    payment: paymentReducer,
  },
});
export default store;