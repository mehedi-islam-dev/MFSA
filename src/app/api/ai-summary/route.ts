import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { totalSamples, aValue, bValue, growthType } = await request.json();

    const parsedA = parseFloat(aValue);
    const parsedB = parseFloat(bValue);
    const parsedSamples = parseInt(totalSamples, 10);

    if (
      isNaN(parsedSamples) || parsedSamples <= 0 ||
      isNaN(parsedA) ||
      isNaN(parsedB) ||
      !growthType || typeof growthType !== 'string'
    ) {
      return NextResponse.json({ error: "Missing or invalid required parameters" }, { status: 400 });
    }

    const prompt = `Act as an expert marine biologist. Analyze the following Length-Weight Relationship (LWR) data for a fish stock:
    Total Samples: ${totalSamples}
    a-value (scaling constant): ${aValue.toExponential(4)}
    b-value (exponent): ${bValue.toFixed(4)}
    Growth Type: ${growthType}
    
    Provide a concise, professional 2-3 paragraph summary of what these morphometric parameters indicate about the health, development, and environmental conditions of the stock. Include a bolded "Management Recommendation" at the end. Output in Markdown format.`;

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      prompt,
    });

    return NextResponse.json({ summary: text }, { status: 200 });
  } catch (error) {
    console.error("AI Summary generation failed:", error);
    return NextResponse.json({ error: "Failed to generate AI summary" }, { status: 500 });
  }
}
