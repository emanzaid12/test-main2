import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrders, markAsDelivered } from "../../redux/ordersSlice";

const ManageOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Function to fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const token = getAuthToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Admin/orders/overview/details",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        } else if (response.status === 403) {
          throw new Error("Access denied. Admin privileges required.");
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();

      // Transform API data to match your component structure
      const transformedOrders = data.All.map((order) => ({
        id: order.OrderId,
        fullName: order.Customer.FullName,
        phone: order.Customer.Phone,
        city: order.Customer.Address.split(", ")[1] || order.Customer.Address, // Extract city
        address: order.Customer.Address,
        totalAmount: order.TotalAfterDiscount,
        paymentMethod: "Cash on Delivery", // Default since API doesn't provide this
        orderDate: order.CreatedAt,
        status: order.Status,
        products: order.Products.map((product) => ({
          name: product.Name,
          quantity: product.Quantity,
          image: product.ImageUrl.startsWith("http")
            ? product.ImageUrl
            : `https://shopyapi.runasp.net/${product.ImageUrl}`,
        })),
      }));

      dispatch(setOrders(transformedOrders));
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message);
      setToastMessage("Failed to load orders: " + error.message);
      setTimeout(() => setToastMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = getAuthToken();

      if (!token) {
        setError("No authentication token found. Please login again.");
        return;
      }

      // You'll need to implement the update status API endpoint
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.status}`);
      }

      // Update local state
      dispatch(markAsDelivered(orderId));
      setToastMessage(`Order #${orderId} marked as ${newStatus}`);
      setTimeout(() => setToastMessage(""), 3000);

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      setToastMessage("Failed to update order status: " + error.message);
      setTimeout(() => setToastMessage(""), 5000);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "All" ? true : order.status === filterStatus;

    const matchesSearch = String(order.id).includes(searchQuery);

    return matchesStatus && matchesSearch;
  });

  // Group orders logic (if needed)
  const groupedOrders = [];

  filteredOrders.forEach((order) => {
    const existingIndex = groupedOrders.findIndex(
      (o) => o.fullName === order.fullName && o.id === order.id
    );

    if (existingIndex !== -1) {
      groupedOrders[existingIndex] = {
        ...groupedOrders[existingIndex],
        products: Array.isArray(order.products) ? [...order.products] : [],
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        orderDate: order.orderDate,
      };
    } else {
      groupedOrders.push({
        ...order,
        products: Array.isArray(order.products) ? [...order.products] : [],
      });
    }
  });

  return (
    <div className="p-8 relative">
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white text-[#7a0d0d] font-semibold px-6 py-3 rounded shadow-md transition duration-300 z-50">
          {toastMessage}
        </div>
      )}

      <h2 className="text-2xl font-semibold text-center text-[#7a0d0d] mb-6">
        Manage Orders
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3 focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/4 focus:ring-2 focus:ring-[#7a0d0d] focus:border-[#7a0d0d]"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-[#7a0d0d] text-white px-4 py-2 rounded-md hover:bg-[#5a0a0a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7a0d0d]"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100 text-[#7a0d0d] text-sm font-semibold">
              <th className="px-4 py-3 border">Order ID</th>
              <th className="px-4 py-3 border">Products</th>
              <th className="px-4 py-3 border">Full Name</th>
              <th className="px-4 py-3 border">City</th>
              <th className="px-4 py-3 border">Phone</th>
              <th className="px-4 py-3 border">Total Amount</th>
              <th className="px-4 py-3 border">Payment Method</th>
              <th className="px-4 py-3 border">Order Date</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {groupedOrders.map((order) => (
              <tr key={order.id} className="text-sm text-gray-700 align-top">
                <td className="px-4 py-3 border">#{order.id}</td>
                <td className="px-4 py-3 border space-y-2">
                  {Array.isArray(order.products) &&
                    order.products.map((p, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded object-cover"
                          onError={(e) => {
                            e.target.src = "default-image.jpg";
                          }}
                        />
                        <div className="text-left">
                          <p className="font-medium">{p.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {p.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                </td>
                <td className="px-4 py-3 border">{order.fullName || "-"}</td>
                <td className="px-4 py-3 border">{order.city || "-"}</td>
                <td className="px-4 py-3 border">{order.phone || "-"}</td>
                <td className="px-4 py-3 border">${order.totalAmount}</td>
                <td className="px-4 py-3 border">
                  {order.paymentMethod || "-"}
                </td>
                <td className="px-4 py-3 border">{order.orderDate || "-"}</td>
                <td className="px-4 py-3 border">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "Canceled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 border">
                  {order.status === "Pending" && (
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => updateOrderStatus(order.id, "Shipped")}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      >
                        Ship
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, "Canceled")}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  {order.status === "Shipped" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "Delivered")}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                    >
                      Deliver
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {groupedOrders.length === 0 && !loading && (
              <tr>
                <td
                  colSpan="10"
                  className="px-4 py-6 text-gray-500 text-center text-sm"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
