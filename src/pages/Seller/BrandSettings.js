import React from "react";

const BrandSettings = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-[#800000] py-4 text-center rounded-t-lg">
          <h1 className="text-3xl font-bold text-white">Brand Settings</h1>
        </div>

        {/* Card with form */}
        <div className="bg-white p-8 rounded-b-lg shadow-lg w-full">
          <form className="space-y-6 mt-2">
            {/* Brand Name */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Brand Name</label>
              <input
                type="text"
                placeholder="Brand name"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800000]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Description</label>
              <textarea
                placeholder="Brand description"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800000]"
                rows={4}
              ></textarea>
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">Category</label>
              <input
                type="text"
                placeholder="Brand category"
                className="w-full p-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#800000]"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-[#800000] text-white px-6 py-2 rounded-full hover:bg-[#a03c3c] transform hover:scale-105 transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandSettings;