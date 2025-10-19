// utils/geminiAPI.js
// Handles talking to the Gemini API (text + TTS responses).

export async function getGeminiResponse(userMsg, langCode) {
    console.log(`[Gemini] Sending: "${userMsg}" | Language: ${langCode}`);

    const API_KEY = ""; // Intentionally blank – handled by environment

    const textEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
    const ttsEndpoint  = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`;

    const systemPrompt = `
        You are "Crop Pulse AI", a friendly farming assistant.
        Keep answers short (2-3 sentences) and use simple language.
        Respond ONLY in language: ${langCode}.
    `;

    const textBody = {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMsg }] }]
    };

    let responseText = "Sorry, I couldn’t get that. Could you say it differently?";
    let audioData = null;

    try {
        const res = await fetch(textEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(textBody)
        });

        if (!res.ok) throw new Error("Text API error " + res.status);

        const data = await res.json();
        responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || responseText;
    } catch (err) {
        console.error("Gemini text error:", err);
        responseText = "Network issue, please try again shortly.";
        return { text: responseText, audio: null };
    }

    // Now try to get audio (TTS)
    try {
        const ttsBody = {
            model: "gemini-2.5-flash-preview-tts",
            contents: [{
                parts: [{
                    text: `Speak this in a friendly tone (${langCode}): ${responseText}`
                }]
            }],
            generationConfig: { responseModalities: ["AUDIO"] }
        };

        const ttsRes = await fetch(ttsEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ttsBody)
        });

        if (!ttsRes.ok) throw new Error("TTS API error " + ttsRes.status);

        const audioJson = await ttsRes.json();
        audioData = audioJson?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (err) {
        console.warn("TTS failed, continuing without voice:", err);
    }

    return { text: responseText, audio: audioData };
}
