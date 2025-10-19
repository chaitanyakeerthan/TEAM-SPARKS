import React, { useState } from "react";
import "./Chatbot.css";
import { getGeminiResponse } from "./getGeminiResponse";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en-US");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const botResponse = await getGeminiResponse(input, lang);

      if (!botResponse || !botResponse.text) {
        throw new Error("No response from AI agent.");
      }

      const botMsg = {
        sender: "bot",
        text: botResponse.text,
        audio: botResponse.audio || null,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Network issue, please try again shortly." },
      ]);
      setError("Network issue, please try again shortly.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (base64Audio) => {
    try {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audio.play();
    } catch (err) {
      console.error("Audio playback failed:", err);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button className="chat-toggle" onClick={() => setOpen(!open)}>
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbox">
          <div className="chat-header">🌾 Crop Pulse AI</div>

          <div className="chat-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`msg ${msg.sender === "user" ? "user" : "bot"}`}
              >
                <p>{msg.text}</p>
                {msg.audio && msg.sender === "bot" && (
                  <button
                    className="play-audio"
                    onClick={() => handlePlayAudio(msg.audio)}
                  >
                    🔊
                  </button>
                )}
              </div>
            ))}
            {loading && <p className="loading">Thinking...</p>}
            {error && <p className="error">{error}</p>}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about crops, soil, or weather..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;