import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

export async function summarizeText(text) {
  const prompt = `You are an expert content analyst and summarizer. Analyze the following text and provide a structured response.

TEXT TO ANALYZE:
"""
${text}
"""

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "title": "A concise, descriptive title for this content (max 10 words)",
  "summary": "A clear, comprehensive summary in 2-4 sentences that captures the main idea",
  "bulletPoints": [
    "Key point 1 (concise, actionable insight)",
    "Key point 2",
    "Key point 3",
    "Key point 4",
    "Key point 5"
  ],
  "keyNotes": [
    "Important detail or fact 1",
    "Important detail or fact 2",
    "Important detail or fact 3"
  ],
  "sentiment": "positive|neutral|negative|mixed",
  "tags": ["tag1", "tag2", "tag3"],
  "language": "en"
}

Rules:
- bulletPoints: 3-7 concise, actionable insights
- keyNotes: 2-5 specific facts, data points, or notable details
- sentiment: choose one of: positive, neutral, negative, mixed
- tags: 2-5 relevant topic tags (lowercase)
- Ensure the JSON is valid and parseable`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text().trim();

    // Strip markdown code blocks if present
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      success: true,
      data: {
        title: parsed.title || "Summary",
        summary: parsed.summary || "",
        bulletPoints: Array.isArray(parsed.bulletPoints)
          ? parsed.bulletPoints
          : [],
        keyNotes: Array.isArray(parsed.keyNotes) ? parsed.keyNotes : [],
        sentiment: parsed.sentiment || "neutral",
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        language: parsed.language || "en",
      },
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate summary",
    };
  }
}

export async function transcribeAudioText(audioBase64, mimeType) {
  try {
    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: mimeType || "audio/webm",
      },
    };

    const prompt = `Transcribe the speech in this audio file accurately. 
Return ONLY the transcribed text, nothing else. 
If the audio is unclear or contains no speech, return: "[No speech detected]"`;

    const result = await model.generateContent([audioPart, prompt]);
    const response = await result.response;
    const transcription = response.text().trim();

    return { success: true, text: transcription };
  } catch (error) {
    console.error("Audio transcription error:", error);
    return { success: false, error: error.message };
  }
}
