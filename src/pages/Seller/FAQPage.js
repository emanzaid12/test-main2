import React, { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import faqImage from "../../assets/images/FAQ1.jpg";



const FAQPage = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    
        {
          question: "How can I order a product?",
          answer: "You can order a product by adding it to your cart and completing the checkout process.",
        },
        {
          question: "How can I add my project as a seller?",
          answer: "Register as a seller, fill in your project details, and wait for approval before publishing.",
        },
        {
          question: "How can I track my order?",
          answer: "You can track your order status from the 'Order History' section in your account.",
        },
        {
          question: "Are there any selling fees?",
          answer: "Yes, a small commission is applied to each sale to support the platform.",
        },
        {
          question: "Can I return a product?",
          answer: "Yes, products can be returned within 14 days if they are in their original condition.",
        },
      
      
  ];



  return (
    <div className="flex flex-col md:flex-row gap-10 p-6">
      {/* FAQ Section */}
      <div className="flex-1 space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl p-5 shadow-md transition-all duration-300 border ${
                isOpen ? "bg-red-100 border-red-300" : "bg-white border-gray-200"
              }`}
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-base font-semibold text-red-800">
                  {faq.question}
                </h3>
                <div className="text-red-800 text-lg">
                  {isOpen ? <FaMinus /> : <FaPlus />}
                </div>
              </div>
              {isOpen && (
                <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Side Content */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center space-y-4">
        <img 
          src={faqImage} 
          alt="FAQ" 
          className="w-40 h-40 rounded-full mx-auto object-cover" 
        />
        <h2 className="text-2xl font-bold text-red-800">Any Questions?</h2>
        <p className="text-sm text-gray-500">
          We can answer anything you want to know
        </p>
        <button 
          onClick={() => navigate('/contact')} 
          className="bg-red-800 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-red-600 hover:scale-105"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default FAQPage;
