import React, { useState } from "react";
import { FaCamera, FaUser } from "react-icons/fa";

const AccountSettingsPage = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        {/* Profile Picture */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24">
            {/* Circle with border and white background */}
            <div className="w-full h-full rounded-full border-4 border-red-800 bg-white flex items-center justify-center overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaUser className="text-red-800 text-3xl" />
              )}
            </div>

            {/* Camera Icon */}
            <label className="absolute bottom-0 right-0 bg-red-800 text-white p-2 rounded-full cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <FaCamera className="text-sm" />
            </label>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">First Name</label>
              <input
                type="text"
                defaultValue="Esraa"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                defaultValue="Ahmed"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              defaultValue="esraa@example.com"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Username</label>
            <input
              type="text"
              defaultValue="esraa123"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Change Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsPage;
