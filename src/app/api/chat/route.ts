import { NextResponse } from "next/server";
import { JERVIS_SYSTEM_PROMPT } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const apiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY in your .env file.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    let rawMessages = body.messages;

    if (!rawMessages && body.message) {
      rawMessages = [{ role: "user", content: body.message }];
    }

    if (!rawMessages || !Array.isArray(rawMessages) || rawMessages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required." },
        { status: 400 }
      );
    }

    // Filter and map messages to Gemini format (role must be 'user' or 'model')
    const formattedContents = rawMessages
      .filter((m: any) => m && m.content && typeof m.content === "string")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    if (formattedContents.length === 0) {
      return NextResponse.json(
        { error: "No valid message content provided." },
        { status: 400 }
      );
    }

    const modelName = "gemini-3.8-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: JERVIS_SYSTEM_PROMPT.trim() }],
          },
          contents: formattedContents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg =
        data?.error?.message ||
        `Google Generative AI responded with status ${res.status}`;
      console.error("[/api/chat] Gemini API error:", data || res.statusText);
      return NextResponse.json({ error: errMsg }, { status: res.status });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Marine Analytica Core received the transmission, but no output was generated.";

    return NextResponse.json({ reply, content: reply }, { status: 200 });
  } catch (error: unknown) {
    console.error("[/api/chat] Error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected server error occurred.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
