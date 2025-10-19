// App.jsx
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginWrapper from "./components/LoginWrapper";
import SignUpWrapper from "./components/SignUpWrapper";
import Home from "./components/Home";
import Profile from "./components/Profile";
import SoilStatus from "./components/SoilStatus";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/CheckOut";

import { getGeminiResponse } from "./utils/geminiAPI";
import { base64ToArrayBuffer, pcmToWav } from "./utils/audioUtils";
import MessageBubble from "./components/MessageBubble";
import "./styles/typingIndicator.css";

function ChatToggleButton({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        padding: "12px 16px",
        borderRadius: "50%",
        backgroundColor: "#22c55e",
        color: "white",
        fontSize: 24,
        border: "none",
        cursor: "pointer",
      }}
    >
      {open ? "❌" : "💬"}
    </button>
  );
}

function CropPulseChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en-US");
  const [loading, setLoading] = useState(false);

  const chatRef = useRef(null);
  const audioCtx = useRef(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setLoading(true);
      getGeminiResponse("hello", lang).then((res) => {
        setMessages([{ text: res.text, sender: "bot", audio: res.audio }]);
        setLoading(false);
      });
    }
  }, [open, lang, messages.length]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;

    const userMsg = { text, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setText("");
    setLoading(true);

    const res = await getGeminiResponse(text, lang);
    setMessages((prev) => [...prev, { text: res.text, sender: "bot", audio: res.audio }]);
    setLoading(false);
  }

  async function playAudio(b64) {
    if (!b64) return;
    audioCtx.current = audioCtx.current || new (window.AudioContext || window.webkitAudioContext)();
    const pcm = base64ToArrayBuffer(b64);
    const wav = pcmToWav(new Int16Array(pcm));
    const buffer = await audioCtx.current.decodeAudioData(wav);
    const source = audioCtx.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.current.destination);
    source.start(0);
  }

  return (
    <>
      <ChatToggleButton open={open} onClick={() => setOpen(!open)} />

      {open && (
        <div
          ref={chatRef}
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "24rem",
            height: "70vh",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          <header
            style={{
              backgroundColor: "#22c55e",
              color: "white",
              padding: "12px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            🌱 Crop Pulse AI
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{ padding: "4px", borderRadius: "6px" }}
            >
              <option value="en-US">English</option>
              <option value="hi-IN">Hindi</option>
            </select>
          </header>

          <main style={{ flex: 1, padding: "12px", overflowY: "auto", backgroundColor: "#dcfce7" }}>
            {messages.map((m, i) => (
              <MessageBubble key={i} msg={m} onPlay={playAudio} />
            ))}

            {loading && (
              <div className="typing" aria-hidden="true" style={{ marginTop: 8 }}>
                <span></span><span></span><span></span>
              </div>
            )}

            <div style={{ height: 8 }} />
          </main>

          <footer style={{ padding: "12px", borderTop: "1px solid #ccc", backgroundColor: "white" }}>
            <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1, padding: "8px", borderRadius: "9999px", border: "1px solid #ccc" }}
                placeholder="Ask about crops..."
              />
              <button type="submit" style={{ backgroundColor: "#22c55e", color: "white", borderRadius: "9999px", padding: "8px 16px" }}>
                Send
              </button>
            </form>
          </footer>
        </div>
      )}
    </>
  );
}

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [photo, setPhoto] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginWrapper setUser={setUser} />} />
        <Route path="/signup" element={<SignUpWrapper />} />
        <Route path="/home" element={user ? <Home user={user} photo={photo} setPhoto={setPhoto} weatherData={weatherData} setWeatherData={setWeatherData} /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
        <Route path="/soil-status" element={photo ? <SoilStatus photo={photo} /> : <Navigate to="/home" />} />
       
       <Route path="/shop" element={<Shop />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/checkout" element={<Checkout />} />
      </Routes>

      {/* Floating Chatbot */}
      <CropPulseChatbot />
    </Router>
  );
}

export default App;
