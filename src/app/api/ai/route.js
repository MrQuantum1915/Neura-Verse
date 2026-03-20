import { createClient_server } from "@/utils/supabase/supabaseServer";
import { getProvider } from "@/utils/ai-providers";
import { insertNewMessage } from "@/app/playgrounds/(playgrounds)/lumina/_actions/insertNewMessage";

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

        console.log(`\n\n[ AI-Provider ] Starting inference with model: ${model}\n`);

        const nodeId = body.node_id;
        const thread_id = body.thread_id;
        const media = body.mediaURLs;
        const ai_model_object = body.ai_model_object;
        const active_tools = body.active_tools;
        const thread_name = body.thread_name;
        const parent_id = body.parent_id;
        const is_public = body.is_public;
        const ai_message_id = body.ai_message_id;

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

        // fetch file content from signed URLs and convert to base64 inline data
        let mediaData = [];
        if (media && media.length > 0) {
            console.log(`[ AI-Provider ] Fetching ${media.length} media file(s) from signed URLs...`);
            const mediaPromises = media.map(async (url) => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        console.error(`[ AI-Provider ] Failed to fetch media: ${res.status} ${res.statusText}`);
                        return null;
                    }
                    const contentType = res.headers.get('content-type') || 'application/octet-stream';
                    const arrayBuffer = await res.arrayBuffer();
                    const base64 = Buffer.from(arrayBuffer).toString('base64');
                    console.log(`[ AI-Provider ] Fetched media: ${contentType}, ${Math.round(arrayBuffer.byteLength / 1024)}KB`);
                    return { mimeType: contentType, data: base64 };
                } catch (fetchErr) {
                    console.error(`[ AI-Provider ] Error fetching media URL:`, fetchErr);
                    return null;
                }
            });
            mediaData = (await Promise.all(mediaPromises)).filter(Boolean);
        }

        const provider = getProvider(model);
        const responseGenerator = await provider.generateStream(model, context, mediaData, ai_model_object, active_tools);

        let fullResponseText = "";

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of responseGenerator) {
                        if (chunk.text) {
                            fullResponseText += chunk.text;
                            try {
                                controller.enqueue(new TextEncoder().encode(chunk.text));
                            } catch (enqueueErr) {
                                // user disconneted -> consume genreator silently for finally block
                            }
                        }
                    }
                    try { controller.close(); } catch (e) { }
                } catch (err) {
                    try { controller.error(err); } catch (e) { }
                } finally {
                   // store response to DB no matter user connection status
                    if (fullResponseText) {
                        try {
                            const { error: dbError } = await insertNewMessage(
                                thread_id,
                                thread_name,
                                {
                                    id: ai_message_id,
                                    role: "model",
                                    content: fullResponseText,
                                    ai_model: ai_model_object,
                                    parent_id: parent_id,
                                    is_public: is_public || false,
                                }
                            );
                            if (dbError) {
                                console.error("[ AI-Provider ] DB insertion error:", dbError);
                            } else {
                                console.log(`[ AI-Provider ] AI response stored to DB (id: ${ai_message_id})`);
                            }
                        } catch (dbErr) {
                            console.error("[ AI-Provider ] DB insertion exception:", dbErr);
                        }
                    }
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