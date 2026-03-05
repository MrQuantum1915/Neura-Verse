
import { GoogleGenAI } from "@google/genai";
import { createPartFromUri } from "@google/genai";
// import { NextResponse } from "next/server";

import { createClient_server } from "@/utils/supabase/supabaseServer";

// to allow external request to this endpoint
// // CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};


const myApiKey = process.env.Gemini_API_Key;
const ai = new GoogleGenAI({ apiKey: myApiKey });

// // Handle OPTIONS preflight
// export async function OPTIONS() {
//     return new Response(null, {
//         status: 204,
//         headers: corsHeaders
//     });
// }

export async function POST(request) {
    try {

        const body = await request.json();
        const model = body.model;
        const nodeId = body.node_id;
        const thread_id = body.thread_id;
        const media = body.mediaURLs; // mediaURLs is an array of objects with fileURI and mimeType

        //auth check
        const supabase = await createClient_server();
        const { data, error } = await supabase.auth.getUser();
        if (error || !data.user) {
            console.error('Authentication error:', error);
            return new Response("Unauthorized", { status: 401, headers: corsHeaders });
        }

        //context retrieval from DB
        const { data: context, error: rpc_err } = await supabase
            .rpc('get_curr_branch_context', { node_id: nodeId, req_thread_id: thread_id, req_user_id: data.user.id });

        if (rpc_err) {
            console.error("RPC Error:", rpc_err);
            return new Response("Context Retrieval Error", { status: 500, headers: corsHeaders });
        }

        // console.log("Context retrieved:", context);

        let response = "";
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
                                ...media.map(url => ({ text: url })),
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

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        if (chunk.text) {
                            // console.log(chunk.text);
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
                ...corsHeaders,
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked"
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
    }
    // finally{
    //     // store the response in DB - no matter if stream succeed or not

    // }
}