import React from "react";
import { FaRegFileAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const TermsPage = () => {
  const navigate = useNavigate();

  const handleAgree = () => {
    toast("Thanks for agreeing to the terms.", {
      icon: <FaRegFileAlt className="text-[#991B1B]" />,
      position: "bottom-center",
      style: {
        borderRadius: "8px",
        background: "#fff",
        color: "#991B1B",
        border: "1px solid #991B1B",
      },
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };
  
  return (
    
    <>
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 flex flex-col">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <FaRegFileAlt className="text-red-800 text-4xl mb-2" />
            <h2 className="text-lg font-bold text-red-800 uppercase tracking-wide">
              Terms & Conditions
            </h2>
            <hr className="w-20 border-red-200 mt-2" />
          </div>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm text-black"
            style={{
              maxHeight: "400px",
              scrollbarWidth: "thin",
              scrollbarColor: "#991B1B #F3F4F6",
            }}
          >
            <section>
              <h3 className="text-red-800 font-semibold mb-1">Introduction</h3>
              <p>This platform is created to connect users for buying and selling products or services.</p>
            </section>

            <section>
              <h3 className="text-red-800 font-semibold mb-1">Terms of Use</h3>
              <p>Users must be 18+ or have parental consent to use the platform.</p>
            </section>

            <section>
              <h3 className="text-red-800 font-semibold mb-1">Content Usage</h3>
              <p>Content on this site may not be copied or redistributed without permission.</p>
            </section>

            <section>
              <h3 className="text-red-800 font-semibold mb-1">Prohibited Uses</h3>
              <p>Illegal use, fraud, or hacking are strictly forbidden.</p>
            </section>

            <section>
              <h3 className="text-red-800 font-semibold mb-1">Intellectual Property</h3>
              <p>All content and trademarks belong to the platform unless stated otherwise.</p>
            </section>

            <section>
              <h3 className="text-red-800 font-semibold mb-1">Buying & Selling Policy</h3>
              <p>Users are responsible for fulfilling their part of transactions.</p>
            </section>

            <section>
              <h3 className="text-red-800 font-semibold mb-1">Disclaimer</h3>
              <p>We are not liable for third-party errors or disputes.</p>
            </section>

            <section>
              <h3 className="text-red-800 font-semibold mb-1">Changes to Terms</h3>
              <p>We may update these terms anytime. Continued use implies acceptance.</p>
            </section>
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6 space-x-4">
            
            <button
              onClick={handleAgree}
              className="bg-red-800 text-white px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-red-700"
            >
              Agree
            </button>
          </div>

          {/* Custom Scrollbar Styling */}
          <style>
            {`
              div::-webkit-scrollbar {
                width: 8px;
              }
              div::-webkit-scrollbar-thumb {
                background-color: #991B1B;
                border-radius: 10px;
              }
              div::-webkit-scrollbar-track {
                background-color: #f3f4f6;
              }
            `}
          </style>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
