import React, { useRef, useState, useEffect } from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  FaUser,
  FaCamera,
  FaLanguage,
  FaMapMarkerAlt,
  FaClipboardList,
  FaSignOutAlt,
  FaGlobe,
  FaMoon,
  FaBoxOpen,
  FaQuestionCircle,
  FaShieldAlt,
  FaFileContract,
  FaLifeRing,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaBell,
  FaStore,
  FaTools,
  FaRegFileAlt,
} from "react-icons/fa";
import { FaGift } from "react-icons/fa";
import { Link } from "react-router-dom";
import faqImage from "../assets/images/FAQ1.jpg";
// مصفوفة الدول
const countryOptions = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "it", label: "Italy" },
  { value: "es", label: "Spain" },
  { value: "cn", label: "China" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "mx", label: "Mexico" },
  { value: "za", label: "South Africa" },
  { value: "ng", label: "Nigeria" },
  { value: "ru", label: "Russia" },
  { value: "eg", label: "Egypt" },
  { value: "sa", label: "Saudi Arabia" },
  { value: "ae", label: "UAE" },
  { value: "tr", label: "Turkey" },
  { value: "ar", label: "Argentina" },
  { value: "se", label: "Sweden" },
  { value: "nl", label: "Netherlands" },
  { value: "id", label: "Indonesia" },
];

// مصفوفة المدن
const cityOptions = [
  { value: "new_york", label: "New York" },
  { value: "london", label: "London" },
  { value: "paris", label: "Paris" },
  { value: "berlin", label: "Berlin" },
  { value: "rome", label: "Rome" },
  { value: "madrid", label: "Madrid" },
  { value: "beijing", label: "Beijing" },
  { value: "tokyo", label: "Tokyo" },
  { value: "seoul", label: "Seoul" },
  { value: "mumbai", label: "Mumbai" },
  { value: "sao_paulo", label: "São Paulo" },
  { value: "toronto", label: "Toronto" },
  { value: "sydney", label: "Sydney" },
  { value: "mexico_city", label: "Mexico City" },
  { value: "cape_town", label: "Cape Town" },
  { value: "lagos", label: "Lagos" },
  { value: "moscow", label: "Moscow" },
  { value: "cairo", label: "Cairo" },
  { value: "riyadh", label: "Riyadh" },
  { value: "dubai", label: "Dubai" },
  { value: "istanbul", label: "Istanbul" },
  { value: "buenos_aires", label: "Buenos Aires" },
  { value: "stockholm", label: "Stockholm" },
  { value: "amsterdam", label: "Amsterdam" },
  { value: "jakarta", label: "Jakarta" },
];

// مصفوفة أكواد الدول مع الأعلام
const phoneCodes = [
  { code: "+1", country: "us", label: "United States" },
  { code: "+44", country: "gb", label: "United Kingdom" },
  { code: "+33", country: "fr", label: "France" },
  { code: "+49", country: "de", label: "Germany" },
  { code: "+39", country: "it", label: "Italy" },
  { code: "+34", country: "es", label: "Spain" },
  { code: "+86", country: "cn", label: "China" },
  { code: "+81", country: "jp", label: "Japan" },
  { code: "+82", country: "kr", label: "South Korea" },
  { code: "+91", country: "in", label: "India" },
  { code: "+55", country: "br", label: "Brazil" },
  { code: "+1", country: "ca", label: "Canada" },
  { code: "+61", country: "au", label: "Australia" },
  { code: "+52", country: "mx", label: "Mexico" },
  { code: "+27", country: "za", label: "South Africa" },
  { code: "+234", country: "ng", label: "Nigeria" },
  { code: "+7", country: "ru", label: "Russia" },
  { code: "+20", country: "eg", label: "Egypt" },
  { code: "+966", country: "sa", label: "Saudi Arabia" },
  { code: "+971", country: "ae", label: "UAE" },
  { code: "+90", country: "tr", label: "Turkey" },
  { code: "+54", country: "ar", label: "Argentina" },
  { code: "+46", country: "se", label: "Sweden" },
  { code: "+31", country: "nl", label: "Netherlands" },
  { code: "+62", country: "id", label: "Indonesia" },
].map((item) => ({
  value: item.code,
  label: (
    <div className="flex items-center gap-2">
      <img
        src={`https://flagcdn.com/24x18/${item.country}.png`}
        alt={item.label}
        className="w-5 h-4 rounded"
      />
      <span>
        {item.code} ({item.label})
      </span>
    </div>
  ),
}));
const faqs = [
  {
    question: "How can I order a product?",
    answer:
      "You can order a product by adding it to your cart and completing the checkout process.",
  },
  {
    question: "How can I add my project as a seller?",
    answer:
      "Register as a seller, fill in your project details, and wait for approval before publishing.",
  },
  {
    question: "How can I track my order?",
    answer:
      "You can track your order status from the 'Order History' section in your account.",
  },
  {
    question: "Are there any selling fees?",
    answer:
      "Yes, a small commission is applied to each sale to support the platform.",
  },
  {
    question: "Can I return a product?",
    answer:
      "Yes, products can be returned within 14 days if they are in their original condition.",
  },
];

