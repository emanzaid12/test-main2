import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrderDetails = localStorage.getItem("orderDetails");
    if (storedOrderDetails) {
      setOrderDetails(JSON.parse(storedOrderDetails));
    }
    setLoading(false);
  }, []);

  const handleContinueHome = () => {
    localStorage.removeItem("orderDetails");
    navigate("/");
  };

  const handleTrackOrder = () => {
    if (orderDetails?.orderId) {
      navigate("/order-tracking", {
        state: { orderId: orderDetails.orderId },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
      {/* Success Icon */}
      <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center shadow-lg mb-6 animate-bounce">
        <svg
          className="w-14 h-14 text-red-800"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Confirmation Message */}
      <h2 className="text-2xl font-bold text-red-800 mb-2">Order Confirmed!</h2>
      <p className="text-sm text-gray-700 mb-1 text-center">
        {orderDetails?.message ||
          "Thank you for your order. You will receive an email confirmation shortly."}
      </p>

      {/* Order Summary */}
      {orderDetails && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 text-sm">
            {orderDetails.orderId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">#{orderDetails.orderId}</span>
              </div>
            )}
            {orderDetails.totalOriginalPrice && (
              <div className="flex justify-between">
                <span className="text-gray-600">Original Price:</span>
                <span>${orderDetails.totalOriginalPrice.toFixed(2)}</span>
              </div>
            )}
            {orderDetails.discountedAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${orderDetails.discountedAmount.toFixed(2)}</span>
              </div>
            )}
            {orderDetails.firstOrderDiscountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>First Order Discount:</span>
                <span>
                  -${orderDetails.firstOrderDiscountAmount.toFixed(2)}
                </span>
              </div>
            )}
            {orderDetails.shippingFee && (
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Fee:</span>
                <span>${orderDetails.shippingFee.toFixed(2)}</span>
              </div>
            )}
            {orderDetails.platformFee && (
              <div className="flex justify-between">
                <span className="text-gray-600">Platform Fee:</span>
                <span>${orderDetails.platformFee.toFixed(2)}</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-red-800">
                $
                {(
                  orderDetails.totalWithShipping ||
                  orderDetails.totalFinalPrice ||
                  0
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tracking + Continue Buttons */}
      <p className="text-sm text-gray-700 mb-6 text-center">
        You can check the status of your order in&nbsp;
        <button
          onClick={handleTrackOrder}
          className="text-red-800 font-semibold underline hover:text-red-700"
        >
          Order tracking
        </button>
        .
      </p>

      <button
        onClick={handleContinueHome}
        className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-transform"
      >
        Continue to Home
      </button>
    </div>
  );
};

export default OrderConfirmation;
