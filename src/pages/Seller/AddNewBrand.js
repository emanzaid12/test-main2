import { useState } from "react";

const AddNewBrand = () => {
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [storeType, setStoreType] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error

  // دالة لتنظيف البيانات وعمل logout
  const performLogout = () => {
    // مسح التوكن من localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userData"); // إذا كان هناك بيانات أخرى

    // يمكن أيضاً مسح sessionStorage إذا كان يستخدم
    sessionStorage.clear();

    // إعادة توجيه للصفحة الرئيسية أو صفحة تسجيل الدخول
    // يمكنك تغيير هذا حسب routing system المستخدم في مشروعك
    setTimeout(() => {
      window.location.href = "/login"; // أو '/auth' أو الصفحة المناسبة
    }, 3000); // انتظار 3 ثواني لقراءة الرسالة
  };

  const handleSubmit = async (e) => {
    // Validation basic
    if (!storeName || !storeType || !street || !city || !governorate) {
      setMessage("Please fill all required fields!");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // الحصول على التوكن من localStorage أو من مكان تخزينه
      const token = localStorage.getItem("authToken"); // أو sessionStorage.getItem('token')

      if (!token) {
        setMessage("Authentication token not found. Please login again.");
        setMessageType("error");
        setIsLoading(false);
        return;
      }

      const requestData = {
        storeName,
        storeDescription,
        storeType,
        street,
        city,
        governorate,
      };

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Store/submit-store-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        }
      );

      if (response.ok) {
        const result = await response.text();

        // رسالة النجاح مع توضيح الخطوات التالية
        setMessage(
          `${result} - Your store information has been submitted successfully! Please wait for admin approval. You will be logged out shortly and can login as a regular user.`
        );
        setMessageType("success");

        // إعادة تعيين النموذج بعد النجاح
        setStoreName("");
        setStoreDescription("");
        setStoreType("");
        setStreet("");
        setCity("");
        setGovernorate("");

        // عمل logout بعد نجاح الإرسال
        performLogout();
      } else {
        const errorText = await response.text();
        setMessage(
          errorText || "An error occurred while submitting store information."
        );
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error submitting store info:", error);
      setMessage("Network error. Please check your connection and try again.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-[#800000] text-white rounded-lg p-10 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">
          Submit Store Information
        </h2>
        <p className="text-sm text-center mb-6">
          Let's build a store that inspires!
        </p>

        {/* رسالة النجاح أو الخطأ */}
        {message && (
          <div
            className={`mb-4 p-3 rounded text-center text-sm ${
              messageType === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
          >
            {message}
            {messageType === "success" && (
              <div className="mt-2 text-xs">
                <p>Redirecting to login page in 3 seconds...</p>
              </div>
            )}
          </div>
        )}

        <div className="space-y-5">
          {/* Store Name */}
          <div>
            <input
              type="text"
              placeholder="Store Name *"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000] disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          {/* Store Description */}
          <div>
            <textarea
              placeholder="Store Description"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000] disabled:bg-gray-200 disabled:cursor-not-allowed"
              rows="3"
            ></textarea>
          </div>

          {/* Store Type */}
          <div>
            <input
              type="text"
              placeholder="Store Type *"
              value={storeType}
              onChange={(e) => setStoreType(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000] disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          {/* Street */}
          <div>
            <input
              type="text"
              placeholder="Street *"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000] disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          {/* City */}
          <div>
            <input
              type="text"
              placeholder="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000] disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          {/* Governorate */}
          <div>
            <input
              type="text"
              placeholder="Governorate *"
              value={governorate}
              onChange={(e) => setGovernorate(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-[#800000] disabled:bg-gray-200 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            type="button"
            className="bg-white text-[#800000] font-bold py-2 px-6 rounded-full mx-auto block transform transition-transform duration-200 hover:scale-110 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewBrand;
