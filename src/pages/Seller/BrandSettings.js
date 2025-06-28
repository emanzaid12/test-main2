import React, { useState, useEffect } from "react";

const BrandSettings = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    street: "",
    governorate: "",
  });
  const [storeId, setStoreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  // Function to get token from localStorage (you'll need to adjust this based on how you store the token)
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Fetch store data on component mount
  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setMessage("Authentication token not found");
        setMessageType("error");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Store/my-store",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const storeData = await response.json();
        setStoreId(storeData.storeId);
        setFormData({
          name: storeData.name || "",
          description: storeData.description || "",
          city: storeData.city || "",
          street: storeData.street || "",
          governorate: storeData.governorate || "",
        });
      } else if (response.status === 401) {
        setMessage("Unauthorized access. Please login again.");
        setMessageType("error");
      } else if (response.status === 404) {
        setMessage("No store found for this seller.");
        setMessageType("error");
      } else {
        setMessage("Failed to load store data");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error connecting to server");
      setMessageType("error");
      console.error("Error fetching store data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!storeId) {
      setMessage("Store ID not found");
      setMessageType("error");
      return;
    }

    // Validation
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.city.trim() ||
      !formData.street.trim() ||
      !formData.governorate.trim()
    ) {
      setMessage("Please fill in all required fields");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = getAuthToken();
      if (!token) {
        setMessage("Authentication token not found");
        setMessageType("error");
        setSaving(false);
        return;
      }

      const requestBody = {
        newName: formData.name,
        newDescription: formData.description,
        newCity: formData.city,
        newStreet: formData.street,
        newGovernorate: formData.governorate,
      };

      const response = await fetch(
        `https://shopyapi.runasp.net/api/Store/request-edit-store/${storeId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const result = await response.text();
        setMessage(
          result ||
            "Edit request submitted successfully. Awaiting admin approval."
        );
        setMessageType("success");
      } else if (response.status === 400) {
        const errorMessage = await response.text();
        setMessage(errorMessage || "Bad request. Please check your data.");
        setMessageType("error");
      } else if (response.status === 401) {
        setMessage("Unauthorized access. Please login again.");
        setMessageType("error");
      } else {
        setMessage("Failed to submit edit request");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error connecting to server");
      setMessageType("error");
      console.error("Error submitting edit request:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#800000] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="bg-[#800000] py-4 text-center rounded-t-lg">
          <h1 className="text-3xl font-bold text-white">Store Settings</h1>
          <p className="text-white/80 mt-1">Update your store information</p>
        </div>

        {/* Card with form */}
        <div className="bg-white p-8 rounded-b-lg shadow-lg">
          {/* Message Display */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                messageType === "success"
                  ? "bg-green-100 border border-green-400 text-green-700"
                  : "bg-red-100 border border-red-400 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-6">
            {/* Store Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Store Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter store name"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter store description"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
                rows={4}
              />
            </div>

            {/* Location Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Governorate */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Governorate
                </label>
                <input
                  type="text"
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleInputChange}
                  placeholder="Enter governorate"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
                />
              </div>

              {/* City */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Street */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Street
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter street address"
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-[#800000] text-white px-8 py-3 rounded-full hover:bg-[#a03c3c] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium text-lg shadow-lg"
              >
                {saving ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </span>
                ) : (
                  "Submit Edit Request"
                )}
              </button>
            </div>
          </div>

          {/* Note */}
          <div className="mt-6 p-4 bg-red-50 border border-blue-200 rounded-lg">
            <p className="text-red-800 text-sm">
              <strong>Note:</strong> Your edit request will be sent to the admin
              for approval. You will be notified once your changes are reviewed
              and approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSettings;