const helpData = {
  buyers: {
    title: "Help for Buyers",
    faqs: [
      {
        question: "How to place an order?",
        answer:
          "Browse products, add them to your cart, then confirm your shipping and payment info.",
      },
      {
        question: "What are the payment methods?",
        answer:
          "We accept cards, mobile wallets, and cash on delivery (where available).",
      },
      {
        question: "How can I track my order?",
        answer:
          "Go to Settings > Order History to see status and tracking info.",
      },
    ],
  },
  sellers: {
    title: "Help for Sellers",
    faqs: [
      {
        question: "How to create a project/store?",
        answer:
          "Sign up as a seller and use the 'Create New Project' option to start.",
      },
      {
        question: "How to manage my products?",
        answer:
          "Go to your dashboard to add, update, or remove products anytime.",
      },
      {
        question: "How to handle orders?",
        answer:
          "View new orders in your dashboard, update their status, and mark as shipped.",
      },
    ],
  },
  technical: {
    title: "Technical Issues",
    faqs: [
      {
        question: "I forgot my password",
        answer:
          "Click 'Forgot Password' on login screen and follow the reset link.",
      },
      {
        question: "My account is locked",
        answer: "Wait 15 mins and try again or contact support for help.",
      },
      {
        question: "The app/website is not working",
        answer: "Try refreshing, check your connection, or contact support.",
      },
    ],
  },
};

