import React, { useState } from "react";

const ChatBotDemo = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
    { from: "user", text: "I'm looking for Flowers." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: "bot", text: "We have a great collection! Check out our shop." },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold text-red-800 mb-6">
        Start Chatting with Us!
      </h2>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg flex flex-col justify-between h-[600px] p-6">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl text-base max-w-[80%] ${
                msg.from === "user"
                  ? "bg-red-100 self-end ml-auto text-right"
                  : "bg-gray-100 self-start mr-auto text-left"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="flex items-center border-2 border-red-800 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 outline-none text-black text-base"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="ml-3 text-white bg-red-800 hover:bg-red-700 px-6 py-2 rounded-full transition text-lg"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotDemo;
