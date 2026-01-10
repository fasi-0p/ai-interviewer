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
  console.log('Post hit 🔥');
  
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  let args = body;
  
  if (body.message && body.message.toolCalls) {
    // This is a Vapi call
    console.log("Vapi Payload Detected 🤖");
    args = body.message.toolCalls[0].function.arguments;
  }
  
  // Now we safely extract from 'args' instead of 'body'
  const { type, role, level, techstack, amount, userid } = args;

  // validation check to prevent crashes
  if (!role || !techstack) {
    console.error("Missing required fields:", args);
    return Response.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  try {
    console.log('try block begin 🔥'); //testing
    
    const { text: questions } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}. 
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
      `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      // Safe split: ensure techstack is a string before splitting
      techstack: typeof techstack === 'string' ? techstack.split(",") : techstack, 
      questions: JSON.parse(questions),
      userId: userid ?? null,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };
    
    console.log('try block end 🔥'); //testing
    await db.collection("interviews").add(interview);
    console.log('db added 🔥'); //testing
    
    // IMPORTANT: Return the result so Vapi knows it worked
    return Response.json({ 
      results: [
        {
          toolCallId: body.message?.toolCalls?.[0]?.id || "unknown",
          result: "Interview generated successfully" 
        }
      ]
    }, { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

//testing function just ignore
// number of hours spent: 23!
// export async function POST(request: Request) {
//   console.log("🔥 /api/vapi/generate HIT"); //testing

//   let body;
//   try {
//     body = await request.json();
//   } catch (err) {
//     console.error("❌ Failed to parse JSON body");
//     return Response.json({ success: false }, { status: 400 });
//   }

//   console.log("🔥 BODY RECEIVED:", body); //testing

//   const { type, role, level, techstack, amount, userid } = body;

//   try {
//     const { text } = await generateText({
//       model:  google("gemini-2.5-flash"),
//       prompt: `Prepare questions for a job interview.
// The job role is ${role}.
// The job experience level is ${level}.
// The tech stack used in the job is: ${techstack}.
// The focus between behavioural and technical questions should lean towards: ${type}.
// The amount of questions required is: ${amount}.
// Please return only the questions, without any additional text.
// Return the questions formatted like this:
// ["Question 1", "Question 2", "Question 3"]`,
//     });

//     let parsedQuestions: string[] = [];
//     try {
//       parsedQuestions = JSON.parse(text);
//     } catch {
//       parsedQuestions = text
//         .split("\n")
//         .map(q => q.trim())
//         .filter(Boolean);
//     }

//     const interview = {
//       role,
//       type,
//       level,
//       techstack: Array.isArray(techstack)
//         ? techstack
//         : techstack.split(",").map((t: string) => t.trim()),
//       questions: parsedQuestions,
//       userId: userid,
//       finalized: true,
//       coverImage: getRandomInterviewCover(),
//       createdAt: new Date().toISOString(),
//     };

//     console.log("🔥 SAVING INTERVIEW:", interview);

//     await db.collection("interviews").add(interview);

//     console.log("✅ INTERVIEW SAVED");

//     return Response.json({ success: true, data: interview }, { status: 200 });
//   } catch (error) {
//     console.error("❌ ERROR IN GENERATE:", error);
//     return Response.json({ success: false, error }, { status: 500 });
//   }
// }