const Settings = () => {
  const [selectedCountryAbbreviation, setSelectedCountryAbbreviation] =
    useState("");
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [activeTab, setActiveTab] = useState("account");
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    profileImage: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // ✅ إضافة states جديدة لإظهار/إخفاء كلمة المرور ورسائل الخطأ
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({
    current: "",
    new: "",
    confirm: "",
    general: "",
  });
  

  // Order states
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);
  const [displayName, setDisplayName] = useState("");

  console.log("Language changed to: ", i18n.language);

  // تغيير اللغة حسب الاختيار
  const languageOptions = [
    { value: "en", label: "English" },
    { value: "ar", label: "عربي" },
  ];

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const handleEditPicture = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setOpenIndex(null); // Reset accordion when selecting new card
  };
  const handleLogout = () => {
    // إزالة البيانات من localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData"); // إذا كان موجود
    localStorage.removeItem("userProfile"); // إذا كان موجود

    // إعادة توجيه للصفحة الرئيسية أو صفحة تسجيل الدخول
    navigate("/");
    window.location.reload();// أو navigate("/") حسب التطبيق

    // يمكن إضافة رسالة تأكيد (اختياري)
    // alert("تم تسجيل الخروج بنجاح");
  };
  const handleTrackOrder = (orderId) => {
    if (orderId) {
      navigate("/order-tracking", {
        state: { orderId: orderId },
      });
    } else {
      console.error("Order ID is missing");
      alert("معرف الطلب مفقود");
    }
  };
 const fetchNotifications = async () => {
   setNotificationsLoading(true);
   setNotificationsError(null);
   try {
     const token = localStorage.getItem("authToken");
     const response = await fetch(
       "https://shopyapi.runasp.net/api/Notification",
       {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
       }
     );

     if (!response.ok) {
       throw new Error("Failed to fetch notifications");
     }

     const data = await response.json();
     setNotifications(data);
   } catch (err) {
     setNotificationsError(err.message);
   } finally {
     setNotificationsLoading(false);
   }
 };

 // جلب عدد الإشعارات غير المقروءة
 const fetchUnreadCount = async () => {
   try {
     const token = localStorage.getItem("authToken");
     const response = await fetch(
       "https://shopyapi.runasp.net/api/Notification/unread/count",
       {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
       }
     );

     if (!response.ok) {
       throw new Error("Failed to fetch unread count");
     }

     const count = await response.json();
     setUnreadCount(count);
   } catch (err) {
     console.error("Error fetching unread count:", err);
   }
 };

 // تعليم الإشعار كمقروء
 const markAsRead = async (notificationId) => {
   try {
     const token = localStorage.getItem("authToken");
     const response = await fetch(
       `https://shopyapi.runasp.net/api/Notification/${notificationId}/read`,
       {
         method: "POST",
         headers: {
           Authorization: `Bearer ${token}`,
           "Content-Type": "application/json",
         },
       }
     );

     if (!response.ok) {
       throw new Error("Failed to mark notification as read");
     }

     // تحديث الإشعارات محلياً
     setNotifications((prev) =>
       prev.map((notification) =>
         notification.id === notificationId
           ? { ...notification, isRead: true }
           : notification
       )
     );

     // تحديث العداد
     setUnreadCount((prev) => Math.max(0, prev - 1));
   } catch (err) {
     console.error("Error marking notification as read:", err);
   }
 };

 // إضافة useEffect لجلب عدد الإشعارات غير المقروءة عند تحميل الكومبوننت
 useEffect(() => {
   fetchUnreadCount();
   // يمكنك إضافة interval لتحديث العدد كل فترة
   const interval = setInterval(fetchUnreadCount, 30000); // كل 30 ثانية
   return () => clearInterval(interval);
 }, []);

 // إضافة useEffect لجلب الإشعارات عند اختيار تبويب الإشعارات
 useEffect(() => {
   if (activeTab === "notifications") {
     fetchNotifications();
   }
 }, [activeTab]);

  // Fetch user orders
  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Order/user-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // إضافة function جديدة لتأكيد الاستلام
  const confirmDelivery = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Order/confirm-delivery?orderId=${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to confirm delivery");
      }

      const data = await response.json();
      alert(data.Message || "تم تأكيد الاستلام بنجاح!");

      // إعادة تحميل الطلبات لتحديث الحالة
      fetchUserOrders();

      // إغلاق modal التفاصيل
      setSelectedOrderDetails(null);
    } catch (err) {
      console.error("Error confirming delivery:", err);
      alert("فشل في تأكيد الاستلام: " + err.message);
    }
  };
  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Account/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setUserProfile({
        firstName: data.name?.split(" ")[0] || "",
        lastName: data.name?.split(" ")[1] || "",
        email: data.email || "",
        userName: data.userName || "",
        profileImage: data.imageUrl || "",
      });
      setDisplayName(data.name || data.userName || "User");

      // تحديث صورة البروفايل في الـ sidebar
      if (data.imageUrl && data.imageUrl !== "default-profile.jpg") {
        setProfileImage(data.imageUrl);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // تحديث بيانات المستخدم
  const updateUserProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("FirstName", userProfile.firstName);
      formData.append("LastName", userProfile.lastName);
      formData.append("Email", userProfile.email);
      formData.append("UserName", userProfile.userName);

      // إضافة الصورة إذا كانت موجودة
      if (fileInputRef.current && fileInputRef.current.files[0]) {
        formData.append("ProfileImage", fileInputRef.current.files[0]);
      }

      const response = await fetch(
        "https://shopyapi.runasp.net/api/Account/update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();
      alert(data.message || "Profile updated successfully!");
      const fullName =
        `${userProfile.firstName} ${userProfile.lastName}`.trim();
      setDisplayName(fullName || userProfile.userName || "User");
      // إعادة تحميل البيانات
      fetchUserProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  // ✅ إضافة function للتحقق من قوة كلمة المرور
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    return errors;
  };

  // ✅ إضافة function للتحقق من صحة البيانات في الوقت الفعلي
  const validatePasswordField = (field, value) => {
    let error = "";

    switch (field) {
      case "current":
        if (value.length === 0) {
          error = "Current password is required";
        }
        break;
      case "new":
        if (value.length === 0) {
          error = "New password is required";
        } else {
          const validationErrors = validatePassword(value);
          if (validationErrors.length > 0) {
            error = validationErrors[0]; // عرض أول خطأ فقط
          }
        }
        break;
      case "confirm":
        if (value.length === 0) {
          error = "Please confirm your new password";
        } else if (value !== passwordData.newPassword) {
          error = "Passwords do not match";
        }
        break;
    }

    setPasswordErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  // ✅ تحديث function تغيير كلمة المرور
  const changePassword = async (e) => {
    e.preventDefault();

    // إعادة تعيين رسائل الخطأ
    setPasswordErrors({
      current: "",
      new: "",
      confirm: "",
      general: "",
    });

    // التحقق من صحة البيانات
    let hasErrors = false;

    if (!passwordData.currentPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        current: "Current password is required",
      }));
      hasErrors = true;
    }

    if (!passwordData.newPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        new: "New password is required",
      }));
      hasErrors = true;
    } else {
      const validationErrors = validatePassword(passwordData.newPassword);
      if (validationErrors.length > 0) {
        setPasswordErrors((prev) => ({
          ...prev,
          new: validationErrors.join(". "),
        }));
        hasErrors = true;
      }
    }

    if (!passwordData.confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirm: "Please confirm your new password",
      }));
      hasErrors = true;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors((prev) => ({
        ...prev,
        confirm: "Passwords do not match",
      }));
      hasErrors = true;
    }

    if (hasErrors) return;

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        "https://shopyapi.runasp.net/api/Account/change-password",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            CurrentPassword: passwordData.currentPassword,
            NewPassword: passwordData.newPassword,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to change password";

        // تحديد نوع الخطأ
        if (response.status === 400) {
          setPasswordErrors((prev) => ({
            ...prev,
            current: "Current password is incorrect",
          }));
        } else {
          setPasswordErrors((prev) => ({ ...prev, general: errorMessage }));
        }
        return;
      }

      // نجح التغيير
      alert("Password changed successfully!");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({
        current: "",
        new: "",
        confirm: "",
        general: "",
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      });
    } catch (err) {
      console.error("Error changing password:", err);
      setPasswordErrors((prev) => ({
        ...prev,
        general: "Network error. Please try again.",
      }));
    } finally {
      setPasswordLoading(false);
    }
  };

  // ✅ إضافة function لإظهار/إخفاء كلمة المرور
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ✅ إضافة function لحساب قوة كلمة المرور
  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };

    let score = 0;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];

    score = checks.filter(Boolean).length;

    if (score <= 2)
      return { strength: score, label: "Weak", color: "bg-red-500" };
    if (score <= 3)
      return { strength: score, label: "Medium", color: "bg-yellow-500" };
    if (score <= 4)
      return { strength: score, label: "Good", color: "bg-blue-500" };
    return { strength: score, label: "Strong", color: "bg-green-500" };
  };
  
  
  const fetchOrderDetails = async (orderId) => {
    setLoadingDetails(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `https://shopyapi.runasp.net/api/Order/order-details/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      setSelectedOrderDetails(data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("Failed to load order details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // Fetch orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders") {
      fetchUserOrders();
    }
  }, [activeTab]);
  useEffect(() => {
    if (activeTab === "account") {
      fetchUserProfile();
    }
  }, [activeTab]);
  useEffect(() => {
    // جلب بيانات المستخدم عند تحميل الصفحة
    fetchUserProfile();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Account Settings
            </h1>

            {loadingProfile ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
              </div>
            ) : (
              <form
                onSubmit={updateUserProfile}
                className="space-y-6 max-w-2xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userProfile.firstName}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          firstName: e.target.value,
                        })
                      }
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
                      value={userProfile.lastName}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          lastName: e.target.value,
                        })
                      }
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
                    value={userProfile.email}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, email: e.target.value })
                    }
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
                    value={userProfile.userName}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        userName: e.target.value,
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                    required
                  />
                </div>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loadingProfile}
                    className="bg-red-800 text-white px-6 py-2 rounded-full hover:bg-red-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    {loadingProfile ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowChangePassword(true)}
                    className="bg-red-50 text-red-800 px-6 py-2 rounded-full hover:bg-red-700 hover:text-white transform hover:scale-105 transition-all duration-300"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}

            {/* ✅ Enhanced Change Password Modal */}
            {showChangePassword && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Change Password
                    </h2>
                    <button
                      onClick={() => {
                        setShowChangePassword(false);
                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordErrors({
                          current: "",
                          new: "",
                          confirm: "",
                          general: "",
                        });
                        setShowPasswords({
                          current: false,
                          new: false,
                          confirm: false,
                        });
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>

                  {/* عرض رسالة خطأ عامة */}
                  {passwordErrors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {passwordErrors.general}
                    </div>
                  )}

                  <form onSubmit={changePassword} className="space-y-5">
                    {/* Current Password */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => {
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            });
                            if (passwordErrors.current) {
                              validatePasswordField("current", e.target.value);
                            }
                          }}
                          onBlur={(e) =>
                            validatePasswordField("current", e.target.value)
                          }
                          className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 ${
                            passwordErrors.current
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.current ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {passwordErrors.current && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.current}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => {
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            });
                            if (passwordErrors.new) {
                              validatePasswordField("new", e.target.value);
                            }
                          }}
                          onBlur={(e) =>
                            validatePasswordField("new", e.target.value)
                          }
                          className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 ${
                            passwordErrors.new
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.new ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {passwordData.newPassword && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              Password Strength:
                            </span>
                            <span
                              className={`text-sm font-medium ${
                                getPasswordStrength(passwordData.newPassword)
                                  .strength <= 2
                                  ? "text-red-600"
                                  : getPasswordStrength(
                                      passwordData.newPassword
                                    ).strength <= 3
                                  ? "text-yellow-600"
                                  : getPasswordStrength(
                                      passwordData.newPassword
                                    ).strength <= 4
                                  ? "text-blue-600"
                                  : "text-green-600"
                              }`}
                            >
                              {
                                getPasswordStrength(passwordData.newPassword)
                                  .label
                              }
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                getPasswordStrength(passwordData.newPassword)
                                  .color
                              }`}
                              style={{
                                width: `${
                                  (getPasswordStrength(passwordData.newPassword)
                                    .strength /
                                    5) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {passwordErrors.new && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.new}
                        </p>
                      )}

                      {/* Password Requirements */}
                      <div className="mt-2 text-xs text-gray-600">
                        <p className="font-medium mb-1">
                          Password must contain:
                        </p>
                        <ul className="space-y-1">
                          <li
                            className={`flex items-center ${
                              passwordData.newPassword.length >= 8
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-2">
                              {passwordData.newPassword.length >= 8 ? "✓" : "○"}
                            </span>
                            At least 8 characters
                          </li>
                          <li
                            className={`flex items-center ${
                              /[A-Z]/.test(passwordData.newPassword)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-2">
                              {/[A-Z]/.test(passwordData.newPassword)
                                ? "✓"
                                : "○"}
                            </span>
                            One uppercase letter
                          </li>
                          <li
                            className={`flex items-center ${
                              /[a-z]/.test(passwordData.newPassword)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-2">
                              {/[a-z]/.test(passwordData.newPassword)
                                ? "✓"
                                : "○"}
                            </span>
                            One lowercase letter
                          </li>
                          <li
                            className={`flex items-center ${
                              /[0-9]/.test(passwordData.newPassword)
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-2">
                              {/[0-9]/.test(passwordData.newPassword)
                                ? "✓"
                                : "○"}
                            </span>
                            One number
                          </li>
                          <li
                            className={`flex items-center ${
                              /[!@#$%^&*(),.?":{}|<>]/.test(
                                passwordData.newPassword
                              )
                                ? "text-green-600"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="mr-2">
                              {/[!@#$%^&*(),.?":{}|<>]/.test(
                                passwordData.newPassword
                              )
                                ? "✓"
                                : "○"}
                            </span>
                            One special character
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block mb-2 font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => {
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            });
                            if (passwordErrors.confirm) {
                              validatePasswordField("confirm", e.target.value);
                            }
                          }}
                          onBlur={(e) =>
                            validatePasswordField("confirm", e.target.value)
                          }
                          className={`w-full p-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 ${
                            passwordErrors.confirm
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPasswords.confirm ? (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirm && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordErrors.confirm}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => {
                          setShowChangePassword(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                          setPasswordErrors({
                            current: "",
                            new: "",
                            confirm: "",
                            general: "",
                          });
                          setShowPasswords({
                            current: false,
                            new: false,
                            confirm: false,
                          });
                        }}
                        className="px-6 py-2 text-red-800 border border-red-800 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-6 py-2 bg-red-800 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        {passwordLoading && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {passwordLoading ? "Changing..." : "Change Password"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        );
      case "language":
        return (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Language & Appearance
            </h1>

            <div className="mb-8">
              <label className="block mb-3 font-medium text-gray-700 flex items-center gap-2">
                <FaGlobe className="text-red-800" />
                {t("Language")}
              </label>

              <Select
                options={languageOptions}
                value={languageOptions.find(
                  (option) => option.value === i18n.language
                )}
                onChange={(selectedOption) =>
                  i18n.changeLanguage(selectedOption.value)
                }
                className="w-60"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#d1d5db",
                    borderRadius: "0.375rem",
                    padding: "2px",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#991b1b" },
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? "#991b1b" : "white",
                    color: state.isSelected ? "white" : "black",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#1f2937",
                  }),
                }}
              />
            </div>

            <div className="flex items-center gap-2 mt-4">
              <label className="block font-medium text-gray-700 flex items-center gap-2">
                <FaMoon className="text-red-800" /> {t("Dark Mode")}
              </label>
              <label className="relative inline-flex items-center cursor-pointer ml-20">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-800 transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        );

     

      case "orders":
        return (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Order History
            </h1>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-red-600 mb-4">
                  <FaBoxOpen className="text-5xl mx-auto mb-4" />
                  <p className="text-lg mb-2">Error loading orders</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={fetchUserOrders}
                  className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center text-red-800 pt-16">
                <FaBoxOpen className="text-5xl mx-auto mb-4 text-red-800" />
                <p className="text-lg mb-2">No orders have been placed yet.</p>
                <p className="text-sm text-gray-600">
                  Start shopping to see your orders here!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
                  >
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              Order #{order.orderId}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed on{" "}
                              {new Date(order.orderDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            ${order.totalPrice.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">Total</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => fetchOrderDetails(order.orderId)}
                            disabled={loadingDetails}
                            className="px-4 py-2 text-sm bg-red-800 text-white rounded-full hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {loadingDetails ? "Loading..." : "View Details"}
                          </button>
                          <button
                            onClick={() => handleTrackOrder(order.orderId)}
                            className="px-4 py-2 text-sm text-red-800 bg-white border border-red-800 rounded-full hover:bg-red-800 hover:text-white transition-colors
"
                          >
                            Order Tracking
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedOrderDetails && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="bg-red-800 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                      Order Details #{selectedOrderDetails.orderId}
                    </h2>
                    <button
                      onClick={() => setSelectedOrderDetails(null)}
                      className="text-white hover:text-gray-200 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Order Information
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Order Date:</span>{" "}
                            {new Date(
                              selectedOrderDetails.createdAt
                            ).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{" "}
                            {selectedOrderDetails.status}
                          </p>
                          {selectedOrderDetails.appliedPromoCode && (
                            <p>
                              <span className="font-medium">Promo Code:</span>{" "}
                              {selectedOrderDetails.appliedPromoCode}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Pricing Details
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Total Price:</span> $
                            {selectedOrderDetails.totalPrice.toFixed(2)}
                          </p>
                          {selectedOrderDetails.discountPercentage > 0 && (
                            <p>
                              <span className="font-medium">Discount:</span>{" "}
                              {selectedOrderDetails.discountPercentage}% (
                              {selectedOrderDetails.discountType})
                            </p>
                          )}
                          {selectedOrderDetails.firstOrderDiscountPercentage >
                            0 && (
                            <p>
                              <span className="font-medium">
                                First Order Discount:
                              </span>{" "}
                              {
                                selectedOrderDetails.firstOrderDiscountPercentage
                              }
                              % ($
                              {selectedOrderDetails.firstOrderDiscountAmount.toFixed(
                                2
                              )}
                              )
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedOrderDetails.status === "Shipped" && (
                      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-800 mb-1">
                              Ready to Confirm Delivery?
                            </h4>
                            <p className="text-sm text-gray-600">
                              Click below once you've received your order to
                              confirm delivery.
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              confirmDelivery(selectedOrderDetails.orderId)
                            }
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            Confirm Delivery
                          </button>
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-4">
                        Products
                      </h3>
                      <div className="space-y-4">
                        {selectedOrderDetails.products.map((product, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-shrink-0">
                                {product.images && product.images.length > 0 ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.productName}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      No Image
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 mb-2">
                                  {product.productName}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-600">
                                      Quantity:
                                    </span>
                                    <p>{product.quantity}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">
                                      Original Price:
                                    </span>
                                    <p>${product.originalPrice.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">
                                      Final Price:
                                    </span>
                                    <p>${product.finalPrice.toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">
                                      Subtotal:
                                    </span>
                                    <p className="font-semibold">
                                      ${product.subtotal.toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "FAQ":
        return (
          <div className="flex flex-col md:flex-row gap-10 p-6">
            <div className="flex-1 space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className={`rounded-xl p-5 shadow-md transition-all duration-300 border ${
                      isOpen
                        ? "bg-red-100 border-red-300"
                        : "bg-white border-gray-200"
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

            <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center space-y-4">
              <img
                src={faqImage}
                alt="FAQ"
                className="w-40 h-40 rounded-full mx-auto object-cover"
              />
              <h2 className="text-2xl font-bold text-red-800">
                Any Questions?
              </h2>
              <p className="text-sm text-gray-500">
                We can answer anything you want to know
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="bg-red-800 text-white px-6 py-2 rounded-full transition-all duration-300 hover:bg-red-600 hover:scale-105"
              >
                Contact Us
              </button>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="p-6 max-w-5xl mx-auto bg-white">
            <h2 className="text-3xl font-bold text-red-800 mb-4">
              PRIVACY POLICY
            </h2>
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-10">
              Our personal statement, cookies, third-parties
            </p>

            <div className="space-y-6 divide-y divide-gray-200">
              <div className="grid md:grid-cols-3 gap-4 py-4">
                <h3 className="text-red-800 font-semibold">
                  Respect for Your Privacy
                </h3>
                <div className="md:col-span-2 text-gray-800 text-sm">
                  We are committed to respecting your privacy and protecting
                  your personal data.
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 py-4">
                <h3 className="text-red-800 font-semibold">
                  What Data We Collect
                </h3>
                <div className="md:col-span-2 text-gray-800 text-sm space-y-1">
                  <ul className="list-disc list-inside">
                    <li>Account information (name, email, etc.).</li>
                    <li>Order and usage history.</li>
                    <li>Cookies for personalization and analytics.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="grid md:grid-cols-3 gap-4 py-4">
                <h3 className="text-red-800 font-semibold">
                  How We Use Your Data
                </h3>
                <div className="md:col-span-2 text-gray-800 text-sm space-y-1">
                  <ul className="list-disc list-inside">
                    <li>To improve and personalize our service.</li>
                    <li>To communicate with you about orders or support.</li>
                    <li>For security and fraud prevention.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="grid md:grid-cols-3 gap-4 py-4">
                <h3 className="text-red-800 font-semibold">Data Sharing</h3>
                <div className="md:col-span-2 text-gray-800 text-sm space-y-1">
                  <p>
                    We do not share your personal data with third parties
                    except:
                  </p>
                  <ul className="list-disc list-inside">
                    <li>
                      With service providers helping us operate the platform.
                    </li>
                    <li>When required by law or to protect rights.</li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="grid md:grid-cols-3 gap-4 py-4">
                <h3 className="text-red-800 font-semibold">Data Protection</h3>
                <div className="md:col-span-2 text-gray-800 text-sm">
                  Your data is stored securely with encryption and limited
                  access.
                </div>
              </div>

              {/* Section 6 */}
              <div className="grid md:grid-cols-3 gap-4 py-4">
                <h3 className="text-red-800 font-semibold">Your Rights</h3>
                <div className="md:col-span-2 text-gray-800 text-sm">
                  You have the right to view, edit, or delete your personal
                  information. You may also delete your account at any time.
                </div>
              </div>

              {/* Section 7 */}
              <div className="grid md:grid-cols-3 gap-4 py-4">
                <h3 className="text-red-800 font-semibold">Policy Updates</h3>
                <div className="md:col-span-2 text-gray-800 text-sm">
                  We may update this policy. You will be notified of any
                  significant changes.
                </div>
              </div>
            </div>
          </div>
        );

      case "help":
        return (
          <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-center text-3xl font-bold text-red-800 mb-8">
              Hello, how can we help?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Buyers Card */}
              <div
                onClick={() => handleCardClick("buyers")}
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border transition-all duration-300 transform ${
                  selectedCard === "buyers"
                    ? "border-red-800 scale-105"
                    : "border-gray-200 scale-100"
                }`}
              >
                <div className="p-6 flex flex-col items-center justify-center">
                  <FaShoppingCart className="text-red-800 text-4xl mb-3" />
                  <h3 className="text-red-800 font-bold text-lg">For Buyers</h3>
                </div>
              </div>

              {/* Sellers Card */}
              <div
                onClick={() => handleCardClick("sellers")}
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border transition-all duration-300 transform ${
                  selectedCard === "sellers"
                    ? "border-red-800 scale-105"
                    : "border-gray-200 scale-100"
                }`}
              >
                <div className="p-6 flex flex-col items-center justify-center">
                  <FaStore className="text-red-800 text-4xl mb-3" />
                  <h3 className="text-red-800 font-bold text-lg">
                    For Sellers
                  </h3>
                </div>
              </div>

              {/* Technical Card */}
              <div
                onClick={() => handleCardClick("technical")}
                className={`bg-white rounded-xl shadow-md overflow-hidden cursor-pointer border transition-all duration-300 transform ${
                  selectedCard === "technical"
                    ? "border-red-800 scale-105"
                    : "border-gray-200 scale-100"
                }`}
              >
                <div className="p-6 flex flex-col items-center justify-center">
                  <FaTools className="text-red-800 text-4xl mb-3" />
                  <h3 className="text-red-800 font-bold text-lg">
                    Technical Issues
                  </h3>
                </div>
              </div>
            </div>

            {/* FAQs Section */}
            {selectedCard && (
              <div className="mt-10 text-center">
                <h3 className="text-red-800 text-xl font-bold mb-4">
                  {selectedCard === "buyers"
                    ? "For Buyers"
                    : selectedCard === "sellers"
                    ? "For Sellers"
                    : "Technical Issues"}
                </h3>

                <ul className="max-w-2xl mx-auto space-y-4 text-left">
                  {helpData[selectedCard]?.faqs.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                      <li
                        key={index}
                        className={`rounded-xl p-5 shadow-md transition-all duration-300 border ${
                          isOpen
                            ? "bg-red-100 border-red-300"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div
                          onClick={() => toggleAccordion(index)}
                          className="flex justify-between items-center cursor-pointer"
                        >
                          <h3 className="text-base font-semibold text-red-800">
                            {item.question}
                          </h3>
                          <div className="text-red-800 text-lg">
                            {isOpen ? <FaMinus /> : <FaPlus />}
                          </div>
                        </div>
                        {isOpen && (
                          <p className="mt-4 text-sm text-gray-700">
                            {item.answer}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Contact Us Section */}
            <div className="mt-16 text-center">
              <h3 className="text-red-800 text-xl font-bold mb-2">
                Didn't find an answer to your question?
              </h3>
              <p className="text-gray-600 mb-6">
                Get in touch with us for details on additional services and
                custom work pricing
              </p>
              <button
                onClick={() => (window.location.href = "/contact")}
                className="bg-red-800 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                CONTACT US
              </button>
            </div>
          </div>
        );

      case "terms":
        return (
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
                  <h3 className="text-red-800 font-semibold mb-1">
                    Introduction
                  </h3>
                  <p>
                    This platform is created to connect users for buying and
                    selling products or services. Our goal is to provide a safe
                    and efficient experience for everyone.
                  </p>
                </section>

                <section>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Terms of Use
                  </h3>
                  <p>
                    Users must be 18+ or have parental consent to use the
                    platform. Any content shared must be lawful, respectful, and
                    truthful.
                  </p>
                </section>

                <section>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Content Usage
                  </h3>
                  <p>
                    Content on this site may not be copied, resold, or
                    redistributed without permission. It's only allowed for
                    personal or authorized use.
                  </p>
                </section>

                <section>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Prohibited Uses
                  </h3>
                  <p>
                    Illegal use, site manipulation, spamming, fraud, or hacking
                    are strictly forbidden.
                  </p>
                </section>

                <section>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Intellectual Property
                  </h3>
                  <p>
                    All content, logos, and trademarks belong to the platform
                    unless stated otherwise. Reproduction without consent is not
                    allowed.
                  </p>
                </section>

                <section>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Buying & Selling Policy
                  </h3>
                  <p>
                    Users are responsible for fulfilling their part of any
                    transaction. The platform provides a medium, not a
                    guarantee.
                  </p>
                </section>

                <section>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Disclaimer
                  </h3>
                  <p>
                    We are not liable for external transactions, third-party
                    errors, or disputes between buyers and sellers.
                  </p>
                </section>

                <section>
                  <h3 className="text-red-800 font-semibold mb-1">
                    Changes to Terms
                  </h3>
                  <p>
                    The platform may update these terms at any time. Continued
                    use implies acceptance of any modifications.
                  </p>
                </section>
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-6 space-x-4">
                
                <button className="bg-red-800 text-white px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 hover:bg-red-700">
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
        );
      case "notifications":
        return (
          <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>

            {notificationsLoading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
              </div>
            ) : notificationsError ? (
              <div className="text-center py-16">
                <div className="text-red-600 mb-4">
                  <FaBell className="text-5xl mx-auto mb-4" />
                  <p className="text-lg mb-2">Error loading notifications</p>
                  <p className="text-sm">{notificationsError}</p>
                </div>
                <button
                  onClick={fetchNotifications}
                  className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-16 text-center space-y-6">
                <FaBell className="text-red-800 text-6xl " />
                <h2 className="text-xl font-semibold text-gray-700">
                  No Notifications Yet
                </h2>
                <p className="text-gray-500 max-w-md">
                  You're all caught up! Notifications will appear here when
                  there's something new for you.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
                      notification.isRead
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-200 shadow-sm"
                    }`}
                    onClick={() =>
                      !notification.isRead && markAsRead(notification.id)
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3
                            className={`font-semibold ${
                              notification.isRead
                                ? "text-gray-800"
                                : "text-blue-800"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p
                          className={`text-sm mb-2 ${
                            notification.isRead
                              ? "text-gray-600"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

   const navItem = (id, icon, label, description) => (
    
    <li
      onClick={() => setActiveTab(id)}
      className={`cursor-pointer ${activeTab === id ? "text-gray-300" : ""}`}
    >
      <div className="flex items-center gap-3 font-medium relative">
        {icon} 
        {label}
        {id === "notifications" && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      <p className="ml-7 text-gray-200 text-xs">{description}</p>
    </li>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-red-800 text-white py-8 px-6 space-y-6">
        <div className="flex flex-col items-center p-4">
          <div className="relative w-24 h-24">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-red-800 text-4xl">
                <FaUser />
              </div>
            )}
            <div
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer hover:bg-gray-200"
              onClick={handleEditPicture}
            >
              <FaCamera className="text-red-800" />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <h2 className="mt-2 font-semibold text-white">
            {" "}
            {displayName || "User"}
          </h2>
        </div>
        <ul className="space-y-6 text-sm">
          {navItem(
            "account",
            <FaUser />,
            "Account Information",
            "Manage your name, email, and password"
          )}
          {navItem(
            "language",
            <FaLanguage />,
            "Language & Appearance",
            "Change language or switch to dark mode"
          )}
          {/* {navItem(
            "shipping",
            <FaMapMarkerAlt />,
            "Shipping Information",
            "Update your delivery address and contact info"
          )} */}
          {navItem(
            "orders",
            <FaClipboardList />,
            "Order History",
            "Review your recent orders"
          )}

          {/* New Static Pages */}
          {navItem(
            "FAQ",
            <FaQuestionCircle />,
            "FAQ",
            "Common questions and answers"
          )}
          {navItem(
            "privacy",
            <FaShieldAlt />,
            "Privacy Policy",
            "How we handle your data"
          )}
          {navItem(
            "terms",
            <FaFileContract />,
            "Terms & Conditions",
            "Rules of using the platform"
          )}
          {navItem(
            "help",
            <FaLifeRing />,
            "Help Center",
            "Get support or contact us"
          )}
          {navItem(
            "notifications",
            <FaBell />,
            "Notifications",
            "View alerts and updates"
          )}
          <li className="mt-6">
            <Link
              to="/loyalty-discount"
              className="flex items-center gap-3 text-red-200 font-medium hover:text-white transition-colors duration-200"
            >
              <FaGift /> Loyalty Discount
            </Link>
            <p className="ml-7 text-red-200 text-xs">
              View your loyalty level and active coupon
            </p>
          </li>

          {/* Logout */}
          <li className="mt-6">
            <div
              className="flex items-center gap-3 text-red-200 font-medium cursor-pointer hover:text-white transition-colors duration-200"
              onClick={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </div>
            <p className="ml-7 text-red-200 text-xs">
              Sign out from your account
            </p>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">{renderContent()}</div>
    </div>
  );
};

export default Settings;
