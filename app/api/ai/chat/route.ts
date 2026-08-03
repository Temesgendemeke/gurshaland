import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { convertToModelMessages, stepCountIs, streamText } from "ai";
import { UIMessage } from "@ai-sdk/react";
import { tavilySearch } from "@tavily/ai-sdk";
import { chat_personality } from "@/ai/prompt";
import { query } from "@/ai/chunking";

export async function POST(req: NextRequest, res: NextResponse) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const userquery = messages[messages.length - 1]?.parts?.find((p) =>
    p.type === "text"
  )
    ?.text as string;



  const knowledge = await query(userquery);

  try {
    const stream = await streamText({
      model: google("gemini-2.5-flash"),
      system: chat_personality,
      messages: convertToModelMessages(messages, knowledge),
      tools: {
        travilySearch: tavilySearch({
          searchDepth: "advanced",
          maxResults: 5,
          includeAnswer: true,
        }),
      },
      stopWhen: stepCountIs(5),
    });
    console.log("streaming response sent", stream);

    return stream.toUIMessageStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "try again" }, { status: 500 });
  }
}
