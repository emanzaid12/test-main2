// src/pages/ReviewOrder.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";



const ReviewOrder = () => {
    const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.products || []);
  const shipping = useSelector((state) => state.shipping);
  const payment = useSelector((state) => state.payment);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingCharge = 60;
  const taxes = 80;
  const discount = payment.promoCodeValid ? 10 : 0;
  const total = subtotal + shippingCharge + taxes - discount;

  const orderId = Math.floor(Math.random() * 900000000 + 100000000);

  const handlePlaceOrder = () => {
    navigate("/order-confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 md:px-16 lg:px-24 flex flex-col lg:flex-row gap-8">
      {/* LEFT SIDE */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Order</h2>
        <p className="text-sm text-gray-500 mb-6">Order ID : {orderId}</p>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded mb-2"
              />
              <h4 className="font-semibold text-gray-800">{item.name}</h4>
              <p className="text-red-800 font-semibold text-lg">
                ${item.price.toFixed(2)}
              </p>
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
          <div className="flex justify-between text-sm text-gray-700">
            <span>Shipping</span>
            <span>${shippingCharge.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Taxes</span>
            <span>${taxes.toFixed(2)}</span>
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
          <button className="bg-red-800 text-white px-6 py-3 rounded-full text-lg font-semibold transition-transform duration-200 hover:bg-red-700 hover:scale-105"
          onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/3 space-y-6 mt-10 lg:mt-24">
        {/* Shipping Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 font-semibold mb-2">Shipping Info</h4>
          <p className="text-sm text-gray-700">{shipping.name}</p>
          <p className="text-sm text-gray-700">{shipping.phone}</p>
          <p className="text-sm text-gray-700">{shipping.city}</p>
          <p className="text-sm text-gray-700">{shipping.address}</p>
        </div>

        {/* Payment Method Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-gray-800 font-semibold mb-2">Payment Method</h4>
          <p className="text-sm text-gray-700 capitalize mb-2">
            {payment.method}
          </p>
          {payment.method === "visa" && (
            <div className="space-y-1 text-sm text-gray-700">
              <p>Name on Card: {payment.nameOnCard}</p>
              <p>Card Number: **** **** **** {payment.cardNumber.slice(-4)}</p>
              <p>Expiry: {payment.expiry}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewOrder;
