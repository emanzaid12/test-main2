// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  FaBoxOpen, FaShoppingCart, FaStar, FaUsers, FaChartLine,
  FaArrowUp, FaArrowDown, FaUndoAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    setChartData({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: [4000, 5000, 8000, 6000, 7500, 3000, 5500, 7000, 2000, 7500, 5000, 6000],
          backgroundColor: '#7c0a02',
          borderRadius: 6,
          barThickness: 20,
        },
      ],
    });
  }, []);

  const stats = [
    {
      icon: <FaChartLine className="text-red-800 text-2xl" />,
      value: 898.78,
      label: 'Total Sales',
      prefix: '$',
      percentage: '+10%',
      changeType: 'up',
    },
    {
      icon: <FaUsers className="text-red-800 text-2xl" />,
      value: 229,
      label: 'Active Users',
      percentage: '+3.2%',
      changeType: 'up',
    },
    {
      icon: <FaShoppingCart className="text-red-800 text-2xl" />,
      value: 4041,
      label: 'New Orders',
      percentage: '-4.5%',
      changeType: 'down',
    },
    {
      icon: <FaUndoAlt className="text-red-800 text-2xl" />,
      value: 15.98,
      label: 'Return Rate',
      suffix: '%',
      percentage: '+1.1%',
      changeType: 'up',
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-red-800 text-white p-6">
        <div className="space-y-6">
          {[
            { icon: <FaBoxOpen />, title: 'Manage Products', subtitle: 'Upload and manage your items', route: '/admin/products' },
            { icon: <FaShoppingCart />, title: 'Manage Orders', subtitle: 'Track incoming orders', route: '/admin/orders' },
            { icon: <FaUsers />, title: 'Manage Sellers', subtitle: 'View and manage sellers', route: '/admin/sellers' },
            { icon: <FaStar />, title: 'Manage Reviews', subtitle: 'See what customers think', route: '/admin/reviews' },
          ].map((item, idx) => (
            <div key={idx} onClick={() => navigate(item.route)} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-lg font-semibold text-white">{item.title}</span>
              </div>
              <p className="text-sm text-gray-300 ml-8">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded shadow text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="text-xl font-semibold text-red-800 flex items-center gap-2 mb-2">
                  {stat.icon}
                  <CountUp
                    end={stat.value}
                    duration={2}
                    prefix={stat.prefix || ''}
                    suffix={stat.suffix || ''}
                    separator=","
                    decimals={stat.prefix || stat.suffix ? 2 : 0}
                  />
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <div
                  className={`flex items-center justify-center text-sm font-medium mt-1 ${
                    stat.percentage.includes('-') ? 'text-red-400' : 'text-red-800'
                  }`}
                >
                  {stat.changeType === 'up' ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                  {stat.percentage}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold text-red-800 mb-4">Monthly Revenue</h3>
          {chartData && (
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
                  easing: 'easeOutQuart',
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
