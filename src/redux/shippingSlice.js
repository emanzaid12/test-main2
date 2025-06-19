// src/redux/shippingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullName: "",
  address: "",
  city: "",
  phone: "",
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    setShippingInfo: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setShippingInfo } = shippingSlice.actions;
export default shippingSlice.reducer;
