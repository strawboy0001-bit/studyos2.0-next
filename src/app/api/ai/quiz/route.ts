import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const QuestionItemSchema = z.object({
  question: z.string().min(5),
  options: z.array(z.string()).min(2),
  correctAnswer: z.string().min(1),
  type: z.enum(["mcq", "true-false"]),
  explanation: z.string().min(5),
});

const GeneratedQuizSchema = z.object({
  title: z.string(),
  questions: z.array(QuestionItemSchema),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, difficulty = "Intermediate", questionCount = 5, userApiKey, userProvider } = body;

    const apiKey = userApiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    const provider = userProvider || (process.env.GEMINI_API_KEY ? "gemini" : process.env.OPENAI_API_KEY ? "openai" : "none");

    if (!apiKey || provider === "none" || provider === "offline") {
      return NextResponse.json({
        success: false,
        fallbackRequired: true,
        message: "No AI provider API key configured. Utilizing academic syllabus presets.",
      });
    }

    if (provider === "gemini") {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const prompt = `You are a university academic examiner. Generate a rigorous, pedagogically sound quiz on the academic topic: "${topic}".
Difficulty level: ${difficulty}.
Number of questions: ${questionCount}.
Include a mix of high-level Conceptual Multiple Choice and True/False questions.
For every question, provide:
1. question: clear, precise question
2. options: 4 distinct plausible options for MCQ (2 options ["True", "False"] for True/False)
3. correctAnswer: exactly matches one of the options
4. type: "mcq" or "true-false"
5. explanation: 2-3 sentences explaining the underlying theory, why the correct answer is right, and why the distractors are wrong.

Respond ONLY with valid JSON in this exact structure:
{
  "title": "${topic} (${difficulty})",
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "type": "mcq",
      "explanation": "..."
    }
  ]
}`;

      const geminiRes = await fetch(geminiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        return NextResponse.json({
          success: false,
          fallbackRequired: true,
          message: `Gemini API returned error: ${geminiRes.statusText}`,
          detail: errorText,
        });
      }

      const data = await geminiRes.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        return NextResponse.json({ success: false, fallbackRequired: true, message: "Empty response from Gemini." });
      }

      const parsedJson = JSON.parse(rawText);
      const validated = GeneratedQuizSchema.parse(parsedJson);

      return NextResponse.json({
        success: true,
        quiz: validated,
      });
    }

    if (provider === "openai") {
      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content:
                "You are an academic exam generator. Generate JSON with { title: string, questions: [{ question: string, options: string[], correctAnswer: string, type: 'mcq'|'true-false', explanation: string }] }",
            },
            {
              role: "user",
              content: `Generate ${questionCount} academic questions for topic "${topic}" at ${difficulty} difficulty with in-depth explanations.`,
            },
          ],
        }),
      });

      if (!openAiRes.ok) {
        return NextResponse.json({ success: false, fallbackRequired: true, message: "OpenAI request failed." });
      }

      const openAiData = await openAiRes.json();
      const content = openAiData.choices?.[0]?.message?.content;
      const parsedJson = JSON.parse(content);
      const validated = GeneratedQuizSchema.parse(parsedJson);

      return NextResponse.json({
        success: true,
        quiz: validated,
      });
    }

    return NextResponse.json({ success: false, fallbackRequired: true, message: "Unsupported provider." });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "AI generation error";
    return NextResponse.json({
      success: false,
      fallbackRequired: true,
      message: errorMsg,
    });
  }
}
