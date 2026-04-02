const SAMBANOVA_API_KEY = import.meta.env.VITE_SAMBANOVA_API_KEY;
const OFFICE_NAME = import.meta.env.VITE_OFFICE_NAME || "Our Office";

export async function generateGreeting(festivalName) {
  if (!SAMBANOVA_API_KEY) {
    throw new Error("SambaNova API Key is not configured in .env");
  }

  const prompt = `Write a professional and warm festival greeting message for ${festivalName}. 
  The message should be from "${OFFICE_NAME}". 
  Keep it concise (1-2 sentences), celebratory, and suitable for an office environment. 
  Just return the greeting text, nothing else.`;

  try {
    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SAMBANOVA_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-70B-Instruct",
        messages: [
          { role: "system", content: "You are a professional assistant that writes warm office greetings." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate greeting");
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
}
