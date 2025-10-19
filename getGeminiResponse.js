export async function getGeminiResponse(input, lang) {
  try {
    const res = await fetch("http://localhost:8080/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input, lang }),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    return {
      text: data.text || "🤖 No response received.",
      audio: data.audio || null,
    };
  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    return {
      text: "⚠️ Network issue, please try again shortly.",
      audio: null,
    };
  }
}