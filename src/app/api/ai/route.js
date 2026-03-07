import { createClient_server } from "@/utils/supabase/supabaseServer";
import { getProvider } from "@/utils/ai-providers";

// CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

export async function POST(request) {
    try {
        const body = await request.json();
        const model = body.model;

        // console.log(`\n\n[ AI-Provider ] \n-> Full Request Body: ${JSON.stringify(body, null, 2)} \n-> Extracted Model: ${model}\n`);

        console.log(`\n\n[ AI-Provider ] Starting inference with model: ${model}\n`);

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

        const provider = getProvider(model);
        const responseGenerator = await provider.generateStream(model, context, media);

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of responseGenerator) {
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
                ...corsHeaders,
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked"
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response("Internal Server Error", { status: 500, headers: corsHeaders });
    }
}