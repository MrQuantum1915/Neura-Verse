import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_AI_API_KEY
});

export const generateStream = async (model, context, media) => {
    const sarvamResponse = await client.chat.completions({
        model: model,
        messages: context.map((item) => ({
            role: item.role === "model" ? "assistant" : item.role,
            content: item.content,
        })),
        stream: true,
    });

    return (async function* () {
        for await (const chunk of sarvamResponse) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
                yield { text: content };
            }
        }
    })();
};
