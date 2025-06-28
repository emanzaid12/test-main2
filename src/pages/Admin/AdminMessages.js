import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPaperPlane,
  FaInbox,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";

const Messages = () => {
  const [overallMessages, setOverallMessages] = useState(0);
  const [sentMessages, setSentMessages] = useState(0);
  const [receivedMessages, setReceivedMessages] = useState(0);
  const [activeTab, setActiveTab] = useState("unread");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMessageDetails, setSelectedMessageDetails] = useState(null);
  const [reply, setReply] = useState("");
  const [messages, setMessages] = useState({ unread: [], read: [] });
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Base API URL
  const API_BASE = "https://shopyapi.runasp.net/api/Contact";

  // Get auth token (you'll need to implement this based on your auth system)
  const getAuthToken = () => {
    // Replace this with your actual token retrieval logic
    return localStorage.getItem("authToken") || "your-auth-token-here";
  };

  // Fetch messages statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/messages/statistics`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch statistics");

      const data = await response.json();
      setOverallMessages(data.totalMessages);
      setSentMessages(data.repliedMessages);
      setReceivedMessages(data.receivedButNotReplied);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to load statistics");
    }
  };

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/messages`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      setMessages({
        unread: data.unreadMessages || [],
        read: data.readMessages || [],
      });
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Fetch message details
  const fetchMessageDetails = async (messageId) => {
    try {
      const response = await fetch(`${API_BASE}/admin/messages/${messageId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch message details");

      const data = await response.json();
      setSelectedMessageDetails(data);

      // Refresh messages to update read status
      fetchMessages();
      fetchStatistics();
    } catch (err) {
      console.error("Error fetching message details:", err);
      setError("Failed to load message details");
    }
  };

  // Send reply
  const sendReply = async () => {
    if (!reply.trim() || !selectedMessage) return;

    try {
      setSending(true);
      const response = await fetch(`${API_BASE}/admin/reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MessageId: selectedMessage.messageId,
          AdminReply: reply,
        }),
      });

      if (!response.ok) throw new Error("Failed to send reply");

      const data = await response.json();
      //  alert(data.message || "Reply sent successfully!");
      setReply("");

      // Refresh data
      fetchMessages();
      fetchStatistics();
      if (selectedMessage) {
        fetchMessageDetails(selectedMessage.messageId);
      }
    } catch (err) {
      //console.error("Error sending reply:", err);
      //alert("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  // Handle message selection
  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    fetchMessageDetails(message.messageId);
  };

  // Load data on component mount
  useEffect(() => {
    fetchMessages();
    fetchStatistics();
  }, []);

  const filteredMessages =
    activeTab === "unread" ? messages.unread : messages.read;

  if (loading && !messages.unread.length && !messages.read.length) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <FaSpinner className="animate-spin text-2xl text-[#800000]" />
          <span>Loading messages...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <FaEnvelope className="text-[#800000] text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Overall Messages</p>
            <p className="text-xl font-bold text-[#800000]">
              {overallMessages}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <FaPaperPlane className="text-[#800000] text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Replied Messages</p>
            <p className="text-xl font-bold text-[#800000]">{sentMessages}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <FaInbox className="text-[#800000] text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Pending Messages</p>
            <p className="text-xl font-bold text-[#800000]">
              {receivedMessages}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Layout */}
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-[#800000] text-xl font-bold">Messages</h2>
            <div className="flex border border-[#800000] rounded-full overflow-hidden">
              <button
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === "unread"
                    ? "bg-[#800000] text-white"
                    : "bg-white text-[#800000]"
                }`}
                onClick={() => setActiveTab("unread")}
              >
                Unread ({messages.unread.length})
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === "read"
                    ? "bg-[#800000] text-white"
                    : "bg-white text-[#800000]"
                }`}
                onClick={() => setActiveTab("read")}
              >
                Read ({messages.read.length})
              </button>
            </div>
          </div>

          {/* Sidebar Messages */}
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages</p>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.messageId}
                  onClick={() => handleMessageClick(msg)}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded transition-colors ${
                    selectedMessage?.messageId === msg.messageId
                      ? "bg-gray-100"
                      : ""
                  }`}
                >
                  {msg.imageProfile ? (
                    <img
                      src={msg.imageProfile}
                      alt={msg.userName}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-500 mr-3" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{msg.userName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(msg.sentAtDateTime).toLocaleDateString()}
                    </p>
                  </div>
                  {!msg.isReadByAdmin && (
                    <div className="w-2 h-2 bg-[#800000] rounded-full"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {selectedMessageDetails ? (
            <>
              <div className="flex items-center space-x-4 mb-4">
                {selectedMessageDetails.imageProfile ? (
                  <img
                    src={selectedMessageDetails.imageProfile}
                    alt={selectedMessageDetails.userName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-4xl text-gray-600" />
                )}
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedMessageDetails.userName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedMessageDetails.email}
                  </p>
                  <p className="text-xs text-gray-400">
                    Sent: {selectedMessageDetails.sentAt}
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              <h4 className="text-lg font-bold mb-2">
                {selectedMessageDetails.subject}
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="whitespace-pre-line text-gray-700">
                  {selectedMessageDetails.message}
                </p>
              </div>

              {/* Previous Admin Reply */}
              {selectedMessageDetails.adminReply &&
                selectedMessageDetails.adminReply !==
                  "No Response until now" && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-[#800000] mb-2">
                      Previous Reply:
                    </h5>
                    <div className="bg-[#800000] bg-opacity-10 p-4 rounded-lg">
                      <p className="text-gray-700">
                        {selectedMessageDetails.adminReply}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Replied: {selectedMessageDetails.repliedAt}
                      </p>
                    </div>
                  </div>
                )}

              {/* Reply Box */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply to this message:
                </label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000] h-32 resize-none"
                  disabled={sending}
                />
                <div className="text-right mt-3">
                  <button
                    className="bg-[#800000] hover:bg-[#a94444] text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    onClick={sendReply}
                    disabled={sending || !reply.trim()}
                  >
                    {sending ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Reply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : selectedMessage ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin text-2xl text-[#800000]" />
              <span className="ml-2">Loading message details...</span>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <FaEnvelope className="text-6xl mx-auto mb-4 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
