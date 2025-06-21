import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReviewOrder = () => {
  const navigate = useNavigate();
  const shipping = useSelector((state) => state.shipping);
  const payment = useSelector((state) => state.payment);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const orderId = Math.floor(Math.random() * 900000000 + 100000000);

  // ✅ جلب بيانات السلة من API
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("Please login first");
          return;
        }

        const res = await fetch("https://shopyapi.runasp.net/api/Cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCartItems(data.cartItems || []);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError("Unable to load cart items.");
      }
    };

    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );
  const shippingCharge = 60;
  const taxes = 80;
  const discount = payment.promoCodeValid ? 10 : 0;
  const total = subtotal + shippingCharge + taxes - discount;

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const orderData = {
        fullName: shipping.fullName,
        address: shipping.address,
        city: shipping.city,
        government: shipping.government,
        phoneNumber: shipping.phoneNumber,
      };

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Order/buy-from-cart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        const result = await response.json();

        localStorage.setItem(
          "orderDetails",
          JSON.stringify({
            message: result.message,
            totalOriginalPrice: result.totalOriginalPrice,
            discountedAmount: result.discountedAmount,
            firstOrderDiscountAmount: result.firstOrderDiscountAmount,
            totalFinalPrice: result.totalFinalPrice,
            shippingFee: result.shippingFee,
            platformFee: result.platformFee,
            totalWithShipping: result.totalWithShipping,
            discountedProducts: result.discountedProducts,
            orderId: result.orderId || orderId,
          })
        );

        navigate("/order-confirmation");
      } else {
        const errorData = await response.json();
        setError(
          errorData.message || "Failed to place order. Please try again."
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 md:px-16 lg:px-24 flex flex-col lg:flex-row gap-8">
      {/* LEFT SIDE */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Order</h2>
        <p className="text-sm text-gray-500 mb-6">Order ID : {orderId}</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
            >
              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-24 h-24 rounded mb-2"
              />
              <h4 className="font-semibold text-gray-800">
                {item.productName}
              </h4>
              <p className="text-red-800 font-semibold text-lg">
                ${item.price?.toFixed(2)}
              </p>
              <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
         
          
          {discount > 0 && (
            <div className="flex justify-between text-sm text-gray-700">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <hr />
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-red-800 text-white px-6 py-3 rounded-full text-lg font-semibold transition-transform duration-200 hover:bg-red-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/3 space-y-6 mt-10 lg:mt-24">
        {/* Shipping Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 font-semibold mb-2">Shipping Info</h4>
          <p className="text-sm text-gray-700">{shipping.fullName}</p>
          <p className="text-sm text-gray-700">{shipping.phoneNumber}</p>
          <p className="text-sm text-gray-700">
            {shipping.city}, {shipping.government}
          </p>
          <p className="text-sm text-gray-700">{shipping.address}</p>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 font-semibold mb-2">Payment Method</h4>
          <p className="text-sm text-gray-700 capitalize mb-2">
            {payment?.method || "Cash on Delivery"}
          </p>
          {payment?.method === "visa" && (
            <div className="space-y-1 text-sm text-gray-700">
              <p>Name on Card: {payment.nameOnCard}</p>
              <p>Card Number: **** **** **** {payment.cardNumber?.slice(-4)}</p>
              <p>Expiry: {payment.expiry}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewOrder;
