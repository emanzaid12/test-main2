import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLightbulb,
  FaChartLine,
  FaTools,
  FaUsers,
  FaHandshake,
  FaShoppingBag,
} from "react-icons/fa";
import image from "../assets/images/project-support.jpg"; // حطي صورتك هنا

const services = [
  {
    id: 1,
    title: "Business Development",
    description: "Expert guidance to grow and scale your business.",
    icon: <FaLightbulb className="text-red-800 text-4xl" />,
  },
  {
    id: 2,
    title: "Market Analysis",
    description: "Insights into market trends and competitor strategies.",
    icon: <FaChartLine className="text-red-800 text-4xl" />,
  },
  {
    id: 3,
    title: "Website Development",
    description: "Build and optimize your online presence.",
    icon: <FaTools className="text-red-800 text-4xl" />,
  },
  {
    id: 4,
    title: "Customer Relations",
    description: "Enhance customer engagement and retention.",
    icon: <FaUsers className="text-red-800 text-4xl" />,
  },
  {
    id: 5,
    title: "Partnerships & Funding",
    description: "Find strategic partners and funding opportunities.",
    icon: <FaHandshake className="text-red-800 text-4xl" />,
  },
  {
    id: 6,
    title: "Marketing & Sales",
    description: "Boost your business with effective marketing.",
    icon: <FaShoppingBag className="text-red-800 text-4xl" />,
  },
];

const Services = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-red-800 text-white text-center py-20">
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Services
        </motion.h1>
        <motion.p
          className="mt-4 text-lg"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Comprehensive solutions to support small businesses.
        </motion.p>
      </div>

      {/* Cards */}
      <div className="container mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="bg-white p-6 shadow-lg rounded-lg text-center flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: (index % 3) * 30 }}
            transition={{ duration: 0.7, delay: index * 0.3 }}
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
            <p className="text-gray-600 mt-2">{service.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Image Section with Overlay */}
      <section
        className="relative w-full h-[500px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-20 text-white z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to grow your business?
          </h2>
          <p className="mb-6 max-w-xl text-lg">
            We’re here to help you start, develop, and expand your small business with the tools and support you need.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/contact">
            <button className="bg-red-800 text-white px-6 py-2 rounded-full transition transform duration-300 hover:scale-105 hover:bg-red-700">
  Contact Us
</button>
            </Link>
            <Link to="/services">
            <button className="border border-white text-white px-6 py-2 rounded-full transition transform duration-300 hover:scale-105 hover:bg-white hover:text-red-800">
  Explore Services
</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Services;