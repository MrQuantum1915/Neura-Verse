import { GoogleGenAI } from "@google/genai";

const myApiKey = process.env.Gemini_API_Key;
const ai = new GoogleGenAI({ apiKey: myApiKey });

export const generateStream = async (model, context, media) => {
    let response;

    // const models = await ai.models.list();
    // for await (const model of models) {
    //     console.log(`Model Name: ${model.name}`);
    //     console.log(`Display Name: ${model.displayName}`);
    //     console.log(`Description: ${model.description}`);
    //     console.log("---");
    // }

    if (media.length === 0) {
        response = await ai.models.generateContentStream({
            model: model,
            contents: context.map((item, idx) => ({
                role: item.role,
                parts: [
                    { text: item.content },
                ],
            })),
        });
    } else {
        response = await ai.models.generateContentStream({
            model: model,
            contents: context.map((item, idx) => {
                if (item.role === "user" && idx === context.length - 1) {
                    return {
                        role: item.role,
                        parts: [
                            { text: item.content },
                            ...media.map(url => ({ text: url })), // need to check may be incorrect //
                        ],
                    };
                } else {
                    return {
                        role: item.role,
                        parts: [{ text: item.content }],
                    };
                }
            }),
            config: {
                tools: [{ urlContext: {} }],
            },
        });
    }

    return response; // async generator
};
