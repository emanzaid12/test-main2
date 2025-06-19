import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrders, markAsDelivered } from "../../redux/ordersSlice";

const ManageOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.list);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map(order => ({
        ...order,
        status: order.status || "Pending",
      }));
      dispatch(setOrders(parsedOrders));
    }
  }, [dispatch]);

  const handleMarkAsDelivered = (orderId) => {
    dispatch(markAsDelivered(orderId));
    setToastMessage("Order has been marked as delivered");
    setTimeout(() => setToastMessage(""), 2000);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "All" ? true : order.status === filterStatus;
    const matchesSearch = order.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // ✅ دمج الطلبات بنفس الاسم ونفس ID بدون تكرار المنتجات
  const groupedOrders = [];

  filteredOrders.forEach((order) => {
    const existingIndex = groupedOrders.findIndex(
      (o) => o.fullName === order.fullName && o.id === order.id
    );

    if (existingIndex !== -1) {
      // ❌ لا ندمج القديم + الجديد — نستبدلهم
      groupedOrders[existingIndex].products = [...order.products];
      groupedOrders[existingIndex].totalAmount = order.totalAmount;
      groupedOrders[existingIndex].paymentMethod = order.paymentMethod;
      groupedOrders[existingIndex].orderDate = order.orderDate;
    } else {
      groupedOrders.push({ ...order, products: [...order.products] });
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

      <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-100 p-4 rounded">
        <input
          type="text"
          placeholder="Search by name"
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
          <option value="Pending">Pending</option>
        </select>
      </div>

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
                <td className="px-4 py-3 border">O{String(order.id).slice(-3)}</td>
                <td className="px-4 py-3 border space-y-2">
                  {order.products?.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <div className="text-left">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-gray-500">Qty: {p.quantity}</p>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3 border">{order.fullName || "-"}</td>
                <td className="px-4 py-3 border">{order.city || "-"}</td>
                <td className="px-4 py-3 border">{order.phone || "-"}</td>
                <td className="px-4 py-3 border">${order.totalAmount}</td>
                <td className="px-4 py-3 border">{order.paymentMethod || "-"}</td>
                <td className="px-4 py-3 border">{order.orderDate || "-"}</td>
                <td className="px-4 py-3 border">{order.status}</td>
                <td className="px-4 py-3 border">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleMarkAsDelivered(order.id)}
                      className="bg-[#7a0d0d] text-white text-sm px-2 py-1 rounded-full hover:bg-red-800"
                    >
                      Mark As Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {groupedOrders.length === 0 && (
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
