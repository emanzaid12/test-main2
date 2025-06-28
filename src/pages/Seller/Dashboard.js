import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaBoxOpen,
  FaClipboardCheck,
  FaEnvelope,
  FaBullhorn,
  FaStar,
  FaCogs,
  FaUserCog,
  FaGlobe,
  FaQuestionCircle,
  FaLock,
  FaFileContract,
  FaLifeRing,
  FaSignOutAlt,
  FaDollarSign,
  FaShoppingBag,
  FaClock,
  FaUsers,
  FaBell,
  FaPercentage,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion } from "framer-motion";

// الصفحات الفرعية - تأكد من وجود هذه الملفات
import AddYourProducts from "./AddYourProducts";
import MyProducts from "./MyProducts";
import OrderReceived from "./OrderReceived";

import Reviews from "./Reviews";
import BrandSettings from "./BrandSettings";
import MyDiscount from "./My Discount";

// تسجيل جميع مكونات Chart.js المطلوبة
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const sidebarItems = [
  {
    to: "/dashboard/add-products",
    icon: <FaPlus />,
    label: "Add Your Products",
    sub: "Add items to your store",
  },
  {
    to: "/dashboard/my-products",
    icon: <FaBoxOpen />,
    label: "My Products",
    sub: "Manage your uploaded items",
  },
  {
    to: "/dashboard/orders",
    icon: <FaClipboardCheck />,
    label: "Order Received",
    sub: "View your received orders",
  },
 
  {
    to: "/seller-myDiscount",
    icon: <FaPercentage />,
    label: "My Discount",
    sub: "Manage customer discounts",
  },
  {
    to: "/dashboard/coupon-page",
    icon: <FaBullhorn />,
    label: "Buyers Page",
    sub: "Boost your product visibility",
  },
  {
    to: "/dashboard/reviews",
    icon: <FaStar />,
    label: "Reviews",
    sub: "Read customer feedback",
  },
  {
    to: "/dashboard/brand-settings",
    icon: <FaCogs />,
    label: "Brand Settings",
    sub: "Configure your store",
  },
  {
    to: "/dashboard/account-settings-page",
    icon: <FaUserCog />,
    label: "Account Information",
    sub: "Manage your profile",
  },
  {
    to: "/dashboard/language-settings-page",
    icon: <FaGlobe />,
    label: "Language & Appearance",
    sub: "Change language and theme",
  },
  {
    to: "/dashboard/faq-page",
    icon: <FaQuestionCircle />,
    label: "FAQ",
    sub: "Frequently asked questions",
  },
  {
    to: "/dashboard/privacy-policy-page",
    icon: <FaLock />,
    label: "Privacy Policy",
    sub: "Understand your data rights",
  },
  {
    to: "/dashboard/terms-page",
    icon: <FaFileContract />,
    label: "Terms & Conditions",
    sub: "Review our terms of service",
  },
  {
    to: "/dashboard/help-page",
    icon: <FaLifeRing />,
    label: "Help Center",
    sub: "Need support? We're here!",
  },
  {
    to: "/dashboard/notifications",
    icon: <FaBell />,
    label: "Notifications",
    sub: "Alerts and updates from your store",
  },
];

