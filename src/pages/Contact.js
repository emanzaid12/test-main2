import React, { useState, useEffect } from "react";
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaUser } from "react-icons/fa";
import animationVideo from "../assets/images/animation.webm";

const ContactUs = () => {
  const [animateHeader, setAnimateHeader] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateHeader(true), 300);
  }, []);

  return (
    <div className="w-full flex flex-col items-center py-10">
      
      {/* ✅ الجزء النبيتي مع الأنيميشن */}
      <div className="bg-red-800 text-white py-16 px-6 text-center w-full mt-[-60px]">
        <div className="max-w-4xl mx-auto">
          <h2 className={`text-4xl font-bold transform transition-all duration-700 ${animateHeader ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}>
            Contact Us
          </h2>
          <p className={`mt-2 text-lg transition-all duration-700 delay-200 ${animateHeader ? "opacity-100" : "opacity-0"}`}>
            Leave A Message, We Are Here to Help You!
          </p>
        </div>
      </div>

      {/* ✅ قسم الاتصال + الفورم */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        
        {/* ✅ الفورم */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leave a Message</h2>
          <p className="text-gray-600">We are happy to assist you.</p>
          
          <form className="mt-4 space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Your Name</label>
              <input 
                type="text" 
                placeholder="Enter your name" 
                className="border p-4 rounded-md w-full text-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Your Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="border p-4 rounded-md w-full text-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Your Message</label>
              <textarea 
                placeholder="Enter your message" 
                className="border p-4 rounded-md w-full text-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-800 h-32" 
              />
            </div>

            <div className="flex justify-center">
              <button className="w-40 bg-red-700 text-white text-lg font-semibold py-3 rounded-full transition-transform transform hover:scale-105 hover:bg-red-600">
                Send Message
              </button>
            </div>
          </form>
        </div>

        {/* ✅ معلومات الاتصال مع الفيديو */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center justify-center gap-2">
            Contact Us <FaUser className="text-red-700" />
          </h3>
          <p className="text-gray-600 mt-1">We are here to support your small business</p>

          {/* ✅ الفيديو بحجم أصغر */}
          <div className="mt-6">
            <video className="w-full max-w-[300px] mx-auto !border-0 !shadow-none" autoPlay loop muted>
              <source src={animationVideo} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* ✅ معلومات الاتصال */}
          <div className="mt-6 space-y-2">
            <p className="text-gray-800 flex items-center justify-center gap-2">
              <FaPhoneAlt className="text-red-700" /> +1 (203) 302-9545
            </p>
            <p className="text-gray-800 flex items-center justify-center gap-2">
              <FaEnvelope className="text-red-700" /> contactus@gmail.com
            </p>
          </div>{/* ✅ أيقونات السوشيال ميديا */}
          <div className="flex justify-center space-x-4 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, index) => (
              <div key={index} className="w-12 h-12 flex items-center justify-center bg-red-700 rounded-full cursor-pointer transition-transform transform hover:scale-110 hover:bg-red-600">
                <Icon className="text-white text-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ✅ خريطة شبين الكوم */}
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