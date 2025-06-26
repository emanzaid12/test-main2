import React, { useState, useEffect } from "react";
import {
  FaBell,
  FaSpinner,
  FaCheck,
  FaExclamationTriangle,
  FaEye,
} from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAsRead, setMarkingAsRead] = useState({});

  // Base API URL
  const API_BASE = "https://shopyapi.runasp.net/api/Notification";

  // Mock token - في التطبيق الحقيقي، احصل عليه من localStorage أو Context
  const getAuthToken = () => {
    // استبدل هذا بالطريقة الصحيحة للحصول على التوكن
    return localStorage.getItem("authToken") || "your-jwt-token-here";
  };

  // Fetch headers with authorization
  const getHeaders = () => ({
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  });

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNotifications(data);
      setError(null);
    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${API_BASE}/unread/count`, {
        headers: getHeaders(),
      });

      if (response.ok) {
        const count = await response.json();
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    if (markingAsRead[id]) return; // Prevent multiple clicks

    try {
      setMarkingAsRead((prev) => ({ ...prev, [id]: true }));

      const response = await fetch(`${API_BASE}/${id}/read`, {
        method: "POST",
        headers: getHeaders(),
      });

      if (response.ok) {
        // Update the notification in local state
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === id
              ? { ...notification, isRead: true }
              : notification
          )
        );

        // Update unread count
        fetchUnreadCount();
      } else {
        throw new Error("Failed to mark as read");
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
      alert("Error marking notification as read");
    } finally {
      setMarkingAsRead((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FaSpinner className="text-red-800 text-4xl animate-spin mb-4" />
          <p className="text-red-800 font-medium">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <FaExclamationTriangle className="text-red-600 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Notifications
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <FaBell className="text-red-800 text-3xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-red-800">Notifications</h2>
          </div>
          <button
            onClick={() => {
              fetchNotifications();
              fetchUnreadCount();
            }}
            className="px-4 py-2 bg-white text-red-800 border-2 border-red-800 rounded-lg hover:bg-red-800 hover:text-white transition-all duration-300 font-medium"
          >
            Refresh
          </button>
        </div>

        {/* Notifications Count */}
        {notifications.length > 0 && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border-r-4 border-red-800">
            <p className="text-red-800 font-medium">
              You have {notifications.length} notifications, {unreadCount}{" "}
              unread
            </p>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg text-center space-y-6">
              <div className="bg-red-100 p-6 rounded-full">
                <FaBell className="text-red-800 text-6xl" />
              </div>
              <h2 className="text-2xl font-bold text-red-800">
                No Notifications
              </h2>
              <p className="text-gray-600 text-lg max-w-md">
                You're all caught up! Notifications will appear here when
                there's something new.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 bg-white rounded-xl shadow-md border-l-4 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                  notification.isRead
                    ? "border-gray-300 opacity-75"
                    : "border-red-600 ring-2 ring-red-100"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      notification.isRead ? "bg-gray-100" : "bg-red-100"
                    }`}
                  >
                    <FaBell
                      className={`text-xl ${
                        notification.isRead ? "text-gray-500" : "text-red-800"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className={`font-bold text-lg ${
                          notification.isRead ? "text-gray-700" : "text-red-800"
                        }`}
                      >
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      )}
                    </div>

                    <p
                      className={`mb-3 leading-relaxed ${
                        notification.isRead ? "text-gray-600" : "text-gray-800"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </span>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          disabled={markingAsRead[notification.id]}
                          className="flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {markingAsRead[notification.id] ? (
                            <>
                              <FaSpinner className="text-sm animate-spin" />
                              <span>Updating...</span>
                            </>
                          ) : (
                            <>
                              <FaEye className="text-sm" />
                              <span>Mark as Read</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