const Dashboard = () => {
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("daily");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);

  // States for API data
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [salesOverviewData, setSalesOverviewData] = useState([]);
  const [salesOverviewTotal, setSalesOverviewTotal] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  // API Base URL
  const API_BASE = "https://shopyapi.runasp.net/api";

  // Helper function to get auth token
  const getAuthToken = () => {
    return localStorage.getItem("authToken");
  };

  // Helper function to calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? "+100%" : "0%";
    const change = ((current - previous) / previous) * 100;
    return change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
  };

  // Fetch store statistics based on filter
  const fetchStoreStats = async () => {
    try {
      const token = getAuthToken();
      let statsUrl = "";
      let visitorsUrl = "";

      switch (filter) {
        case "daily":
          statsUrl = `${API_BASE}/StoreStats/myStore/daily`;
          visitorsUrl = `${API_BASE}/StoreStats/dashboard/visitors/today`;
          break;
        case "weekly":
          statsUrl = `${API_BASE}/StoreStats/myStore/weekly`;
          visitorsUrl = `${API_BASE}/StoreStats/dashboard/visitors/current-week`;
          break;
        case "monthly":
          statsUrl = `${API_BASE}/StoreStats/myStore/monthly`;
          visitorsUrl = `${API_BASE}/StoreStats/dashboard/visitors/current-month`;
          break;
        case "custom":
          if (customStartDate && customEndDate) {
            statsUrl = `${API_BASE}/StoreStats/myStore/custom?startDate=${customStartDate}&endDate=${customEndDate}`;
            visitorsUrl = `${API_BASE}/StoreStats/dashboard/visitors/range?startDate=${customStartDate}&endDate=${customEndDate}`;
          }
          break;
      }

      if (!statsUrl) return;

      const [statsResponse, visitorsResponse] = await Promise.all([
        fetch(statsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
        fetch(visitorsUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }),
      ]);

      const statsData = await statsResponse.json();
      const visitorsData = await visitorsResponse.json();

      if (statsData.success) {
        const statistics = statsData.statistics;
        const visitors = visitorsData.visitors || 0;

        const newStats = [
          {
            icon: <FaDollarSign className="text-red-800 text-2xl" />,
            value: statistics.sales.beforeDiscount.current,
            label: "Sales Before Discount",
            change: calculatePercentageChange(
              statistics.sales.beforeDiscount.current,
              statistics.sales.beforeDiscount.previous
            ),
            changeColor:
              statistics.sales.beforeDiscount.difference >= 0
                ? "text-green-600"
                : "text-red-400",
            prefix: "$",
          },
          {
            icon: <FaShoppingBag className="text-red-800 text-2xl" />,
            value: statistics.orders.current,
            label: "Total Orders",
            change: calculatePercentageChange(
              statistics.orders.current,
              statistics.orders.previous
            ),
            changeColor:
              statistics.orders.difference >= 0
                ? "text-green-600"
                : "text-red-400",
            prefix: "",
          },
          {
            icon: <FaClock className="text-red-800 text-2xl" />,
            value: statistics.sales.afterPersonalDiscount.current,
            label: "Sales After Discount",
            change: calculatePercentageChange(
              statistics.sales.afterPersonalDiscount.current,
              statistics.sales.afterPersonalDiscount.previous
            ),
            changeColor:
              statistics.sales.afterPersonalDiscount.difference >= 0
                ? "text-green-600"
                : "text-red-400",
            prefix: "$",
          },
          {
            icon: <FaUsers className="text-red-800 text-2xl" />,
            value: visitors,
            label: "Visitors",
            change: "+0%", // API doesn't provide previous visitors count
            changeColor: "text-gray-400",
            prefix: "",
          },
          {
            icon: <FaPercentage className="text-red-800 text-2xl" />,
            value: statistics.discounts.personal.current,
            label: "Personal Discounts",
            change: calculatePercentageChange(
              statistics.discounts.personal.current,
              statistics.discounts.personal.previous
            ),
            changeColor:
              statistics.discounts.personal.difference >= 0
                ? "text-green-600"
                : "text-red-400",
            prefix: "$",
          },
          {
            icon: <FaDollarSign className="text-red-800 text-2xl" />,
            value: statistics.revenue.net.current,
            label: "Net Revenue",
            change: calculatePercentageChange(
              statistics.revenue.net.current,
              statistics.revenue.net.previous
            ),
            changeColor:
              statistics.revenue.net.difference >= 0
                ? "text-green-600"
                : "text-red-400",
            prefix: "$",
          },
        ];

        setStats(newStats);
      }
    } catch (error) {
      console.error("Error fetching store stats:", error);
    }
  };

  // Fetch weekly overview chart data
  const fetchWeeklyOverview = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE}/SellerOrders/dashboard/weekly-overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // Map the data to match the chart format
      const mappedData = data.map((item) => ({
        date: item.date,
        order: item.salesAfterDiscount, // Using sales after discount as order value
        sales: item.totalBeforeDiscount,
      }));

      setChartData(mappedData);
    } catch (error) {
      console.error("Error fetching weekly overview:", error);
    }
  };

  // Fetch order summary
  const fetchOrderSummary = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE}/SellerOrders/dashboard/order-summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      setOrderStats(data);
    } catch (error) {
      console.error("Error fetching order summary:", error);
    }
  };

  // Fetch sales overview
  const fetchSalesOverview = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `${API_BASE}/StoreStats/dashboard/sales-overview`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = await response.json();
      setSalesOverviewData(responseData.data);
      setSalesOverviewTotal({
        totalSales: responseData.totalSales,
        totalRevenue: responseData.totalRevenue,
        changePercentage: responseData.changePercentage,
        profitMargin: responseData.profitMargin,
      });
    } catch (error) {
      console.error("Error fetching sales overview:", error);
    }
  };

  // Load all data
  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStoreStats(),
      fetchWeeklyOverview(),
      fetchOrderSummary(),
      fetchSalesOverview(),
    ]);
    setLoading(false);
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "custom") {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      // Load data immediately for non-custom filters
      setTimeout(() => {
        loadDashboardData();
      }, 100);
    }
  };

  // Handle custom date range apply
  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      loadDashboardData();
    }
  };

  // دالة تسجيل الخروج محسّنة
  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      navigate("/", { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowChart(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // محتوى الصفحة بناءً على المسار
  const renderContent = () => {
    switch (location.pathname) {
      case "/dashboard/add-products":
        return <AddYourProducts />;
      case "/dashboard/my-products":
        return <MyProducts />;
      case "/dashboard/orders":
        return <OrderReceived />;
      
      case "/seller-myDiscount":
        return <MyDiscount />;
      case "/dashboard/reviews":
        return <Reviews />;
      case "/dashboard/brand-settings":
        return <BrandSettings />;
      default:
        return (
          <>
            {/* Filter Section */}
            <div className="mb-6 bg-white p-4 rounded-xl shadow">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <FaFilter className="text-red-800" />
                  <span className="font-medium text-gray-700">Filter by:</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {["daily", "weekly", "monthly", "custom"].map(
                    (filterOption) => (
                      <button
                        key={filterOption}
                        onClick={() => handleFilterChange(filterOption)}
                        className={`px-4 py-2 rounded-full capitalize transition-colors ${
                          filter === filterOption
                            ? "bg-red-800 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {filterOption}
                      </button>
                    )
                  )}
                </div>

                {showCustomRange && (
                  <div className="flex items-center gap-2 ml-4">
                    <input
  type="date"
  value={customStartDate}
  onChange={(e) => setCustomStartDate(e.target.value)}
  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
/>
<span className="text-gray-500">to</span>
<input
  type="date"
  value={customEndDate}
  onChange={(e) => setCustomEndDate(e.target.value)}
  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-red-800"
/>

                    <button
                      onClick={handleCustomDateApply}
                      disabled={!customStartDate || !customEndDate}
                      className="px-4 py-2 bg-red-800 text-white rounded-full disabled hover:bg-red-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-800"></div>
              </div>
            ) : (
              <>
                {/* Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="bg-white p-5 rounded-xl shadow flex flex-col items-start space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-2">
                        {stat.icon}
                        <div className="text-2xl font-semibold text-red-800">
                          <CountUp
                            end={stat.value}
                            duration={2}
                            separator=","
                            prefix={stat.prefix}
                          />
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm">{stat.label}</div>
                      <div
                        className={`text-xs font-medium ${stat.changeColor}`}
                      >
                        {stat.change}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Order Overview + Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                  {/* Order Overview */}
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{
                      opacity: showChart ? 1 : 0,
                      x: showChart ? 0 : -50,
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-semibold text-red-800">
                        Weekly Order Overview
                      </h2>
                      <div className="flex gap-4 items-center">
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-[#7f1d1d]" />
                          <span className="text-sm text-gray-700">
                            Sales After Discount
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full bg-[#f87171]" />
                          <span className="text-sm text-gray-700">
                            Sales Before Discount
                          </span>
                        </div>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          tickFormatter={(val) => `$${val}`}
                        />
                        <Tooltip />
                        <Bar
                          yAxisId="left"
                          dataKey="order"
                          fill="#7f1d1d"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="sales"
                          fill="#f87171"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  {/* Order Summary */}
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-md flex flex-col"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-xl font-semibold text-red-800 mb-4">
                      Order Summary
                    </h2>
                    <div className="flex flex-col space-y-6">
                      {orderStats.map((orderStat, index) => (
                        <div
                          key={orderStat.label}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="flex flex-col items-start w-1/2">
                            <div className="text-3xl font-semibold text-red-800">
                              <CountUp end={orderStat.value} duration={2} />
                            </div>
                            <div className="text-sm font-medium text-gray-700 mt-2 mb-2">
                              {orderStat.label}
                            </div>
                          </div>
                          <div className="w-1/2 h-12">
                            <Line
                              data={{
                                labels: Array(7).fill(""),
                                datasets: [
                                  {
                                    data: Array(5)
                                      .fill(orderStat.value / 2)
                                      .concat([orderStat.value]),
                                    borderColor: orderStat.color,
                                    backgroundColor: `${orderStat.color}20`,
                                    tension: 0.4,
                                    fill: true,
                                    borderWidth: 3,
                                    pointRadius: 0,
                                  },
                                ],
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                  legend: { display: false },
                                  tooltip: { enabled: false },
                                },
                                animation: { duration: 1500 },
                                scales: {
                                  x: { display: false },
                                  y: { display: false },
                                },
                                elements: {
                                  point: { radius: 0 },
                                },
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Sales Overview AreaChart */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="bg-white p-6 rounded-xl shadow-lg mt-10 w-full"
                >
                  <div className="flex justify-between items-start px-4 mb-4">
                    <div>
                      <h2 className="text-sm font-semibold text-[#8B0000]">
                        Sales Overview
                      </h2>
                      <p className="text-xl font-bold text-red-700">
                        ${salesOverviewTotal.totalSales || 0}
                        <span className="text-red-500 text-sm ml-2">
                          {salesOverviewTotal.changePercentage >= 0 ? "+" : ""}
                          {salesOverviewTotal.changePercentage || 0}%
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex items-center text-xs text-[#8B0000]">
                        <svg
                          className="w-3 h-3 mr-1 text-[#8B0000]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 8l5 5 5-5H5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {salesOverviewTotal.profitMargin || 0}%
                      </div>
                      <p className="text-[#8B0000] text-xl font-bold">
                        ${salesOverviewTotal.totalRevenue || 0}
                      </p>
                    </div>
                  </div>

                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={salesOverviewData}>
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#7f1d1d"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#7f1d1d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#f87171"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="95%"
                            stopColor="#f87171"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#aaa" />
                      <YAxis yAxisId="left" stroke="#aaa" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#aaa"
                      />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="uv"
                        stroke="#7f1d1d"
                        fill="url(#colorUv)"
                        yAxisId="left"
                      />
                      <Area
                        type="monotone"
                        dataKey="pv"
                        stroke="#f87171"
                        fill="url(#colorPv)"
                        yAxisId="right"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-red-800 text-white flex flex-col justify-between">
        <div>
          <nav className="px-4 pt-6 space-y-2 text-sm">
            {sidebarItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-start gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-red-700 text-white shadow-lg"
                      : "text-white hover:bg-red-700"
                  }`
                }
              >
                <div className="text-lg mt-1">{item.icon}</div>
                <div>
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-xs text-gray-300">{item.sub}</div>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 text-white"
          >
            <div className="text-lg mt-1">
              <FaSignOutAlt />
            </div>
            <div>
              <div className="font-medium">Logout</div>
              <div className="text-xs text-gray-300">
                Sign out of your account
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50">{renderContent()}</main>
    </div>
  );
};

export default Dashboard;
