import React, { useState, useEffect } from "react";
import {
  FaPercent,
  FaDollarSign,
  FaTruck,
  FaGift,
  FaCrown,
  FaSave,
  FaEdit,
  FaCheck,
  FaTimes,
  FaStar,
  FaMedal,
  FaTrophy,
  FaGem,
} from "react-icons/fa";

const PlatformSettings = () => {
  // States for different settings
  const [firstOrderDiscount, setFirstOrderDiscount] = useState({
    id: null,
    percentage: 10,
    isEditing: false,
  });

  const [loyaltyLevels, setLoyaltyLevels] = useState([
    {
      level: 1,
      name: "Bronze",
      icon: <FaStar className="text-yellow-600" />,
      discountPercentage: 5,
      requiredSpent: 100,
      color: "bg-yellow-50 border-yellow-200",
      isEditing: false,
    },
    {
      level: 2,
      name: "Silver",
      icon: <FaMedal className="text-gray-400" />,
      discountPercentage: 10,
      requiredSpent: 500,
      color: "bg-gray-50 border-gray-200",
      isEditing: false,
    },
    {
      level: 3,
      name: "Gold",
      icon: <FaTrophy className="text-yellow-500" />,
      discountPercentage: 15,
      requiredSpent: 1000,
      color: "bg-yellow-50 border-yellow-300",
      isEditing: false,
    },
    {
      level: 4,
      name: "Platinum",
      icon: <FaGem className="text-purple-600" />,
      discountPercentage: 20,
      requiredSpent: 2000,
      color: "bg-purple-50 border-purple-200",
      isEditing: false,
    },
  ]);

  const [shippingCost, setShippingCost] = useState({
    id: null,
    cost: 15,
    isEditing: false,
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // API Base URLs
  const API_BASE = {
    discount: "https://shopyapi.runasp.net/api/discount-settings",
    loyalty:
      "https://shopyapi.runasp.net/api/AdminDiscount/admin/loyalty-levels",
    shipping: "https://shopyapi.runasp.net/api/Shipping",
  };

  // Utility functions
  const showMessage = (message, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } else {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  // API Functions
  const fetchFirstOrderDiscount = async () => {
    try {
      const response = await fetch(API_BASE.discount, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      
      if (!response.ok) throw new Error("Failed to fetch discount settings");
      const data = await response.json();
      setFirstOrderDiscount({
        id: data.id,
        percentage: data.firstOrderDiscountPercentage,
        isEditing: false,
      });
    } catch (error) {
      console.error("Error fetching first order discount:", error);
      showMessage("Error loading first order discount settings", true);
    }
  };

  const updateFirstOrderDiscount = async (percentage) => {
    try {
      const response = await fetch(API_BASE.discount, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: firstOrderDiscount.id,
          firstOrderDiscountPercentage: percentage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update discount");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating first order discount:", error);
      throw error;
    }
  };

  const fetchLoyaltyLevels = async () => {
    try {
      const response = await fetch(API_BASE.loyalty, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add your auth token here
        },
      });

      if (!response.ok) throw new Error("Failed to fetch loyalty levels");
      const data = await response.json();

      // Map API data to component structure
      const mappedLevels = loyaltyLevels.map((level, index) => {
        const apiLevel = data.find(
          (d) => parseInt(d.level.replace("Level", "")) === level.level
        );
        return {
          ...level,
          discountPercentage: apiLevel
            ? apiLevel.discountPercentage
            : level.discountPercentage,
          requiredSpent: apiLevel
            ? apiLevel.requiredSpent
            : level.requiredSpent,
        };
      });

      setLoyaltyLevels(mappedLevels);
    } catch (error) {
      console.error("Error fetching loyalty levels:", error);
      showMessage("Error loading loyalty levels", true);
    }
  };

  const updateLoyaltyLevels = async (levels) => {
    try {
      // تحقق من المستويات
      for (const level of levels) {
        if (![1, 2, 3, 4].includes(level.level)) {
          throw new Error(
            `Invalid level: ${level.level}. Only levels 1 to 4 are allowed.`
          );
        }
      }

      const apiLevels = levels.map((level) => ({
        level: level.level,
        requiredSpent: level.requiredSpent,
        discountPercentage: level.discountPercentage,
      }));

      console.log("Sending levels to API:", apiLevels);

      const response = await fetch(API_BASE.loyalty, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(apiLevels),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Status Code:", response.status);
        console.error("Response Text:", errorData);
        throw new Error(errorData || "Failed to update loyalty levels");
      }

      return await response.text();
    } catch (error) {
      console.error("Error updating loyalty levels:", error);
      throw error;
    }
  };
  
  
  const fetchShippingCost = async () => {
    try {
      const response = await fetch(API_BASE.shipping);
      if (!response.ok) throw new Error("Failed to fetch shipping cost");
      const data = await response.json();
      setShippingCost({
        id: data.id,
        cost: data.cost,
        isEditing: false,
      });
    } catch (error) {
      console.error("Error fetching shipping cost:", error);
      showMessage("Error loading shipping cost", true);
    }
  };

  const updateShippingCost = async (cost) => {
    try {
      const response = await fetch(API_BASE.shipping, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add your auth token here
        },
        body: JSON.stringify(cost),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to update shipping cost");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating shipping cost:", error);
      throw error;
    }
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchFirstOrderDiscount(),
          fetchLoyaltyLevels(),
          fetchShippingCost(),
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle First Order Discount
  const handleFirstOrderEdit = () => {
    setFirstOrderDiscount((prev) => ({ ...prev, isEditing: true }));
  };

  const handleFirstOrderSave = async () => {
    setLoading(true);
    try {
      await updateFirstOrderDiscount(firstOrderDiscount.percentage);
      setFirstOrderDiscount((prev) => ({ ...prev, isEditing: false }));
      showMessage("First order discount updated successfully!");
    } catch (error) {
      showMessage("Error updating first order discount", true);
    } finally {
      setLoading(false);
    }
  };

  const handleFirstOrderCancel = () => {
    setFirstOrderDiscount((prev) => ({ ...prev, isEditing: false }));
    // Reload original value
    fetchFirstOrderDiscount();
  };

  // Handle Loyalty Levels
  const handleLoyaltyEdit = (level) => {
    setLoyaltyLevels((prev) =>
      prev.map((l) => (l.level === level ? { ...l, isEditing: true } : l))
    );
  };

  const handleLoyaltySave = async (level) => {
    setLoading(true);
    try {
      await updateLoyaltyLevels(loyaltyLevels);
      setLoyaltyLevels((prev) =>
        prev.map((l) => (l.level === level ? { ...l, isEditing: false } : l))
      );
      showMessage("Loyalty level updated successfully!");
    } catch (error) {
      showMessage("Error updating loyalty level", true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoyaltyCancel = (level) => {
    setLoyaltyLevels((prev) =>
      prev.map((l) => (l.level === level ? { ...l, isEditing: false } : l))
    );
    // Reload original values
    fetchLoyaltyLevels();
  };

  const updateLoyaltyLevel = (level, field, value) => {
    setLoyaltyLevels((prev) =>
      prev.map((l) => (l.level === level ? { ...l, [field]: value } : l))
    );
  };

  // Handle Shipping Cost
  const handleShippingEdit = () => {
    setShippingCost((prev) => ({ ...prev, isEditing: true }));
  };

  const handleShippingSave = async () => {
    setLoading(true);
    try {
      await updateShippingCost(shippingCost.cost);
      setShippingCost((prev) => ({ ...prev, isEditing: false }));
      showMessage("Shipping cost updated successfully!");
    } catch (error) {
      showMessage("Error updating shipping cost", true);
    } finally {
      setLoading(false);
    }
  };

  const handleShippingCancel = () => {
    setShippingCost((prev) => ({ ...prev, isEditing: false }));
    // Reload original value
    fetchShippingCost();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
  <h1 className="text-4xl font-bold text-black mb-2">
    Platform Settings
  </h1>
  <p className="text-gray-600">
    Configure platform discounts and shipping settings
  </p>
</div>


        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <FaCheck className="text-[#7a0d0d] text-2xl" />
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <FaTimes className="text-[#7a0d0d] text-2xl" />
            {errorMessage}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
            Updating...
          </div>
        )}

        {/* First Order Discount Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaGift className="text-red-600 text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  First Order Discount
                </h2>
                <p className="text-gray-600">
                  Discount percentage for new customers
                </p>
              </div>
            </div>
            {!firstOrderDiscount.isEditing && (
              <button
                onClick={handleFirstOrderEdit}
                className="bg-red-800 hover:bg-red-800 text-white px-4 py-2 rounded-full flex items-center transition-colors duration-200"
                disabled={loading}
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center">
              <FaPercent className="text-red-800 text-3xl mr-4" />
              {firstOrderDiscount.isEditing ? (
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={firstOrderDiscount.percentage}
                    onChange={(e) =>
                      setFirstOrderDiscount((prev) => ({
                        ...prev,
                        percentage: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 text-2xl font-bold w-32 focus:outline-none focus:ring-2 focus:ring-red-500"
                    min="0"
                    max="100"
                  />
                  <span className="text-2xl font-bold text-gray-700">%</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleFirstOrderSave}
                      disabled={loading}
                      className="bg-red-800 hover:bg-red-800 text-white px-4 py-2 rounded-full flex items-center transition-colors duration-200 disabled:opacity-50"
                    >
                      <FaCheck className="mr-2" />
                      Save
                    </button>
                    <button
                      onClick={handleFirstOrderCancel}
                      disabled={loading}
                      className="bg-red-50 hover:bg-red-100 text-red-800 px-4 py-2 rounded-full flex items-center transition-colors duration-200 disabled:opacity-50"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-4xl font-bold text-red-600">
                  {firstOrderDiscount.percentage}%
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loyalty Levels Section */}
      {/* Loyalty Levels Section */}
<div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
  <div className="flex items-center mb-6">
    <div className="bg-red-100 p-3 rounded-full mr-4">
      <FaCrown className="text-red-800 text-2xl" />
    </div>
    <div>
      <h2 className="text-2xl font-semibold text-red-800">
        Loyalty Program Levels
      </h2>
      <p className="text-gray-600">
        Configure loyalty levels and rewards
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {loyaltyLevels.map((level) => (
      <div
        key={level.level}
        className={`${level.color} border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-2xl mr-3 text-red-800">{level.icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">
              {level.name}
            </h3>
          </div>
          {!level.isEditing && (
            <button
              onClick={() => handleLoyaltyEdit(level.level)}
              className="text-gray-500 hover:text-red-800 transition-colors duration-200"
              disabled={loading}
            >
              <FaEdit className="text-red-800" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Discount Percentage
            </label>
            {level.isEditing ? (
              <div className="flex items-center mt-1">
                <input
                  type="number"
                  value={level.discountPercentage}
                  onChange={(e) =>
                    updateLoyaltyLevel(
                      level.level,
                      "discountPercentage",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-800"
                  min="0"
                  max="100"
                />
                <span className="ml-2 text-gray-600">%</span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-red-800 mt-1">
                {level.discountPercentage}%
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Minimum Spending Required
            </label>
            {level.isEditing ? (
              <div className="flex items-center mt-1">
                <span className="text-gray-600 mr-2">$</span>
                <input
                  type="number"
                  value={level.requiredSpent}
                  onChange={(e) =>
                    updateLoyaltyLevel(
                      level.level,
                      "requiredSpent",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-800"
                  min="0"
                />
              </div>
            ) : (
              <div className="text-xl font-semibold text-gray-700 mt-1">
                ${level.requiredSpent}
              </div>
            )}
          </div>

          {level.isEditing && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleLoyaltySave(level.level)}
                disabled={loading}
                className="bg-red-800 hover:bg-red-900 text-white px-3 py-1 rounded-full flex items-center text-sm transition-colors duration-200 flex-1 disabled:opacity-50"
              >
                <FaCheck className="mr-1 text-white" />
                Save
              </button>
              <button
                onClick={() => handleLoyaltyCancel(level.level)}
                disabled={loading}
                className="bg-red-100 text-red-800 px-3 py-1 rounded-full flex items-center text-sm transition-colors duration-200 flex-1 disabled:opacity-50"
              >
                <FaTimes className="mr-1" />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Shipping Cost Section */}
       <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center">
      <div className="bg-red-100 p-3 rounded-full mr-4">
        <FaTruck className="text-red-800 text-2xl" />
      </div>
      <div>
        <h2 className="text-2xl font-semibold text-red-800">Shipping Cost</h2>
        <p className="text-gray-600">Standard shipping fee for all orders</p>
      </div>
    </div>
    {!shippingCost.isEditing && (
  <button
    onClick={handleShippingEdit}
    className="flex items-center bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-full transition duration-200"
    disabled={loading}
  >
    <FaEdit className="mr-2" />
    Edit
  </button>
)}


  </div>

  <div className="bg-gray-50 rounded-lg p-6">
    <div className="flex items-center">
      <FaDollarSign className="text-red-800 text-3xl mr-4" />
      {shippingCost.isEditing ? (
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={shippingCost.cost}
            onChange={(e) =>
              setShippingCost((prev) => ({
                ...prev,
                cost: parseFloat(e.target.value) || 0,
              }))
            }
            className="border border-gray-300 rounded-lg px-4 py-2 text-2xl font-bold w-32 focus:ring-red-800"
          />
          <div className="flex space-x-2">
            <button
              onClick={handleShippingSave}
              className="bg-red-800 text-white px-4 py-2 rounded-full"
            >
              <FaCheck className="mr-1" />
              Save
            </button>
            <button
              onClick={handleShippingCancel}
              className="bg-red-100 text-red-800 px-4 py-2 rounded-full"
            >
              <FaTimes className="mr-1" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-4xl font-bold text-red-800">${shippingCost.cost}</div>
      )}
    </div>
  </div>
</div>

        {/* Summary Section */}
        <div className="bg-gradient-to-r from-red-50 to-purple-50 rounded-xl p-6 border border-red-200 mt-8">
  <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
    <FaSave className="text-red-800 mr-2" />
    Current Settings Summary
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-2xl font-bold text-red-800">
        {firstOrderDiscount.percentage}%
      </div>
      <div className="text-sm text-gray-600">First Order Discount</div>
    </div>
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-2xl font-bold text-red-800">{loyaltyLevels.length}</div>
      <div className="text-sm text-gray-600">Active Loyalty Levels</div>
    </div>
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-2xl font-bold text-red-800">${shippingCost.cost}</div>
      <div className="text-sm text-gray-600">Standard Shipping</div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
};

export default PlatformSettings;
