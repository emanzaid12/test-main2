import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaStar,
  FaUsers,
  FaChartLine,
  FaEnvelope,
  FaArrowUp,
  FaArrowDown,
  FaMoneyBillWave,
  FaChartBar,
  FaStore,
  FaUserPlus,
  FaCogs,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("daily");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [report, setReport] = useState(null);
  const [activeUsersData, setActiveUsersData] = useState(null);
  const [newOrdersData, setNewOrdersData] = useState(null);
  const [discountData, setDiscountData] = useState(null);
  const [revenueData, setRevenueData] = useState([]);

  const token = localStorage.getItem("authToken");

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  // ========== Total Sales ==========
  useEffect(() => {
    if (fromDate && toDate) {
      fetch(
        `https://shopyapi.runasp.net/api/discount-settings/admin/order-total-report-range?from=${formatDate(
          fromDate
        )}&to=${formatDate(toDate)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setReport(data))
        .catch((err) => console.error("Fetch Total Sales Range Error:", err));
    } else {
      fetch(
        `https://shopyapi.runasp.net/api/discount-settings/admin/order-total-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setReport(data[filter]))
        .catch((err) => console.error("Fetch Total Sales Filter Error:", err));
    }
  }, [filter, fromDate, toDate, token]);

  // ========== Active Users ==========
  useEffect(() => {
    if (fromDate && toDate) {
      fetch(
        `https://shopyapi.runasp.net/api/ActiveUsers/custom-active-users?fromDate=${formatDate(
          fromDate
        )}&toDate=${formatDate(toDate)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setActiveUsersData(data))
        .catch((err) => console.error("Fetch Active Users Range Error:", err));
    } else {
      fetch(`https://shopyapi.runasp.net/api/ActiveUsers/active-users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => setActiveUsersData(data[filter]))
        .catch((err) => console.error("Fetch Active Users Filter Error:", err));
    }
  }, [filter, fromDate, toDate, token]);

  // ========== New Orders ==========
  useEffect(() => {
    if (fromDate && toDate) {
      fetch(
        `https://shopyapi.runasp.net/api/discount-settings/admin/custom-orders-comparison?startDate=${formatDate(
          fromDate
        )}&endDate=${formatDate(toDate)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const mapped = {
            ordersCount: data?.ordersCount ?? 0,
            difference: data?.difference ?? 0,
          };
          setNewOrdersData(mapped);
        })
        .catch((err) => console.error("Fetch New Orders Range Error:", err));
    } else {
      fetch(
        `https://shopyapi.runasp.net/api/discount-settings/admin/all-periods-comparison`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const item = data.find((p) => p.period.type === filter);
          const mapped = {
            ordersCount: item?.orders?.current ?? 0,
            difference: item?.comparison?.difference ?? 0,
          };
          setNewOrdersData(mapped);
        })
        .catch((err) => console.error("Fetch New Orders Filter Error:", err));
    }
  }, [filter, fromDate, toDate, token]);

  // ========== Discounts ==========
  useEffect(() => {
    if (fromDate && toDate) {
      fetch(
        `https://shopyapi.runasp.net/api/discount-settings/admin/custom-earnings-report?startDate=${formatDate(
          fromDate
        )}&endDate=${formatDate(toDate)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => setDiscountData(data))
        .catch((err) => console.error("Fetch Discounts Range Error:", err));
    } else {
      fetch(
        `https://shopyapi.runasp.net/api/discount-settings/admin/platform-earnings-report`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const item = data.find((p) => p.period.type === filter);
          setDiscountData({
            totalLoyaltyAndFirstOrderDiscounts: item?.discounts?.total ?? 0,
            difference: item?.discounts?.totalDifference ?? 0,
          });
        })
        .catch((err) => console.error("Fetch Discounts Filter Error:", err));
    }
  }, [filter, fromDate, toDate, token]);

  // ========== Revenue Chart ==========
  useEffect(() => {
    const urlWithDate = `https://shopyapi.runasp.net/api/Analytics/platform-revenue-range?startDate=${formatDate(
      fromDate
    )}&endDate=${formatDate(toDate)}`;
    const urlWithoutDate =
      "https://shopyapi.runasp.net/api/Analytics/platform-revenue";
    const finalURL = fromDate && toDate ? urlWithDate : urlWithoutDate;

    fetch(finalURL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const actualData = fromDate && toDate ? data : data[filter] || [];
        setRevenueData(actualData);
      })
      .catch((err) => console.error("Fetch platform-revenue error:", err));
  }, [filter, fromDate, toDate, token]);

  const chartData = {
    labels: revenueData.map((item) => item.label),
    datasets: [
      {
        label: "Platform Profit",
        data: revenueData.map((item) => item.platformProfit),
        backgroundColor: "#7c0a02",
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const totalSalesValue = report?.finalAmountAfterDiscounts ?? 0;
  const totalSalesDifference = report?.finalDifference ?? 0;
  const salesPositive = totalSalesDifference >= 0;

  const activeUsersCount = activeUsersData?.count ?? 0;
  const activeUsersDiff = activeUsersData?.difference ?? 0;
  const activeUsersPositive = activeUsersDiff >= 0;

  const newOrdersCount = newOrdersData?.ordersCount ?? 0;
  const newOrdersDiff = newOrdersData?.difference ?? 0;
  const ordersPositive = newOrdersDiff >= 0;

  const discountTotal = discountData?.totalLoyaltyAndFirstOrderDiscounts ?? 0;
  const discountDifference = discountData?.difference ?? 0;
  const discountPositive = discountDifference >= 0;

  const stats = [
    {
      icon: <FaChartLine className="text-red-800 text-2xl" />,
      value: totalSalesValue,
      label: "Total Sales",
      prefix: "$",
      percentage: totalSalesDifference.toFixed(2),
      changeType: salesPositive ? "up" : "down",
    },
    {
      icon: <FaUsers className="text-red-800 text-2xl" />,
      value: activeUsersCount,
      label: "Active Users",
      percentage: activeUsersDiff.toFixed(2),
      changeType: activeUsersPositive ? "up" : "down",
    },
    {
      icon: <FaShoppingCart className="text-red-800 text-2xl" />,
      value: newOrdersCount,
      label: "New Orders",
      percentage: newOrdersDiff.toFixed(2),
      changeType: ordersPositive ? "up" : "down",
    },
    {
      icon: <FaMoneyBillWave className="text-red-800 text-2xl" />,
      value: discountTotal,
      label: "Total Loyalty + First Order Discounts",
      suffix: "$",
      percentage: discountDifference.toFixed(2),
      changeType: discountPositive ? "up" : "down",
    },
    
  ];

  // Updated navigation items with new additions
  const navigationItems = [
    {
      icon: <FaBoxOpen />,
      title: "Manage Products",
      subtitle: "Upload and manage your items",
      route: "/admin/products",
    },
    {
      icon: <FaShoppingCart />,
      title: "Manage Orders",
      subtitle: "Track incoming orders",
      route: "/admin/orders",
    },
    {
      icon: <FaUsers />,
      title: "Manage Sellers",
      subtitle: "View and manage sellers",
      route: "/admin/sellers",
    },
    {
      icon: <FaChartBar />,
      title: "Sellers Reports",
      subtitle: "View total sales and profits per store",
      route: "/admin/sellers-reports",
    },
    {
      icon: <FaEnvelope />,
      title: "Messages",
      subtitle: "Check messages from customers",
      route: "/admin/messages",
    },
    {
      icon: <FaStore />,
      title: "Store Update Requests",
      subtitle: "Review and manage store update requests",
      route: "/admin/store-requests",
    },
    {
      icon: <FaUserPlus />,
      title: "Add New Admin",
      subtitle: "Create new administrator accounts",
      route: "/admin/add-admin",
    },
    {
  icon: <FaUsers />,
  title: "All Admins",
  subtitle: "View and manage admin accounts",
  route: "/admin/all-admins",
},
{
  icon: <FaCogs />,
  title: "Platform Settings",
  subtitle: "Manage platform-wide configurations",
  route: "/admin/platform-settings",
},

  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-red-800 text-white p-6">
        <div className="space-y-6">
          {navigationItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => navigate(item.route)}
              className="cursor-pointer hover:bg-red-700 p-2 rounded transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-lg font-semibold text-white">
                  {item.title}
                </span>
              </div>
              <p className="text-sm text-gray-300 ml-8">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8">
        {/* Filters */}
        <div className="flex justify-center mb-6">
          <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded shadow">
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-800"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <label htmlFor="from" className="text-sm text-gray-600">
                From:
              </label>
              <input
                type="date"
                id="from"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="to" className="text-sm text-gray-600">
                To:
              </label>
              <input
                type="date"
                id="to"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded shadow text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl font-semibold text-red-800 flex items-center gap-2 mb-2">
                  {stat.icon}
                  <CountUp
                    end={stat.value}
                    duration={2}
                    prefix={stat.prefix || ""}
                    suffix={stat.suffix || ""}
                    separator=","
                    decimals={stat.prefix || stat.suffix ? 2 : 0}
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  {stat.label}
                </p>
                <div
                  className={`flex items-center justify-center text-sm font-medium mt-1 ${
                    stat.changeType === "down" ? "text-red-400" : "text-red-800"
                  }`}
                >
                  {stat.changeType === "up" ? (
                    <FaArrowUp className="mr-1" />
                  ) : (
                    <FaArrowDown className="mr-1" />
                  )}
                  {stat.percentage}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Revenue</h3>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                y: { grid: { display: false } },
                x: { grid: { display: false } },
              },
              animation: {
                duration: 1500,
                easing: "easeOutQuart",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
