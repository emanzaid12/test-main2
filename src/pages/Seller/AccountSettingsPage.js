import React, { useState, useEffect } from "react";
import { FaCamera, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

const AccountSettingsPage = () => {
  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    UserName: "",
    ImageUrl: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);

  // Base API URL
  const API_BASE = "https://shopyapi.runasp.net/api/Account";

  // Get auth token (assuming it's stored in localStorage)
  const getAuthToken = () => {
    return localStorage.getItem("authToken") || localStorage.getItem("token");
  };

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setMessage({ type: "error", text: "Please login first" });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Split the full name back to first and last name
        const nameParts = data.name ? data.name.split(" ") : ["", ""];
        setUserData({
          FirstName: nameParts[0] || "",
          LastName: nameParts.slice(1).join(" ") || "",
          Email: data.email || "",
          UserName: data.userName || "",
          ImageUrl: data.imageUrl || "",
        });
        if (data.imageUrl && data.imageUrl !== "default-profile.jpg") {
          setProfileImage(data.imageUrl);
        }
      } else if (response.status === 401) {
        setMessage({ type: "error", text: "Unauthorized access" });
      } else {
        setMessage({ type: "error", text: "Error loading data" });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Server connection error" });
    } finally {
      setLoading(false);
    }
  };

  // Load user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // Update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ type: "", text: "" });

    try {
      const token = getAuthToken();
      if (!token) {
        setMessage({ type: "error", text: "Please login first" });
        setUpdating(false);
        return;
      }

      const formData = new FormData();
      formData.append("FirstName", userData.FirstName);
      formData.append("LastName", userData.LastName);
      formData.append("Email", userData.Email);
      formData.append("UserName", userData.UserName);

      if (selectedImageFile) {
        formData.append("ProfileImage", selectedImageFile);
      }

      const response = await fetch(`${API_BASE}/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Profile updated successfully" });
        setSelectedImageFile(null);
        // Refresh user data
        await fetchUserProfile();
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Error updating profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Server connection error" });
    } finally {
      setUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters",
      });
      return;
    }

    setChangingPassword(true);
    setMessage({ type: "", text: "" });

    try {
      const token = getAuthToken();
      if (!token) {
        setMessage({ type: "error", text: "Please login first" });
        setChangingPassword(false);
        return;
      }

      const response = await fetch(`${API_BASE}/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CurrentPassword: passwordData.currentPassword,
          NewPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Password changed successfully" });
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordForm(false);
      } else {
        const errorText = await response.text();
        setMessage({
          type: "error",
          text: errorText || "Error changing password",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage({ type: "error", text: "Server connection error" });
    } finally {
      setChangingPassword(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl">
        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Picture */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-24 h-24">
            <div className="w-full h-full rounded-full border-4 border-red-800 bg-white flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaUser className="text-red-800 text-3xl" />
              )}
            </div>

            <label className="absolute bottom-0 right-0 bg-red-800 text-white p-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors">
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

        {/* Profile Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                value={userData.FirstName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="LastName"
                value={userData.LastName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="Email"
              value={userData.Email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="UserName"
              value={userData.UserName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
              required
            />
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={updating}
              className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-red-50 text-red-800 px-6 py-2 rounded-full hover:bg-red-800 hover:text-white transform hover:scale-105 transition-all duration-300"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* Password Change Form */}
        {showPasswordForm && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Change Password
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 pr-10"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={changingPassword}
                  className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>

                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="bg-red-50 text-red-800 px-6 py-2 rounded-full hover:bg-red-800 hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettingsPage;
