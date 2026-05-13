import { NextResponse } from "next/server";
import connectDB from "../../../lib/db/connect";
import Summary from "../../../lib/db/models/Summary";
import User from "../../../lib/db/models/User";
import { getUserFromRequest } from "../../../lib/utils/auth";
import { summarizeText, transcribeAudioText } from "../../../lib/utils/gemini";

export async function POST(request) {
  try {
    const userId = await getUserFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { text, inputType = "text", audioBase64, mimeType } = body;

    let textToSummarize = text;
    let transcribedText = "";

    // Handle audio transcription
    if ((inputType === "audio" || inputType === "voice_note") && audioBase64) {
      const transcription = await transcribeAudioText(audioBase64, mimeType);
      if (!transcription.success) {
        return NextResponse.json(
          { error: `Transcription failed: ${transcription.error}` },
          { status: 422 },
        );
      }
      transcribedText = transcription.text;
      textToSummarize = transcribedText;
    }

    if (!textToSummarize || textToSummarize.trim().length < 10) {
      return NextResponse.json(
        { error: "Text is too short. Please provide at least 10 characters." },
        { status: 400 },
      );
    }

    // Generate AI summary
    const result = await summarizeText(textToSummarize);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    await connectDB();

    // Save to DB
    const summary = await Summary.create({
      userId,
      title: result.data.title,
      inputType,
      originalText: text || textToSummarize,
      transcribedText,
      summary: result.data.summary,
      bulletPoints: result.data.bulletPoints,
      keyNotes: result.data.keyNotes,
      sentiment: result.data.sentiment,
      tags: result.data.tags,
      language: result.data.language,
    });

    // Increment user summary count
    await User.findByIdAndUpdate(userId, { $inc: { summaryCount: 1 } });

    return NextResponse.json(
      {
        message: "Summary generated successfully",
        summary: {
          _id: summary._id,
          title: summary.title,
          inputType: summary.inputType,
          originalText: summary.originalText,
          transcribedText: summary.transcribedText,
          summary: summary.summary,
          bulletPoints: summary.bulletPoints,
          keyNotes: summary.keyNotes,
          sentiment: summary.sentiment,
          tags: summary.tags,
          wordCount: summary.wordCount,
          readingTime: summary.readingTime,
          isFavorite: summary.isFavorite,
          createdAt: summary.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Summarize error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
