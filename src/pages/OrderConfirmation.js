import React from "react";
import { useNavigate, Link } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
      {/* دائرة بعلامة الصح مع الأنيميشن */}
      <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center shadow-lg mb-6 animate-bounceIn">
        <svg
          className="w-14 h-14 text-red-800"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* عنوان وتفاصيل */}
      <h2 className="text-2xl font-bold text-red-800 mb-2">Order Confirmed</h2>
      <p className="text-sm text-gray-700 mb-1">
        Thank you for your order. You will receive an email confirmation shortly.
      </p>
      <p className="text-sm text-gray-700 mb-6">
        You can check the status of your order in&nbsp;
        <Link
          to="/order-tracking"
          className="text-red-800 font-semibold underline hover:text-red-700"
        >
          Order tracking
        </Link>
        .
      </p>

      {/* زر الرجوع للهوم */}
      <button
        onClick={() => navigate("/")}
        className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-transform"
      >
        Continue to Home
      </button>
    </div>
  );
};

export default OrderConfirmation;
