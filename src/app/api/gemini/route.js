import { GoogleGenAI } from "@google/genai";
// import { NextResponse } from "next/server";

const myApiKey = process.env.Gemini_API_Key;

const ai = new GoogleGenAI({ apiKey: myApiKey });



export async function POST(request) {
    try {
        const body = await request.json();
        const userPrompt = body.prompt;
        const model = body.model;

        console.log("User Prompt:", userPrompt);

        const response = await ai.models.generateContentStream({
            model: model,
            contents: {
                parts: [
                    { text: userPrompt }
                ]
            },
        });

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        if (chunk.text) {
                            controller.enqueue(new TextEncoder().encode(chunk.text));
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            }
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked"
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}