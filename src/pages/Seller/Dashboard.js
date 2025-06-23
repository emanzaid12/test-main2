import { NavLink, useLocation } from "react-router-dom";
import {
  FaPlus, FaBoxOpen, FaClipboardCheck, FaEnvelope, FaBullhorn,
  FaStar, FaCogs, FaUserCog, FaGlobe, FaQuestionCircle,
  FaLock, FaFileContract, FaLifeRing, FaSignOutAlt,
  FaDollarSign, FaShoppingBag, FaClock, FaUsers,FaBell
} from "react-icons/fa";
import CountUp from "react-countup";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip as ChartTooltip
} from "chart.js";
import { motion } from "framer-motion";

// الصفحات الفرعية
import AddYourProducts from './AddYourProducts';
import MyProducts from './MyProducts';
import OrderReceived from './OrderReceived';
import Messages from './SellerMessages';
import Reviews from './Reviews';
import BrandSettings from './BrandSettings';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip);

const sidebarItems = [
  { to: "/dashboard/add-products", icon: <FaPlus />, label: "Add Your Products", sub: "Add items to your store" },
  { to: "/dashboard/my-products", icon: <FaBoxOpen />, label: "My Products", sub: "Manage your uploaded items" },
  { to: "/dashboard/orders", icon: <FaClipboardCheck />, label: "Order Received", sub: "View your received orders" },
  { to: "/dashboard/messages", icon: <FaEnvelope />, label: "Messages", sub: "Chat with your customers" },
  { to: "/dashboard/coupon-page", icon: <FaBullhorn />, label: "Coupon Page", sub: "Boost your product visibility" },
  { to: "/dashboard/reviews", icon: <FaStar />, label: "Reviews", sub: "Read customer feedback" },
  { to: "/dashboard/brand-settings", icon: <FaCogs />, label: "Brand Settings", sub: "Configure your store" },
  { to: "/dashboard/account-settings-page", icon: <FaUserCog />, label: "Account Information", sub: "Manage your profile" },
  { to: "/dashboard/language-settings-page", icon: <FaGlobe />, label: "Language & Appearance", sub: "Change language and theme" },
  { to: "/dashboard/faq-page", icon: <FaQuestionCircle />, label: "FAQ", sub: "Frequently asked questions" },
  { to: "/dashboard/privacy-policy-page", icon: <FaLock />, label: "Privacy Policy", sub: "Understand your data rights" },
  { to: "/dashboard/terms-page", icon: <FaFileContract />, label: "Terms & Conditions", sub: "Review our terms of service" },
  { to: "/dashboard/help-page", icon: <FaLifeRing />, label: "Help Center", sub: "Need support? We're here!" },
  { to: "/dashboard/notifications", icon: <FaBell />, label: "Notifications", sub: "Alerts and updates from your store" },
  
];

const stats = [
  { icon: <FaDollarSign className="text-red-800 text-2xl" />, value: 24763, label: "Today's Sale", change: "+12%", changeColor: "text-red-800", prefix: "$" },
  { icon: <FaShoppingBag className="text-red-800 text-2xl" />, value: 270, label: "Today's Total Orders", change: "-17.5%", changeColor: "text-red-400", prefix: "" },
  { icon: <FaClock className="text-red-800 text-2xl" />, value: 1235, label: "Today's Revenue", change: "-3.7%", changeColor: "text-red-400", prefix: "$" },
  { icon: <FaUsers className="text-red-800 text-2xl" />, value: 19482, label: "Today's Visitors", change: "+15.9%", changeColor: "text-red-800", prefix: "" },
];

const chartData = [
  { date: "5 Nov", order: 420, sales: 32000 },
  { date: "6 Nov", order: 510, sales: 48000 },
  { date: "7 Nov", order: 300, sales: 35000 },
  { date: "8 Nov", order: 180, sales: 28000 },
  { date: "9 Nov", order: 450, sales: 37000 },
  { date: "10 Nov", order: 220, sales: 19000 },
  { date: "11 Nov", order: 500, sales: 44000 },
];

const orderStats = [
  { label: "Approved order", value: 1730, color: "#7f1d1d" },
  { label: "Cancel orders", value: 170, color: "#dc2626" },
  { label: "Return order", value: 45, color: "#f87171" },
  { label: "Pending order", value: 25, color: "#fecaca" },
];

const data = [
  { name: 'SAT', uv: 12000, pv: 9000 },
  { name: 'SUN', uv: 14000, pv: 11000 },
  { name: 'MON', uv: 10000, pv: 12000 },
  { name: 'TUE', uv: 17000, pv: 13000 },
  { name: 'WED', uv: 14000, pv: 10000 },
  { name: 'THU', uv: 16000, pv: 14000 },
  { name: 'FRI', uv: 20000, pv: 15000 },
];

