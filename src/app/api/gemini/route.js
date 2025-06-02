import { GoogleGenAI } from "@google/genai";
// import { NextResponse } from "next/server";

const myApiKey = process.env.Gemini_API_Key;

const ai = new GoogleGenAI({ apiKey: myApiKey });



export async function POST(request) {
    try {

        const formData = await request.formData();
        const file = formData.get('file'); // untill the app has low user base and traffic, passing the whole context along with media in every prompt to gemini is feasible. When traffic increase, here I will have to pass a summary of previous chat. To increase Cost effieciency
        const model = formData.get('model');
        const updatedContextRaw = formData.get('updatedContext');
        const context = JSON.parse(updatedContextRaw);

        // console.log(typeof context)

        console.log("Context:", context);
        console.log("Model:", model);

        // const available = await ai.models.list();
        // console.log("Available Models:", available);


        // const images = ()=>{
        //     for()
        // };


        // I am not using the gemini SDK feature of ai.chats.create() because under the hood it is doing same sh*t as i am doing here
        // so i'll just pass the messages array as context.
        // also i am passing the current use rompt in context array.
        const response = await ai.models.generateContentStream({
            model: model,
            //remember bro here "key" is not needed bcz we are not rendering anything in react here
            contents: context.map((item) => ({
                role: item.role,
                parts: [
                    { text: item.text },
                ],
            })),
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