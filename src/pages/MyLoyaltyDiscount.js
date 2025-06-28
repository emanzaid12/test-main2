import React, { useEffect, useState } from "react";

const MyLoyaltyDiscount = () => {
  const [loyaltyInfo, setLoyaltyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock token - replace with actual token from localStorage
  const token =  localStorage.getItem("authToken");

  useEffect(() => {
    const fetchLoyaltyInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://shopyapi.runasp.net/api/Order/api/loyalty/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized - Please login");
          } else if (response.status === 404) {
            throw new Error("Loyalty data not found");
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        }

        const data = await response.json();
        setLoyaltyInfo(data);
      } catch (error) {
        console.error("Error fetching loyalty info:", error);
        setError(error.message);
        setLoyaltyInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchLoyaltyInfo();
    } else {
      setError("Authentication token not found");
      setLoading(false);
    }
  }, [token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Bronze":
        return "text-amber-600";
      case "Silver":
        return "text-gray-500";
      case "Gold":
        return "text-yellow-500";
      case "Platinum":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const getLevelBgColor = (level) => {
    switch (level) {
      case "Bronze":
        return "bg-amber-50 border-amber-200";
      case "Silver":
        return "bg-gray-50 border-gray-200";
      case "Gold":
        return "bg-yellow-50 border-yellow-200";
      case "Platinum":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold">Error</p>
          <p className="text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!loyaltyInfo || loyaltyInfo.currentLevel === "None") {
    return (
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">🎁</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Loyalty Program
          </h2>
          <p className="text-gray-600 mb-4">
            You don't currently have a loyalty level. Start shopping to earn
            loyalty points!
          </p>

          {loyaltyInfo && loyaltyInfo.totalSpent > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-800">
              <p className="text-sm text-gray-600 mb-2">Current Progress:</p>
              <p className="text-lg font-bold text-red-800">
                {formatCurrency(loyaltyInfo.totalSpent)} spent
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Keep shopping to unlock your first loyalty level!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-red-800 text-center">
        Loyalty Program Information
      </h2>

      <div
        className={`p-4 rounded-lg border-2 mb-6 ${getLevelBgColor(
          loyaltyInfo.currentLevel
        )}`}
      >
        <div className="text-center">
          <h3
            className={`text-2xl font-bold ${getLevelColor(
              loyaltyInfo.currentLevel
            )}`}
          >
            {loyaltyInfo.currentLevel}
          </h3>
          <p className="text-sm text-gray-600 mt-1">Current Loyalty Level</p>
        </div>
      </div>

      <div className="space-y-4 text-gray-700 mb-6">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
          <span className="font-semibold">Total Spent:</span>
          <span className="text-green-600 font-bold">
            {formatCurrency(loyaltyInfo.totalSpent)}
          </span>
        </div>
      </div>

      {loyaltyInfo.coupons && loyaltyInfo.coupons.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2">🎫</span>
            Available Coupons
          </h3>
          <div className="space-y-3">
            {loyaltyInfo.coupons.map((coupon, index) => (
              <div
                key={index}
                className="border border-dashed border-gray-300 p-3 rounded-lg bg-green-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-sm font-bold text-green-700">
                      {coupon.code}
                    </p>
                    <p className="text-sm text-green-600">
                      {coupon.discountPercentage}% Discount
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Expires:{" "}
                      {new Date(coupon.expiryDate).toLocaleDateString("en-US")}
                    </p>
                    <p
                      className={`text-xs ${
                        coupon.daysUntilExpiry > 7
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {coupon.daysUntilExpiry} days left
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default MyLoyaltyDiscount;
