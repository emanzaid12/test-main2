import React, { useState, useEffect } from "react";
import {
  FaPercentage,
  FaUser,
  FaBox,
  FaDollarSign,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
} from "react-icons/fa";

const MyDiscount = () => {
  const [discounts, setDiscounts] = useState([]);
  const [filteredDiscounts, setFilteredDiscounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDiscounts: 0,
    activeDiscounts: 0,
    originalProfit: 0,
    profitLoss: 0,
  });

  const API_BASE = "https://shopyapi.runasp.net/api";

  // Helper function to get auth headers (you'll need to implement this based on your auth system)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken"); // Adjust based on your token storage
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const [totalResponse, activeResponse, profitResponse] = await Promise.all(
        [
          fetch(`${API_BASE}/SellerDiscount/count/all`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${API_BASE}/SellerDiscount/count/active`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${API_BASE}/SellerOrders/report/profit-summary`, {
            headers: getAuthHeaders(),
          }),
        ]
      );

      const totalData = await totalResponse.json();
      const activeData = await activeResponse.json();
      const profitData = await profitResponse.json();

      setStats({
        totalDiscounts: totalData.totalDiscounts || 0,
        activeDiscounts: activeData.activeDiscounts || 0,
        originalProfit: profitData.yearly?.beforeDiscount || 0,
        profitLoss: profitData.yearly?.lossFromDiscount || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Fetch all discounts based on filter
  const fetchDiscounts = async (status = "all") => {
    try {
      let endpoint;
      switch (status) {
        case "active":
          endpoint = `${API_BASE}/SellerDiscount/active-discounts`;
          break;
        case "expired":
          endpoint = `${API_BASE}/SellerDiscount/expired-discounts`;
          break;
        case "used":
          endpoint = `${API_BASE}/SellerDiscount/used-discounts`;
          break;
        default:
          endpoint = `${API_BASE}/SellerDiscount/my-discounts`;
      }

      const response = await fetch(endpoint, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();

        // Transform API data to match component structure
        const transformedData = data.map((discount, index) => ({
          id: discount.Id || index,
          userName: discount.user || "N/A",
          // You might need to add this to API
          // Using Store as product for now
          // Placeholder image
          originalPrice: 0, // Not available in current API
          discountPercentage: discount.discountPercentage || 0,
          finalPrice: 0, // Not available in current API
          profitBefore: 0, // Not available in current API
          profitAfter: 0, // Not available in current API
          discountDate: discount.createdAt || new Date().toISOString(),
          expiryDate: discount.expiryDate || new Date().toISOString(),
          status:
            discount.Status ||
            (discount.IsUsed
              ? "used"
              : new Date(discount.ExpiryDate) < new Date()
              ? "expired"
              : "active"),
          couponCode: discount.couponCode || "N/A",
        }));

        setDiscounts(transformedData);
        setFilteredDiscounts(transformedData);
      }
    } catch (error) {
      console.error("Error fetching discounts:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchDiscounts(filterStatus)]);
      setLoading(false);
    };

    loadData();
  }, []);

  // Update discounts when filter changes
  useEffect(() => {
    if (filterStatus !== "all") {
      fetchDiscounts(filterStatus);
    } else {
      fetchDiscounts("all");
    }
  }, [filterStatus]);

  useEffect(() => {
    let filtered = discounts;

    if (searchTerm) {
      filtered = filtered.filter(
        (discount) =>
          discount.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          discount.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          discount.couponCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDiscounts(filtered);
  }, [searchTerm, discounts]);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-blue-100 text-blue-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "used":
        return "Used";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-red-800">My Discounts</h1>
          <p className="text-gray-600 mt-1">
            Manage discounts and offers provided to customers
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: <FaPercentage className="text-red-600 text-xl" />,
            bg: "bg-red-100",
            label: "Total Discounts",
            value: stats.totalDiscounts,
            color: "text-red-800",
          },
          {
            icon: <FaUser className="text-green-600 text-xl" />,
            bg: "bg-green-100",
            label: "Active Discounts",
            value: stats.activeDiscounts,
            color: "text-green-800",
          },
          {
            icon: <FaDollarSign className="text-blue-600 text-xl" />,
            bg: "bg-blue-100",
            label: "Original Profit (Yearly)",
            value: `$${stats.originalProfit.toLocaleString()}`,
            color: "text-blue-800",
          },
          {
            icon: <FaDollarSign className="text-orange-600 text-xl" />,
            bg: "bg-orange-100",
            label: "Loss from Discounts",
            value: `$${stats.profitLoss.toLocaleString()}`,
            color: "text-orange-800",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full ${stat.bg}`}>{stat.icon}</div>
              <div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, store, or coupon code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-red-800">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-red-800">
                  Store
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-red-800">
                  Coupon Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-red-800">
                  Discount %
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-red-800">
                  Created Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-red-800">
                  Expiry Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-red-800">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDiscounts.map((discount, index) => (
                <tr
                  key={discount.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-red-600 text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {discount.userName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {discount.userEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FaBox className="text-gray-600" />
                      </div>
                      <p className="font-medium text-gray-900">
                        {discount.productName}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                      {discount.couponCode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {discount.discountPercentage}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      {new Date(discount.discountDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      {new Date(discount.expiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        discount.status
                      )}`}
                    >
                      {getStatusText(discount.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Result */}
      {filteredDiscounts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaPercentage className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Discounts Found
          </h3>
          <p className="text-gray-500">
            No discounts match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyDiscount;
