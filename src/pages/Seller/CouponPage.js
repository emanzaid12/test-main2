import React, { useState, useEffect } from "react";
import { FiGift, FiUser, FiX, FiPercent, FiCalendar } from "react-icons/fi";
import { FaGift } from "react-icons/fa";

const BuyersPage = () => {
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [discountForm, setDiscountForm] = useState({
    couponCode: "",
    discountPercentage: "",
    expiryDate: "",
  });
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch buyers from API
  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Store/my-buyers",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      setBuyers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching buyers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Discount Management Functions
  const handleOpenDiscountModal = (buyer) => {
    setSelectedBuyer(buyer);
    setIsDiscountModalOpen(true);
    setDiscountForm({
      couponCode: "",
      discountPercentage: "",
      expiryDate: "",
    });
  };

  const handleDiscountChange = (e) => {
    setDiscountForm({ ...discountForm, [e.target.name]: e.target.value });
  };

  const handleSendDiscount = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(
        "https://shopyapi.runasp.net/api/SellerDiscount/send-discount",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedBuyer.userId,
            couponCode: discountForm.couponCode,
            discountPercentage: parseInt(discountForm.discountPercentage),
            expiryDate: discountForm.expiryDate,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to send discount");
      }

      const result = await response.text();
      alert("Discount sent successfully! 🎉");
      setIsDiscountModalOpen(false);
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error("Error sending discount:", err);
    }
  };

  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={onClose}
        ></div>
        <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-red-800 text-white text-center py-3 text-lg font-semibold flex justify-between items-center px-5">
            <span>{title}</span>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <FiX />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading buyers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchBuyers}
            className="mt-4 bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-red-800 mb-2">My Buyers</h1>
        <p className="text-gray-600">
          Manage your customers and send them special discounts
        </p>
      </div>

      {/* Buyers Grid */}
      {buyers.length === 0 ? (
        <div className="text-center py-20">
          <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl text-gray-600 mb-2">No Buyers Yet</h3>
          <p className="text-gray-500">
            You don't have any buyers at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyers.map((buyer, index) => (
            <div
              key={buyer.userId}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Buyer Info Section */}
              <div className="bg-red-800 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiUser className="text-2xl mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {buyer.userName}
                      </h3>
                      <p className="text-sm opacity-90">
                        User ID: {buyer.userId}
                      </p>
                      <p className="text-sm opacity-90">
                        {buyer.ordersCount} Orders
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="p-4">
                <button
                  onClick={() => handleOpenDiscountModal(buyer)}
                  className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-600 hover:to-red-800 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-md"
                >
                  <FaGift className="text-lg" />
                  Add Discount
                </button>
              </div>

              {/* Stats Section */}
              <div className="px-4 pb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Orders:</span>
                    <span className="font-semibold text-red-800">
                      {buyer.ordersCount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Discount Modal */}
      <Modal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        title={`Send Discount to ${selectedBuyer?.userName}`}
      >
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiGift className="inline mr-2" />
              Coupon Code
            </label>
            <input
              type="text"
              name="couponCode"
              value={discountForm.couponCode}
              onChange={handleDiscountChange}
              placeholder="Enter coupon code (e.g., SAVE20)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiPercent className="inline mr-2" />
              Discount Percentage
            </label>
            <input
              type="number"
              name="discountPercentage"
              value={discountForm.discountPercentage}
              onChange={handleDiscountChange}
              placeholder="Enter discount percentage"
              min="1"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline mr-2" />
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={discountForm.expiryDate}
              onChange={handleDiscountChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              💡 The discount will be sent as a notification to the customer and
              can be used on their next purchase.
            </p>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={handleSendDiscount}
              disabled={
                !discountForm.couponCode ||
                !discountForm.discountPercentage ||
                !discountForm.expiryDate
              }
              className="bg-red-800 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition transform hover:scale-105 text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg"
            >
              🎉 Send Discount
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BuyersPage;
