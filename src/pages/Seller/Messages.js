import React, { useState } from "react";
import {
  FaEnvelope,
  FaPaperPlane,
  FaInbox,
  FaUserCircle,
} from "react-icons/fa";

const dummyMessages = [
  {
    id: 1,
    name: "Fatou Lab",
    email: "fatou@example.com",
    avatar: "",
    subject: "Need Webdesign Project For A Company",
    content: "Dear Mr. Hossam,\nLorem ipsum dolor sit amet, consectetur adipiscing elit...",
    attachments: ["Landing Page Concept.zip", "Fatou_Lab_Brandbook.pdf"],
    read: false,
  },
  {
    id: 2,
    name: "Mina Adel",
    email: "mina@example.com",
    avatar: "",
    subject: "Meeting Reminder",
    content: "Don't forget the meeting at 10 AM tomorrow.",
    attachments: [],
    read: true,
  },
];

const Messages = () => {
  const [overallMessages, setOverallMessages] = useState(dummyMessages.length);
  const [sentMessages, setSentMessages] = useState(0);
  const [receivedMessages, setReceivedMessages] = useState(dummyMessages.length);
  const [activeTab, setActiveTab] = useState("unread");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState("");

  const filteredMessages = dummyMessages.filter((msg) =>
    activeTab === "unread" ? !msg.read : msg.read
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <FaEnvelope className="text-[#800000] text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Overall Messages</p>
            <p className="text-xl font-bold text-[#800000]">{overallMessages}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <FaPaperPlane className="text-[#800000] text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Sent Messages</p>
            <p className="text-xl font-bold text-[#800000]">{sentMessages}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 flex items-center space-x-4">
          <FaInbox className="text-[#800000] text-3xl" />
          <div>
            <p className="text-gray-500 text-sm">Received Messages</p>
            <p className="text-xl font-bold text-[#800000]">{receivedMessages}</p>
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
                Unread
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold ${
                  activeTab === "read"
                    ? "bg-[#800000] text-white"
                    : "bg-white text-[#800000]"
                }`}
                onClick={() => setActiveTab("read")}
              >
                Read
              </button>
            </div>
          </div>

          {/* Sidebar Messages */}
          <div className="p-4 space-y-3">
            {filteredMessages.length === 0 ? (
              <p className="text-gray-500 text-center">No messages</p>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-100 rounded"
                >
                  <FaUserCircle className="text-3xl text-gray-500 mr-3" />
                  <div>
                    <p className="font-semibold">{msg.name}</p>
                    <p className="text-sm text-gray-500">{msg.subject}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {selectedMessage ? (
            <>
              <div className="flex items-center space-x-4">
                <FaUserCircle className="text-4xl text-gray-600" />
                <div>
                  <h3 className="text-lg font-bold">{selectedMessage.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                </div>
              </div>
              <hr className="my-4" />
              <h4 className="text-lg font-bold mb-2">{selectedMessage.subject}</h4>
              <p className="whitespace-pre-line text-gray-700">
                {selectedMessage.content}
              </p>

              {/* Attachments */}
              {selectedMessage.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {selectedMessage.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-100 rounded flex items-center justify-between"
                    >
                      <span>{file}</span>
                      <button className="text-sm text-[#800000] font-semibold hover:underline">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Box */}
              <div className="mt-6">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your message..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]"
                />
                <div className="text-right mt-3">
                  <button
                    className="bg-[#800000] hover:bg-[#a94444] text-white px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105"
                    onClick={() => {
                      if (reply.trim()) {
                        alert("Message sent!");
                        setSentMessages(sentMessages + 1);
                        setReply("");
                      }
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Select a message to view</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
