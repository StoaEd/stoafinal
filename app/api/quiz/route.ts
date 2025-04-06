// import { createResource } from '@/lib/actions/resources';
import { findRelevantContent } from '@/lib/ai/DbFetch';
import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { prompt }: { prompt: string } = await req.json();

    // Determine if this is a grading request based on prompt content
    const isGradingRequest = prompt.includes("Grade the following quiz answers");
    console.log("isGradingRequest :", isGradingRequest);
    const result = streamText({
        model: google('gemini-2.0-flash'),
        system: `You are a quiz generation and grading assistant that helps create educational content.

For quiz generation:
- When asked to generate questions, return a valid JSON array of question objects
- Each object should have 'question' and 'answer' fields
- Format must be parseable JSON with an array structure like: [{"question": "...", "answer": "..."}]
- Only return the JSON array without additional text

For quiz grading:
- When grading answers, evaluate each response and provide specific feedback
- Return a valid JSON object with 'feedback' array and 'score' number
- Format must be: {"feedback": ["feedback1", "feedback2", ...], "score": number}
- Be fair and consistent in grading, allowing for variations in correct answers`,
        prompt,
        tools: {
            getInformation: tool({
                description: `get information from your knowledge base to answer questions.`,
                parameters: z.object({
                    question: z.string().describe('the users question'),
                }),
                execute: async ({ question }) => findRelevantContent(question),
            }),
        },
    });

    return result.toDataStreamResponse();
}