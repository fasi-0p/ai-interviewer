import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function GET() {
  return Response.json(
    { success: true, data: "THANK YOU" },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  console.log("🔥 /api/vapi/generate HIT");

  let body;
  try {
    body = await request.json();
  } catch (err) {
    console.error("❌ Failed to parse JSON body");
    return Response.json({ success: false }, { status: 400 });
  }

  console.log("🔥 BODY RECEIVED:", body);

  const { type, role, level, techstack, amount, userid } = body;

  try {
    const { text } = await generateText({
      model: google("gemini-1.5-flash"), 
      prompt: `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]`,
    });

    let parsedQuestions: string[] = [];
    try {
      parsedQuestions = JSON.parse(text);
    } catch {
      parsedQuestions = text
        .split("\n")
        .map(q => q.trim())
        .filter(Boolean);
    }

    const interview = {
      role,
      type,
      level,
      techstack: Array.isArray(techstack)
        ? techstack
        : techstack.split(",").map((t: string) => t.trim()),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("🔥 SAVING INTERVIEW:", interview);

    await db.collection("interviews").add(interview);

    console.log("✅ INTERVIEW SAVED");

    return Response.json({ success: true, data: interview }, { status: 200 });
  } catch (error) {
    console.error("❌ ERROR IN GENERATE:", error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
