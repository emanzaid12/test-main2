import React, { useEffect, useState } from "react";
import { FaBoxOpen } from "react-icons/fa";

const OrderReceived = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const sampleOrders = [
        {
          id: "1",
          customerName: "John Doe",
          productName: "Product A",
          orderDate: "2025-05-01",
          quantity: 2,
          shippingInfo: "123 Main St, City, Country"
        },
        {
          id: "2",
          customerName: "Jane Smith",
          productName: "Product B",
          orderDate: "2025-04-25",
          quantity: 1,
          shippingInfo: "456 Elm St, City, Country"
        }
      ];
      
      localStorage.setItem("orders", JSON.stringify(sampleOrders));
      
    const stored = localStorage.getItem("orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-[#800000] text-center mb-8">
        Orders Received
      </h1>

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
              <tr className="bg-white">
                <th className="py-3 px-4 text-gray-500 font-semibold">ID</th>
                <th className="py-3 px-4 text-gray-500 font-semibold">Customer Name</th>
                <th className="py-3 px-4 text-gray-500 font-semibold">Product Name</th>
                <th className="py-3 px-4 text-gray-500 font-semibold">Order Date</th>
                <th className="py-3 px-4 text-gray-500 font-semibold">Quantity</th>
                <th className="py-3 px-4 text-gray-500 font-semibold">Shipping Info</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.customerName}</td>
                  <td className="py-3 px-4">{order.productName}</td>
                  <td className="py-3 px-4">{order.orderDate}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4">{order.shippingInfo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderReceived;
