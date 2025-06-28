import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaEye, FaSpinner } from "react-icons/fa";

const OrderReceived = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // يجب وضع الـ token هنا - هاخده من localStorage أو context
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || "";
  };

  const API_BASE = "https://shopyapi.runasp.net/api/SellerOrders";

  // جلب الطلبات حسب الحالة
  const fetchOrders = async (status = "All") => {
    try {
      setLoading(true);
      setError("");

      const token = getAuthToken();
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const response = await fetch(
        `${API_BASE}/orders/status/${status}?sortOldToNew=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401)
          throw new Error("Unauthorized - Please login again");
        if (response.status === 404) throw new Error("Store not found");
        throw new Error();
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // جلب منتجات طلب معين
  const fetchOrderProducts = async (orderId) => {
    try {
      setLoadingProducts(true);
      const token = getAuthToken();

      const response = await fetch(`${API_BASE}/orders/${orderId}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching products: ${response.status}`);
      }

      const data = await response.json();
      // تحديث هنا للتعامل مع الهيكل الجديد للاستجابة
      setOrderProducts(data.products || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching order products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // تحديث حالة المنتجات في الطلب
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true);
      const token = getAuthToken();

      const response = await fetch(
        `${API_BASE}/orders/${orderId}/update-my-products?newStatus=${newStatus}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating status: ${response.status}`);
      }

      // تحديث البيانات بعد النجاح
      await fetchOrders();
      if (selectedOrder) {
        await fetchOrderProducts(selectedOrder.orderId);
      }

      alert("Status updated successfully!");
    } catch (err) {
      setError(err.message);
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    await fetchOrderProducts(order.orderId);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-[#800000] text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-[#800000] text-center mb-8">
        Orders Received
      </h1>

      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {["All", "Pending", "Shipped", "Delivered", "Cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => fetchOrders(status)}
              className="px-4 py-2 bg-[#800000] text-white rounded-full hover:bg-[#600000] transition"
            >
              {status}
            </button>
          )
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <FaBoxOpen className="text-[#800000] text-7xl mb-4" />
          <p className="text-[#800000] font-semibold text-lg">
            No orders received yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-center text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-gray-500 font-semibold">
                  Order ID
                </th>
                <th className="py-3 px-4 text-gray-500 font-semibold">
                  Customer Name
                </th>
                <th className="py-3 px-4 text-gray-500 font-semibold">
                  Total Price
                </th>
                <th className="py-3 px-4 text-gray-500 font-semibold">
                  Address
                </th>
                <th className="py-3 px-4 text-gray-500 font-semibold">
                  Status
                </th>
                <th className="py-3 px-4 text-gray-500 font-semibold">Date</th>
                <th className="py-3 px-4 text-gray-500 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-gray-50 transition border-b"
                >
                  <td className="py-3 px-4 font-medium">#{order.orderId}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">${order.totalPrice}</td>
                  <td className="py-3 px-4 max-w-xs truncate">
                    {order.address}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{order.date}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-[#800000] hover:text-[#600000] transition"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#800000]">
                Order Details - #{selectedOrder.orderId}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <p>
                <strong>Customer:</strong> {selectedOrder.customerName}
              </p>
              <p>
                <strong>Total:</strong> ${selectedOrder.totalPrice}
              </p>
              <p>
                <strong>Address:</strong> {selectedOrder.address}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </p>
            </div>

            <h3 className="text-lg font-semibold mb-3">
              Products in this order:
            </h3>

            {loadingProducts ? (
              <div className="flex justify-center py-4">
                <FaSpinner className="animate-spin text-[#800000] text-2xl" />
              </div>
            ) : (
              <div className="space-y-4">
                {orderProducts.map((product) => (
                  <div
                    key={product.productId}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex gap-4 mb-3">
                      {/* صورة المنتج */}
                      {product.image && product.image.length > 0 && (
                        <div className="flex-shrink-0">
                          <img
                            src={product.image[0]}
                            alt={product.productName}
                            className="w-20 h-20 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* تفاصيل المنتج */}
                      <div className="flex-grow">
                        <h4 className="font-medium text-lg">
                          {product.productName}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">
                          Product ID: {product.productId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {product.quantity} × ${product.unitPrice}
                        </p>
                        <p className="text-sm font-medium text-[#800000]">
                          Total: $
                          {(product.quantity * product.unitPrice).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* أزرار تحديث الحالة */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() =>
                          updateOrderStatus(selectedOrder.orderId, 0)
                        } // Pending
                        disabled={updatingStatus}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50 transition"
                      >
                        Pending
                      </button>
                      <button
                        onClick={() =>
                          updateOrderStatus(selectedOrder.orderId, 1)
                        } // Shipped
                        disabled={updatingStatus}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 transition"
                      >
                        Shipped
                      </button>
                      <button
                        onClick={() =>
                          updateOrderStatus(selectedOrder.orderId, 3)
                        } // Cancelled
                        disabled={updatingStatus}
                        className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 transition"
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {updatingStatus && (
              <div className="mt-4 text-center">
                <FaSpinner className="animate-spin text-[#800000] mx-auto" />
                <p className="text-sm text-gray-600 mt-2">Updating status...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderReceived;
