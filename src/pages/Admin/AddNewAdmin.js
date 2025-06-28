import React, { useState } from "react";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

const AddNewAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    else if (formData.userName.length < 3)
      newErrors.userName = "Username must be at least 3 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getAuthToken = () => localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const authToken = getAuthToken();

      if (!authToken) {
        setErrors({
          submit: "Authentication token not found. Please login again.",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch(
        "https://shopyapi.runasp.net/api/AddingAdmin/AddAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            userName: formData.userName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (response.ok) {
        setSuccessMessage("Admin account created successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        let errorMessage = "Failed to create admin account. Please try again.";
        const errorData = await response.text();

        if (
          response.status === 400 &&
          errorData.includes("Email is already in use")
        ) {
          setErrors({ email: "This email is already registered" });
          errorMessage =
            "Email is already in use. Please use a different email.";
        } else if (response.status === 401) {
          errorMessage =
            "Unauthorized. Please check your permissions or login again.";
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = errorData || errorMessage;
        }

        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        setErrors({
          submit:
            "Network error. Please check your internet connection and try again.",
        });
      } else {
        setErrors({
          submit: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 text-center">
  <div className="flex justify-center items-center gap-3 mb-4">
    <FaUserPlus className="text-red-800 text-3xl" />
    <h1 className="text-3xl font-bold text-gray-800">Add New Admin</h1>
  </div>
  <p className="text-gray-600">
    Create a new administrator account with full access privileges
  </p>
</div>


      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <div className="flex items-center">
            <FaCheck className="mr-2" />
            {successMessage}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-red-800 text-white text-center">
  <h2 className="text-xl font-semibold flex justify-center items-center">
    <FaUser className="mr-2" />
    Administrator Information
  </h2>
</div>


          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* First + Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter last name"
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 ${
                    errors.userName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter username (min 3 characters)"
                  disabled={isSubmitting}
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600">{errors.userName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter password"
                    disabled={isSubmitting}
                  />
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Password must contain at least 8 characters with uppercase,
                  lowercase, and numbers
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    disabled={isSubmitting}
                  />
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <div className="flex items-center">
                    <FaTimes className="mr-2 flex-shrink-0" />
                    <span>{errors.submit}</span>
                  </div>
                </div>
              )}

              {/* Buttons */}
<div className="flex justify-center gap-4 pt-6 border-t">
  <button
    type="button"
    onClick={resetForm}
    disabled={isSubmitting}
    className="px-6 py-2 rounded-full border border-red-800 text-red-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    Reset
  </button>
  <button
    type="submit"
    disabled={isSubmitting}
    className="px-6 py-2 rounded-full bg-red-800 text-white hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isSubmitting ? "Creating..." : "Create Admin"}
  </button>
</div>

            </div>
          </form>
        </div>

        <div className="mt-6 bg-white border border-red-800 rounded-lg p-4">
  <h3 className="text-lg font-medium text-[#7a0d0d] mb-2">
    Admin Privileges
  </h3>
  <ul className="text-sm text-[#7a0d0d] space-y-1">
    <li>• Full access to dashboard and analytics</li>
    <li>• Manage products, orders, and sellers</li>
    <li>• Review and approve store update requests</li>
    <li>• Create and manage other admin accounts</li>
    <li>• Access to all system reports and messages</li>
  </ul>
</div>


      <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
  <h3 className="text-lg font-medium text-[#7a0d0d] mb-2">
    ⚠️ Important Note
  </h3>
  <p className="text-sm text-[#7a0d0d]">
    Make sure to replace the{" "}
    <code className="bg-red-100 px-1 rounded">getAuthToken()</code>{" "}
    function with your actual authentication token retrieval method
    (localStorage, sessionStorage, context, etc.)
  </p>
</div>

      </div>
    </div>
  );
};

export default AddNewAdmin;
