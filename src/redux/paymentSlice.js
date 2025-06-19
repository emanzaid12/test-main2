// src/redux/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  method: "visa",
  nameOnCard: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethod: (state, action) => {
      state.method = action.payload;
    },
    setPaymentDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setPaymentMethod, setPaymentDetails } = paymentSlice.actions;
export default paymentSlice.reducer;
