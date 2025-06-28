import React, { useEffect, useState } from "react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Admin/orders/overview/details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      let filtered = [];
      if (filterStatus === "All") filtered = data.all;
      else if (filterStatus === "Delivered") filtered = data.delivered;
      else if (filterStatus === "Pending") filtered = data.pending;
      else if (filterStatus === "Shipped") filtered = data.shipped;

      const mapped = filtered.map((order) => {
        const totalQuantity = order.products?.reduce(
          (sum, p) => sum + (p.quantity || 0),
          0
        );

        return {
          id: order.orderId,
          status: order.status,
          orderDate: order.createdAt,
          fullName: order.customer?.fullName,
          phone: order.customer?.phone,
          city: order.customer?.address,
          totalAmount: totalQuantity || 0, // ✅ ربط بـ quantity
          products: order.products || [],
        };
      });

      setOrders(mapped);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const filteredOrders = orders.filter((order) =>
    String(order.id).includes(searchQuery)
  );

  return (
    <div className="p-8 relative">
      <h2 className="text-2xl font-semibold text-center text-[#7a0d0d] mb-6">
        Manage Orders
      </h2>

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
          <option value="Delivered">Delivered</option>
          <option value="Shipped">Shipped</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100 text-[#7a0d0d] text-sm font-semibold">
              <th className="px-4 py-3 border">Order ID</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Order Date</th>
              <th className="px-4 py-3 border">Full Name</th>
              <th className="px-4 py-3 border">Phone</th>
              <th className="px-4 py-3 border">City</th>
              <th className="px-4 py-3 border">Product Name</th>
              <th className="px-4 py-3 border">Total Quantity</th>
              <th className="px-4 py-3 border">Product Image</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="text-sm text-gray-700 align-top">
                <td className="px-4 py-3 border">O{String(order.id).slice(-3)}</td>
                <td className="px-4 py-3 border">{order.status}</td>
                <td className="px-4 py-3 border">{order.orderDate}</td>
                <td className="px-4 py-3 border">{order.fullName}</td>
                <td className="px-4 py-3 border">{order.phone}</td>
                <td className="px-4 py-3 border">{order.city}</td>
                <td className="px-4 py-3 border text-left">
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.name} (Qty: {p.quantity})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 border">{order.totalAmount}</td>
                <td className="px-4 py-3 border">
                  <div className="flex flex-wrap gap-1 justify-center max-w-[120px] overflow-auto">
                    {order.products.map((p, i) => (
                      <img
                        key={i}
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td
                  colSpan="9"
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