const Dashboard = () => {
  const [showChart, setShowChart] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowChart(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  let content;
  switch (location.pathname) {
    case "/dashboard/add-products":
      content = <AddYourProducts />;
      break;
    case "/dashboard/my-products":
      content = <MyProducts />;
      break;
    case "/dashboard/orders":
      content = <OrderReceived />;
      break;
    case "/dashboard/messages":
      content = <Messages />;
      break;
    case "/dashboard/reviews":
      content = <Reviews />;
      break;
    case "/dashboard/brand-settings":
      content = <BrandSettings />;
      break;
    default:
      content = (
        <>
          {/* Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-5 rounded-xl shadow flex flex-col items-start space-y-2">
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <div className="text-2xl font-semibold text-red-800">
                    <CountUp end={stat.value} duration={2} separator="," prefix={stat.prefix} />
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
                <div className={`text-xs font-medium ${stat.changeColor}`}>{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Order Overview + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            {/* Order Overview */}
            <div className={`bg-white p-6 rounded-xl shadow transition-all duration-1000 ${showChart ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transform w-full`}>
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-red-800">Order Overview</h2>
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#7f1d1d]" />
                    <span className="text-sm text-gray-700">Order</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#f87171]" />
                    <span className="text-sm text-gray-700">Sales</span>
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(val) => `$${val / 1000}k`} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="order" fill="#7f1d1d" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="sales" fill="#f87171" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Order Summary */}
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md flex flex-col"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-xl font-semibold text-red-800 mb-4">Order Summary</h2>
              <div className="flex flex-col space-y-6">
                {orderStats.map((orderStat) => (
                  <div key={orderStat.label} className="flex items-center justify-between w-full">
                    <div className="flex flex-col items-start w-1/2">
                      <div className="text-3xl font-semibold text-red-800">{orderStat.value}</div>
                      <div className="text-sm font-medium text-gray-700 mt-2 mb-2">{orderStat.label}</div>
                    </div>
                    <div className="w-1/2 h-12">
                      <Line
                        data={{
                          labels: Array(7).fill(""),
                          datasets: [{
                            data: Array(5).fill(orderStat.value / 2).concat([orderStat.value]),
                            borderColor: orderStat.color,
                            backgroundColor: `rgba(${parseInt(orderStat.color.slice(1, 3), 16)}, ${parseInt(orderStat.color.slice(3, 5), 16)}, ${parseInt(orderStat.color.slice(5, 7), 16)}, 0.2)`,
                            tension: 0.4,
                            fill: true,
                            borderWidth: 3,
                            pointRadius: 0,
                          }],
                        }}
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          animation: { duration: 1500 },
                          scales: { x: { display: false }, y: { display: false } }
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
            transition={{ duration: 0.8 }}
            className="bg-white p-6 rounded-xl shadow-lg mt-10 w-full"
          >
            <div className="flex justify-between items-start px-4">
              <div>
                <h2 className="text-sm font-semibold text-[#8B0000]">Sales Overview</h2>
                <p className="text-xl font-bold text-red-700">$78,489.90 <span className="text-red-500 text-sm">+12%</span></p>
              </div>
              <div className="flex items-center justify-end gap-2">
  <div className="flex items-center text-xs text-[#8B0000]">
    <svg className="w-3 h-3 mr-1 text-[#8B0000]" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M5 8l5 5 5-5H5z" clipRule="evenodd" />
    </svg>
    3.7%
  </div>
  <p className="text-[#8B0000] text-xl font-bold">22%</p>
</div>

            </div>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7f1d1d" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7f1d1d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis yAxisId="left" stroke="#aaa" />
                <YAxis yAxisId="right" orientation="right" stroke="#aaa" />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#7f1d1d" fill="url(#colorUv)" yAxisId="left" />
                <Area type="monotone" dataKey="pv" stroke="#f87171" fill="url(#colorPv)" yAxisId="right" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </>
      );
  }

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
                  `flex items-start gap-3 px-4 py-3 rounded-lg transition ${isActive ? "text-gray-400" : "text-white"}`
                }
              >
                
                <div className="text-lg">{item.icon}</div>
                <div>
                  <div className="text-white">{item.label}</div>
                  <div className="text-xs text-gray-300">{item.sub}</div>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="px-4 pb-20 ">
          <NavLink
            to="/logout"
            className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition text-white"
          >
            <div className="text-lg"><FaSignOutAlt /></div>
            <div>
              <div>Logout</div>
              <div className="text-xs text-gray-300">Sign out of your account</div>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50">
        {content}
      </main>
    </div>
  );
};

export default Dashboard;
