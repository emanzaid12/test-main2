import { createSlice } from "@reduxjs/toolkit";

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    list: [], // البيانات كلها هتتخزن هنا
    loading: false,
    error: null,
  },
  reducers: {
    // تعيين الطلبات يدويًا (مثلاً من localStorage)
    setOrders: (state, action) => {
      state.list = action.payload;
    },
    // تغيير حالة الطلب إلى "تم التوصيل"
    markAsDelivered: (state, action) => {
      const orderId = action.payload;
      const order = state.list.find((o) => o.id === orderId);
      if (order) {
        order.status = "Delivered";
      }
    },
  },
});

export const { setOrders, markAsDelivered } = ordersSlice.actions;
export default ordersSlice.reducer;
