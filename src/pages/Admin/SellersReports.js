import React, { useEffect, useState } from "react";

const dummyReports = [
  {
    id: 1,
    storeName: "TechZone",
    totalSales: 12000,
    profit: 3000,
    orders: 85,
    discounts: 500,
    status: "Unblocked",
  },
  {
    id: 2,
    storeName: "BeautyWorld",
    totalSales: 8500,
    profit: 2200,
    orders: 60,
    discounts: 300,
    status: "Blocked",
  },
  {
    id: 3,
    storeName: "Fashionista",
    totalSales: 15300,
    profit: 4100,
    orders: 110,
    discounts: 720,
    status: "Unblocked",
  },
];

const SellerReports = () => {
  const [reports, setReports] = useState([]);
  const [filterType, setFilterType] = useState("daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    localStorage.setItem("sellerReports", JSON.stringify(dummyReports));
    const stored = JSON.parse(localStorage.getItem("sellerReports")) || [];
    setReports(stored);
  }, []);

  const toggleStatus = (id) => {
    const updated = reports.map((store) =>
      store.id === id
        ? {
            ...store,
            status: store.status === "Blocked" ? "Unblocked" : "Blocked",
          }
        : store
    );
    setReports(updated);
    localStorage.setItem("sellerReports", JSON.stringify(updated));
  };

  const fetchReport = async () => {
    try {
      let salesUrl = "";
      let profitUrl = "";

      if (fromDate && toDate) {
        const format = (dateStr) => {
          const [year, month, day] = dateStr.split("-");
          return `${month}/${day}/${year}`;
        };
        const formattedFrom = format(fromDate);
        const formattedTo = format(toDate);
        salesUrl = `https://shopyapi.runasp.net/api/platform-fees/stores/custom?startDate=${formattedFrom}&endDate=${formattedTo}`;
        profitUrl = `https://shopyapi.runasp.net/api/platform-fees/allStores/custom?startDate=${formattedFrom}&endDate=${formattedTo}`;
      } else {
        switch (filterType) {
          case "daily":
            salesUrl = "https://shopyapi.runasp.net/api/platform-fees/stores/daily";
            profitUrl = "https://shopyapi.runasp.net/api/platform-fees/allStores/daily";
            break;
          case "weekly":
            salesUrl = "https://shopyapi.runasp.net/api/platform-fees/stores/weekly";
            profitUrl = "https://shopyapi.runasp.net/api/platform-fees/allStores/weekly";
            break;
          case "monthly":
            salesUrl = "https://shopyapi.runasp.net/api/platform-fees/stores/monthly";
            profitUrl = "https://shopyapi.runasp.net/api/platform-fees/allStores/monthly";
            break;
          case "yearly":
            salesUrl = "https://shopyapi.runasp.net/api/platform-fees/stores/yearly";
            profitUrl = "https://shopyapi.runasp.net/api/platform-fees/allStores/yearly";
            break;
          default:
            break;
        }
      }

      const token = localStorage.getItem("authToken");

      const [salesRes, profitRes] = await Promise.all([
        fetch(salesUrl, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(profitUrl, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const salesData = await salesRes.json();
      const profitData = await profitRes.json();

      const profitMap = {};
      (profitData.allStores || []).forEach((item) => {
        profitMap[item.storeId] = item.totalFees;
      });

      const mapped = (salesData || []).map((item) => ({
        id: item.storeId,
        storeName: item.storeName,
        totalSales: item.statistics?.totalSalesAfterPersonalDiscountOnly ?? 0,
        profit: profitMap[item.storeId] ?? 0,
        orders: item.statistics?.numberOfOrders ?? 0,
        discounts: item.statistics?.totalPersonalDiscount ?? 0,
        status: "Unblocked",
      }));

      setReports(mapped);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center text-[#7a0d0d] mb-4">
        Sellers Reports
      </h2>

      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded shadow">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
            />
          </div>

          <button
            onClick={fetchReport}
            className="bg-red-800 text-white px-5 py-2 rounded-full hover:bg-red-700 transition"
          >
            View Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-100 text-[#7a0d0d] text-sm font-semibold">
              <th className="px-4 py-3 border">Store ID</th>
              <th className="px-4 py-3 border">Store Name</th>
              <th className="px-4 py-3 border">Total Sales</th>
              <th className="px-4 py-3 border">Profit</th>
              <th className="px-4 py-3 border">Orders</th>
              <th className="px-4 py-3 border">Total Personal Discounts</th>
              <th className="px-4 py-3 border">Status</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((store) => (
              <tr key={store.id} className="text-sm text-gray-700">
                <td className="px-4 py-3 border align-middle">{store.id}</td>
                <td className="px-4 py-3 border align-middle">{store.storeName}</td>
                <td className="px-4 py-3 border align-middle">
                  ${store.totalSales.toLocaleString()}
                </td>
                <td className="px-4 py-3 border align-middle">
                  ${store.profit.toLocaleString()}
                </td>
                <td className="px-4 py-3 border align-middle">{store.orders}</td>
                <td className="px-4 py-3 border align-middle">
                  ${store.discounts.toLocaleString()}
                </td>
                <td className="px-4 py-3 border align-middle">{store.status}</td>
                <td className="px-4 py-3 border align-middle">
                  <button
                    onClick={() => toggleStatus(store.id)}
                    className={`px-4 py-1 rounded-full text-white text-sm ${
                      store.status === "Blocked"
                        ? "bg-red-800 hover:bg-red-700"
                        : "bg-red-800 hover:bg-red-700"
                    } transition`}
                  >
                    {store.status === "Blocked" ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  className="px-4 py-6 text-gray-500 text-center text-sm"
                >
                  No reports available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerReports;