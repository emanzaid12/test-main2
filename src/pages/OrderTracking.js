import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaClock,
  FaCheckCircle,
  FaCog,
  FaTruck,
  FaBoxOpen,
  FaTimesCircle,
  FaClipboardList,
} from "react-icons/fa";

const OrderTracking = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialOrderId = location.state?.orderId || orderId || "";
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [orderDetails, setOrderDetails] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderDetails(initialOrderId);
    } else {
      setLoading(false);
    }
  }, [initialOrderId]);

  const fetchOrderDetails = async (id) => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const detailsResponse = await fetch(
        `https://shopyapi.runasp.net/api/Order/order-details/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (detailsResponse.ok) {
        const details = await detailsResponse.json();
        setOrderDetails(details);

        const trackingResponse = await fetch(
          `https://shopyapi.runasp.net/api/Order/track-order/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (trackingResponse.ok) {
          const tracking = await trackingResponse.json();
          setTrackingData(tracking);
        }
      } else {
        const errorData = await detailsResponse.json();
        setError(errorData.message || "Order not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to fetch order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-red-800 bg-red-50";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-purple-600 bg-purple-100";
      case "shipped":
        return "text-indigo-600 bg-indigo-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    const color = "text-red-800";
    switch (status?.toLowerCase()) {
      case "pending":
        return <FaClock className={color} />;
      case "confirmed":
        return <FaCheckCircle className={color} />;
      case "processing":
        return <FaCog className={color} />;
      case "shipped":
        return <FaTruck className={color} />;
      case "delivered":
        return <FaBoxOpen className={color} />;
      case "cancelled":
        return <FaTimesCircle className={color} />;
      default:
        return <FaClipboardList className={color} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Order Tracking
        </h1>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {orderDetails && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">
                Order #{orderDetails.orderId}
              </h2>
              <div className="space-y-4">

  {/* Order Date */}
  <div>
    <p className="text-gray-600">Order Date:</p>
    <p className="font-semibold">
      {new Date(orderDetails.createdAt).toLocaleDateString()}
    </p>
  </div>

  {/* Total Amount + Status */}
  <div>
    <p className="text-gray-600">Total Amount:</p>
    <p className="font-semibold text-lg mb-2">
      ${orderDetails.totalPrice?.toFixed(2)}
    </p>

    {/* Status تحت Total Amount */}
    <div>
      <p className="text-gray-600 ml-2">Status:</p>
      <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-800">
        {orderDetails.status}
      </span>
    </div>
  </div>

  {/* Promo Code */}
  {orderDetails.appliedPromoCode && (
    <div>
      <p className="text-gray-600">Promo Code:</p>
      <p className="font-semibold">{orderDetails.appliedPromoCode}</p>
    </div>
  )}
</div>
</div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderDetails.products?.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    {product.images?.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.productName}</h4>
                      <p className="text-gray-600">
                        Quantity: {product.quantity}
                      </p>
                      <p className="text-gray-600">
                        Price: ${product.originalPrice?.toFixed(2)}
                        {product.finalPrice !== product.originalPrice && (
                          <span className="ml-2 text-green-600">
                            Final: ${product.finalPrice?.toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        ${product.subtotal?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {trackingData && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {trackingData.trackingHistory?.map((entry, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getStatusColor(
                          entry.status
                        )}`}
                      >
                        {getStatusIcon(entry.status)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold capitalize">
                          {entry.status}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {entry.changedAt}
                        </p>
                      </div>
                    </div>
                  ))}

                  {trackingData.trackingHistory?.length === 0 && (
                    <p className="text-gray-600 text-center py-4">
                      No tracking history available yet.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="bg-red-50 text-red-800 px-6 py-2 rounded-full hover:bg-red-700 hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
              >
                Refresh Status
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
