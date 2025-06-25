import React, { useState, useEffect } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaUser,
  FaEnvelopeOpenText,
} from "react-icons/fa";
import animationVideo from "../assets/images/animation.webm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactUs = () => {
  const [animateHeader, setAnimateHeader] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setTimeout(() => setAnimateHeader(true), 300);
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch(
        "https://shopyapi.runasp.net/api/Contact/my-messages",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages", error);
    }
  };

  const fetchMessageDetails = async (id) => {
    try {
      const res = await fetch(
        `https://shopyapi.runasp.net/api/Contact/message-details/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch message details");
      const data = await res.json();
      setSelectedMessage(data);
    } catch (error) {
      console.error("Error loading message details", error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message)
      return toast.warn("Please fill all fields");

    try {
      const res = await fetch("https://shopyapi.runasp.net/api/Contact/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message);
        setFormData({ subject: "", message: "" });
        fetchMessages();
      } else {
        toast.error(result.message || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10 relative">
      <button
        onClick={() => setShowMessages(!showMessages)}
        className="fixed top-24 right-6 z-50 bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all"
        title="View Messages"
      >
        <FaEnvelopeOpenText size={24} />
      </button>

      {showMessages && (
        <div className="fixed top-36 right-6 z-50 bg-white border border-gray-300 rounded-lg shadow-lg w-80 p-4">
          <h3 className="text-lg font-bold text-red-700 mb-2">Your Messages</h3>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {messages.map((msg) => (
              <li
                key={msg.messageId}
                className="cursor-pointer p-2 border rounded-md hover:bg-gray-100"
                onClick={() => fetchMessageDetails(msg.messageId)}
              >
                {msg.subject}{" "}
                {msg.hasReply && <span className="text-green-600 ml-1">✔</span>}
              </li>
            ))}
          </ul>
          {selectedMessage && (
            <div className="mt-4 p-3 bg-gray-50 border-t text-sm text-gray-700">
              <strong>Subject:</strong> {selectedMessage.subject}
              <br />
              <strong>Message:</strong> {selectedMessage.message}
              <br />
              <strong>Admin Reply:</strong> {selectedMessage.adminReply}
            </div>
          )}
        </div>
      )}

      <ToastContainer />

      <div className="bg-red-800 text-white py-16 px-6 text-center w-full mt-[-60px]">
        <div className="max-w-4xl mx-auto">
          <h2
            className={`text-4xl font-bold transform transition-all duration-700 ${
              animateHeader
                ? "translate-y-0 opacity-100"
                : "-translate-y-5 opacity-0"
            }`}
          >
            Contact Us
          </h2>
          <p
            className={`mt-2 text-lg transition-all duration-700 delay-200 ${
              animateHeader ? "opacity-100" : "opacity-0"
            }`}
          >
            Leave A Message, We Are Here to Help You!
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leave a Message</h2>
          <p className="text-gray-600">We are happy to assist you.</p>
          <form onSubmit={handleSendMessage} className="mt-4 space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="border p-4 rounded-md w-full text-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Message
              </label>
              <textarea
                placeholder="Enter your message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="border p-4 rounded-md w-full text-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800 h-32"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-40 bg-red-700 text-white text-lg font-semibold py-3 rounded-full transition-transform transform hover:scale-105 hover:bg-red-600"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
            Contact Us <FaUser className="text-red-700" />
          </h3>
          <p className="text-gray-600 mt-1">
            We are here to support your small business
          </p>

          <div className="mt-6">
            <video
              className="w-full max-w-[300px] mx-auto !border-0 !shadow-none"
              autoPlay
              loop
              muted
            >
              <source src={animationVideo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* <div className="mt-6 space-y-2">
            <p className="text-gray-800 flex items-center justify-center gap-2">
              <FaPhoneAlt className="text-red-700" /> +1 (203) 302-9545
            </p>
            <p className="text-gray-800 flex items-center justify-center gap-2">
              <FaEnvelope className="text-red-700" /> contactus@gmail.com
            </p>
          </div> */}

          {/* <div className="flex justify-center space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, index) => (
              <div
                key={index}
                className="w-12 h-12 flex items-center justify-center bg-red-700 rounded-full cursor-pointer transition-transform transform hover:scale-110 hover:bg-red-600"
              >
                <Icon className="text-white text-2xl" />
              </div>
            ))}
          </div> */}
        </div>
      </div>

      <div className="h-96 mt-10 overflow-hidden w-full max-w-4xl">
        <iframe
          className="w-full h-full rounded-lg shadow-lg transition-transform duration-500 ease-in-out transform hover:scale-110"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.474543095648!2d31.01845917551919!3d30.58914319252226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14580cd3e22e8e8b%3A0xe1d4a144d16e88fa!2sShebin%20El%20Kom%2C%20Menofia%20Governorate!5e0!3m2!1sen!2seg!4v1710456983105!5m2!1sen!2seg"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
