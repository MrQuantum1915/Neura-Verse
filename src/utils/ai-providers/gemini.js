import { GoogleGenAI } from "@google/genai";

const myApiKey = process.env.Gemini_API_Key;
const ai = new GoogleGenAI({ apiKey: myApiKey });

export const generateStream = async function* (model, context, media, aiModelObject, activeTools) {
    let config = undefined;

    let tools = [];
    if (activeTools?.includes("googleSearch")) {
        tools.push({ googleSearch: {} });
    }
    if (activeTools?.includes("codeExecution")) {
        tools.push({ codeExecution: {} });
    }

    if (tools.length > 0) {
        config = config || {};
        config.tools = tools;
    }

    if (aiModelObject?.thinking) {
        config = config || {};
        config.thinkingConfig = { includeThoughts: true };
        
        if (model.includes("gemini-3")) {
            config.thinkingConfig.thinkingLevel = "high";
        } else if (model.includes("gemini-2.5-flash-lite")) {
            config.thinkingConfig.thinkingBudget = 4096;
        } else if (model.includes("gemini-2.5")) {
            config.thinkingConfig.thinkingBudget = -1;
        }
    }

    const requestPayload = {
        model: model,
        contents: context.map((item, idx) => {
            if (media.length > 0 && item.role === "user" && idx === context.length - 1) {
                return {
                    role: item.role,
                    parts: [
                        { text: item.content },
                        ...media.map(file => ({
                            inlineData: {
                                mimeType: file.mimeType,
                                data: file.data,
                            }
                        })),
                    ],
                };
            } else {
                return {
                    role: item.role,
                    parts: [{ text: item.content }],
                };
            }
        }),
        ...(config ? { config } : {})
    };

    const response = await ai.models.generateContentStream(requestPayload);

    let groundingSources = [];
    let searchEntryPoint = null;
    let codeExecutions = [];

    for await (const chunk of response) {
        if (chunk.candidates && chunk.candidates.length > 0) {
            const candidate = chunk.candidates[0];
            
            if (candidate.groundingMetadata) {
                if (candidate.groundingMetadata.groundingChunks) {
                    candidate.groundingMetadata.groundingChunks.forEach(chunk => {
                        if (chunk.web?.uri && chunk.web?.title) {
                            if (!groundingSources.some(s => s.uri === chunk.web.uri)) {
                                groundingSources.push(chunk.web);
                            }
                        }
                    });
                }
                if (candidate.groundingMetadata.searchEntryPoint?.renderedContent) {
                    searchEntryPoint = candidate.groundingMetadata.searchEntryPoint.renderedContent;
                }
            }

            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.executableCode) {
                        codeExecutions.push({
                            type: 'code',
                            language: part.executableCode.language,
                            code: part.executableCode.code
                        });
                    }
                    if (part.codeExecutionResult) {
                        codeExecutions.push({
                            type: 'result',
                            outcome: part.codeExecutionResult.outcome,
                            output: part.codeExecutionResult.output
                        });
                    }
                    if (part.inlineData) {
                        yield { text: `\n\n![Generated Output](data:${part.inlineData.mimeType};base64,${part.inlineData.data})\n\n` };
                    }

                    if (!part.text) continue;
                    if (part.thought) {
                        yield { text: `<think>\n${part.text}\n</think>\n\n` };
                    } else {
                        yield { text: part.text };
                    }
                }
            }
        } else if (chunk.text) {
            yield { text: chunk.text };
        }
    }

    if (codeExecutions.length > 0) {
        yield { text: `\n<codeexecution>\n${JSON.stringify(codeExecutions)}\n</codeexecution>` };
    }

    // append grounding citations at the end of response as a json
    if (groundingSources.length > 0) {
        yield { text: `\n<citations>\n${JSON.stringify(groundingSources)}\n</citations>` };
    }
};
