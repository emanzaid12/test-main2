import React, { useState } from "react";
import { FaShoppingCart, FaStore, FaTools, FaPlus, FaMinus } from "react-icons/fa";

const HelpPage = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const helpData = {
    buyers: {
      title: "Help for Buyers",
      faqs: [
        { question: "How to place an order?", answer: "Browse products, add them to your cart, then confirm your shipping and payment info." },
        { question: "What are the payment methods?", answer: "We accept cards, mobile wallets, and cash on delivery (where available)." },
        { question: "How can I track my order?", answer: "Go to Settings > Order History to see status and tracking info." },
      ],
    },
    sellers: {
      title: "Help for Sellers",
      faqs: [
        { question: "How to create a project/store?", answer: "Sign up as a seller and use the 'Create New Project' option to start." },
        { question: "How to manage my products?", answer: "Go to your dashboard to add, update, or remove products anytime." },
        { question: "How to handle orders?", answer: "View new orders in your dashboard, update their status, and mark as shipped." },
      ],
    },
    technical: {
      title: "Technical Issues",
      faqs: [
        { question: "I forgot my password", answer: "Click 'Forgot Password' on login screen and follow the reset link." },
        { question: "My account is locked", answer: "Wait 15 mins and try again or contact support for help." },
        { question: "The app/website is not working", answer: "Try refreshing, check your connection, or contact support." },
      ],
    },
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-center text-3xl font-bold text-red-800 mb-8">
        Hello, how can we help?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Buyers Card */}
        <div
          onClick={() => handleCardClick("buyers")}
          className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border transition-all duration-300 transform ${
            selectedCard === "buyers"
              ? "border-red-800 scale-105"
              : "border-gray-200 scale-100"
          }`}
        >
          <div className="p-6 flex flex-col items-center justify-center">
            <FaShoppingCart className="text-red-800 text-4xl mb-3" />
            <h3 className="text-red-800 font-bold text-lg">For Buyers</h3>
          </div>
        </div>

        {/* Sellers Card */}
        <div
          onClick={() => handleCardClick("sellers")}
          className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border transition-all duration-300 transform ${
            selectedCard === "sellers"
              ? "border-red-800 scale-105"
              : "border-gray-200 scale-100"
          }`}
        >
          <div className="p-6 flex flex-col items-center justify-center">
            <FaStore className="text-red-800 text-4xl mb-3" />
            <h3 className="text-red-800 font-bold text-lg">For Sellers</h3>
          </div>
        </div>

        {/* Technical Card */}
        <div
          onClick={() => handleCardClick("technical")}
          className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border transition-all duration-300 transform ${
            selectedCard === "technical"
              ? "border-red-800 scale-105"
              : "border-gray-200 scale-100"
          }`}
        >
          <div className="p-6 flex flex-col items-center justify-center">
            <FaTools className="text-red-800 text-4xl mb-3" />
            <h3 className="text-red-800 font-bold text-lg">Technical Issues</h3>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      {selectedCard && (
        <div className="mt-10 text-center">
          <h3 className="text-red-800 text-xl font-bold mb-4">
            {selectedCard === "buyers"
              ? "For Buyers"
              : selectedCard === "sellers"
              ? "For Sellers"
              : "Technical Issues"}
          </h3>

          <ul className="max-w-2xl mx-auto space-y-4 text-left">
            {helpData[selectedCard]?.faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <li
                  key={index}
                  className={`rounded-xl p-5 shadow-md transition-all duration-300 border ${
                    isOpen
                      ? "bg-red-100 border-red-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    onClick={() => toggleAccordion(index)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <h3 className="text-base font-semibold text-red-800">
                      {item.question}
                    </h3>
                    <div className="text-red-800 text-lg">
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </div>
                  </div>
                  {isOpen && (
                    <p className="mt-4 text-sm text-gray-700">{item.answer}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Contact Us Section */}
      <div className="mt-16 text-center">
        <h3 className="text-red-800 text-xl font-bold mb-2">
          Didn't find an answer to your question?
        </h3>
        <p className="text-gray-600 mb-6">
          Get in touch with us for details on additional services and custom work pricing
        </p>
        <button
          onClick={() => window.location.href = "/contact"}
          className="bg-red-800 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          CONTACT US
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
