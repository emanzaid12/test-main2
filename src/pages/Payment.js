// src/pages/Payment.jsx
// src/pages/Payment.js
import React, { useState } from "react";
import {
  FaCcVisa,
  FaPaypal,
  FaMoneyBillAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPaymentDetails, setPaymentMethod } from "../redux/paymentSlice";

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("visa");
  const [shake, setShake] = useState(false);
  const [cardData, setCardData] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleSelect = (method) => {
    setSelectedMethod(method);
    if (method === "cash") {
      toast.success(
        <div className="text-red-800 font-semibold flex flex-col items-center justify-center text-center h-full">
          <div className="flex items-center gap-2 justify-center">
            <FaCheckCircle className="text-red-800 text-xl" />
            <span>Cash payment confirmed.</span>
          </div>
          <div className="mt-1">Order will be paid on delivery.</div>
        </div>,
        {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: false,
          className:
            "bg-white border border-red-800 rounded-md shadow-md py-4 px-6 flex items-center justify-center",
          icon: false,
        }
      );
      setShake(true);
    } else {
      setShake(false);
    }
  };

  const handleCardChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(setPaymentMethod(selectedMethod));

    if (selectedMethod === "visa" || selectedMethod === "paypal") {
      const { nameOnCard, cardNumber, expiryDate, cvv } = cardData;
      dispatch(
        setPaymentDetails({
          nameOnCard,
          cardNumber,
          expiry: expiryDate,
          cvv,
        })
      );
    }

    // Navigate to review page
    navigate("/review-order");

  }; // ✅ هذا القوس كان ناقص

  const methods = [
    { id: "visa", icon: <FaCcVisa />, label: "Visa" },
    { id: "paypal", icon: <FaPaypal />, label: "PayPal" },
    { id: "cash", icon: <FaMoneyBillAlt />, label: "Cash" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-16 lg:px-24">
      <ToastContainer />

      {/* Payment Methods */}
      <div className="flex flex-col items-center gap-6">
        <h3 className="text-lg font-semibold text-red-800">Payment Method</h3>
        <div className="flex gap-4 w-full justify-center">
          {methods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleSelect(method.id)}
              className={`relative cursor-pointer px-8 py-6 w-40 text-center rounded-xl transition-all duration-200 shadow-md ${
                selectedMethod === method.id
                  ? "border-2 border-red-800 bg-white"
                  : "bg-white border border-gray-300"
              }`}
            >
              {selectedMethod === method.id && (
                <div className="absolute -top-3 -right-3 bg-red-800 rounded-full p-1">
                  <FaCheckCircle className="text-white text-lg" />
                </div>
              )}
              <div className="text-3xl text-red-800 mx-auto mb-2">
                {method.icon}
              </div>
              <span className="text-red-800 font-semibold">{method.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-red-800 mb-6">Payment Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedMethod !== "cash" && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name on Card</label>
                <input
                  type="text"
                  name="nameOnCard"
                  value={cardData.nameOnCard}
                  onChange={handleCardChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={cardData.cvv}
                    onChange={handleCardChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className={`bg-red-800 text-white px-6 py-2 rounded-full transition-all duration-200 hover:bg-red-700 hover:scale-105 ${
                shake ? "animate-bounce" : ""
              }`}
            >
              Review Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
