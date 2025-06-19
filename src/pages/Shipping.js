// src/pages/ShippingInfo.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setShippingInfo } from "../redux/shippingSlice";

const ShippingInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setShippingInfo(formData)); // حفظ البيانات في Redux
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="bg-red-800 text-white text-lg font-semibold px-6 py-4 rounded-t-lg">
          Shipping Information
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          {["fullName", "address", "city", "phone"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field === "fullName"
                  ? "Full Name"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                required
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-800"
                type={field === "phone" ? "tel" : "text"}
                placeholder={
                  field === "fullName"
                    ? "John Doe"
                    : field === "phone"
                    ? "+20123456789"
                    : field === "address"
                    ? "123 Main St"
                    : "Cairo"
                }
              />
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-700 hover:scale-105 transition-all duration-200"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingInfo;
