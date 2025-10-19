// components/MessageBubble.jsx
import React from "react";

export default function MessageBubble({ msg, onPlay }) {
    if (!msg) return null;
    const isUser = msg.sender === "user";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
            <div className={`p-3 rounded-2xl shadow-sm ${isUser ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"}`}>
                <p>{msg.text}</p>
                {!isUser && msg.audio && (
                    <button onClick={() => onPlay(msg.audio)} className="mt-2 text-gray-600 hover:text-green-700">
                        🔊
                    </button>
                )}
            </div>
        </div>
    );
}
