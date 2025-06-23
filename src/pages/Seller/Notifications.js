import React from "react";
import { FaBell } from "react-icons/fa";

// بيانات افتراضية (ممكن تستبدليها بـ API أو Redux لاحقاً)
const dummyNotifications = [
  {
    id: 1,
    message: "Your order #O125 has been delivered successfully!",
  },
  {
    id: 2,
    message: "Your order #O128 is out for delivery.",
  },
];

const Notifications = () => {
  const notifications = dummyNotifications; // ← غيريها حسب مصدر البيانات

  const handleNotificationClick = () => {
    // مثال: التنقل أو فتح مودال
    alert("Redirect to order or review page...");
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-semibold text-center text-[#7a0d0d] mb-6">
        Notifications
      </h2>

      <div className="relative">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 text-center space-y-6">
            <FaBell className="text-red-800 text-6xl" />
            <h2 className="text-lg font-semibold text-red-800">No Notifications Yet</h2>
            <p className="text-sm text-gray-700">
              You're all caught up! Notifications will appear here when there's something new.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 p-4 bg-white rounded-lg shadow hover:bg-gray-50 cursor-pointer transition"
                onClick={handleNotificationClick}
              >
                <FaBell className="text-red-800 text-xl mt-1" />
                <div>
                  <p className="text-red-800 font-semibold">{notification.message}</p>
                  <p className="text-gray-500 text-sm">Tap to rate your order</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
