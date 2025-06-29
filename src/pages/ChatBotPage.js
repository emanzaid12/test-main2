import React, { useState } from "react";

const ChatBotDemo = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessageToApi = async (messageText) => {
    try {
      setLoading(true);
      const response = await fetch("https://shopyapi.runasp.net/api/ChatChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          word: messageText,
          top: 10
        })
      });

      if (!response.ok) {
        throw new Error("Error from server");
      }

      const responseText = await response.text();

      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch {
        parsed = responseText;
      }

      if (typeof parsed === "object") {
        if (Array.isArray(parsed.results)) {
          return parsed.results;
        }
        return [parsed];
      }

      return [{ name: parsed }];
    } catch (error) {
      console.error(error);
      return [{ name: "Sorry, there was an error." }];
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);

    const botReplies = await sendMessageToApi(userMessage);

    setMessages((prev) => [
      ...prev,
      ...botReplies.map((item) => ({
        from: "bot",
        name: item.name || item.word || "No name",
        image: Array.isArray(item.imageUrls) ? item.imageUrls[0] : null,
        price: item.price || null,
        category: item.category || null
      }))
    ]);
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
              {/* لو في صورة ومعلومات */}
              {msg.image || msg.price || msg.category ? (
                <div>
                  <div className="font-semibold text-lg mb-2">{msg.name}</div>
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Result"
                      className="rounded-lg mb-2 max-h-48 w-auto"
                    />
                  )}
                  {msg.price && (
                    <div className="text-sm text-gray-700">
                      💵 Price: {msg.price} EGP
                    </div>
                  )}
                  {msg.category && (
                    <div className="text-sm text-gray-500">
                      🗂️ Category: {msg.category}
                    </div>
                  )}
                </div>
              ) : (
                <div>{msg.text}</div>
              )}
            </div>
          ))}
          {loading && (
            <div className="p-4 rounded-xl bg-gray-100 self-start mr-auto text-left">
              Typing...
            </div>
          )}
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
            disabled={loading}
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
