// src/pages/ShippingInfo.jsx
import React, { useState, useEffect } from "react";
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
    government: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // جلب آخر بيانات شحن عند تحميل الصفحة
  useEffect(() => {
    fetchLatestShippingInfo();
  }, []);

  const fetchLatestShippingInfo = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Order/shipping-info/latest",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setFormData({
          fullName: data.fullName || "",
          address: data.address || "",
          city: data.city || "",
          government: data.government || "",
          phoneNumber: data.phoneNumber || "",
        });
      }
    } catch (error) {
      console.log("No previous shipping info found");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // التحقق من صحة البيانات
    if (
      !formData.fullName ||
      !formData.address ||
      !formData.city ||
      !formData.government ||
      !formData.phoneNumber
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // حفظ البيانات في Redux
    dispatch(setShippingInfo(formData));
    navigate("/review-order");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md">
        <div className="bg-red-800 text-white text-lg font-semibold px-6 py-4 rounded-t-lg">
          Shipping Information
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              required
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-800"
              type="text"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <input
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-800"
              type="text"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              required
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-800"
              type="text"
              placeholder="Cairo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Government *
            </label>
            <input
              required
              name="government"
              value={formData.government}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-800"
              type="text"
              placeholder="Cairo Governorate"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              required
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-red-800"
              type="tel"
              placeholder="+20123456789"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-700 hover:scale-105 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Continue to Review Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingInfo;
