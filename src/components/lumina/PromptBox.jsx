"use client";
import { useAlertStore } from '@/store/global/useAlertStore';
import Image from "next/image";
import { CircleStop, SendHorizontal } from "lucide-react";
import { useRef, useEffect, useState } from "react";

import { v7 } from "uuid";
import { getSignedURLsOfWorkspaceFiles } from "@/app/playgrounds/(playgrounds)/lumina/_actions/getSignedURLsOfWorkspaceFiles";
import { JetBrains_Mono } from 'next/font/google';
import { useThreadStore } from '@/store/lumina/useThreadStore';
import { useToolsStore } from '@/store/lumina/useToolsStore';
import { useRouter } from "next/navigation";
import { createClient_client } from '@/utils/supabase/supabaseClient';
const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

function PromptBox({
    onPrompt,
    navigatingThread,
    messages,
    onStreamResponse,
    setresponseComplete,
    Model,
    selectedFiles,
    CurrThreadID,
    CurrThreadName,
    ThreadPublic
}) {

    const model = Model.id;

    const [awaitingResponse, setawaitingResponse] = useState(false);
    const showAlert = useAlertStore((state) => state.showAlert);
    const activeTools = useToolsStore((state) => state.activeTools);
    const toggleTool = useToolsStore((state) => state.toggleTool);
    const isGemini = Model && Model.id && Model.id.includes("gemini");
    const [showToolsMenu, setShowToolsMenu] = useState(false);
    const toolsRef = useRef(null);

    const router = useRouter();

    const supabase = createClient_client();
    useEffect(() => {
        function handleClickOutside(event) {
            if (toolsRef.current && !toolsRef.current.contains(event.target)) {
                setShowToolsMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    // auto-resizing textarea with max height
    const textareaRef = useRef(null);
    const handleInput = (e) => {
        const ta = textareaRef.current;
        if (ta) {
            ta.style.height = "auto";
            ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
            ta.style.overflowY = ta.scrollHeight > 200 ? "auto" : "hidden";
        }
    };



    async function sendToLLM() {
        const prompt = textareaRef.current.value;
        if (prompt.trim() !== "") {
            setawaitingResponse(true);
            try {

                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Error fetching session:", error);
                }
                const session = data?.session;
                if (!session) {
                    showAlert('You must be logged in to send a prompt.');
                    router.push('/auth/login');
                    setawaitingResponse(false);
                    return;
                }

                // IMP: fetch signed urls BEFORE calling onPrompt, because onPrompt 
                // triggers router.push() which cancels subsequent server action calls
                const preThreadId = useThreadStore.getState().threadId;
                let signedURLs = [];
                if (selectedFiles && selectedFiles.length > 0 && preThreadId) {
                    console.log("fetching signed urls for files:", selectedFiles, "threadId:", preThreadId);
                    try {
                        const result = await getSignedURLsOfWorkspaceFiles(preThreadId, selectedFiles);
                        console.log("getSignedURLsOfWorkspaceFiles result:", result);
                        if (result.error) {
                            showAlert('Could not fetch signed URLs for files.');
                            return;
                        }
                        signedURLs = result.data.map(file => file.signedUrl);
                        console.log("Signed URLs:", signedURLs);
                    } catch (signedUrlError) {
                        console.error("Error calling getSignedURLsOfWorkspaceFiles:", signedUrlError);
                        showAlert('Failed to fetch signed URLs for files.');
                        return;
                    }
                }

                const newNodeId = await onPrompt(prompt);

                const activeThreadId = useThreadStore.getState().threadId;

                let responseText = "";
                const aiMessageId = v7();

                // need to await obv
                const response = await fetch("/api/ai", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model,
                        mediaURLs: signedURLs,
                        node_id: newNodeId,
                        thread_id: activeThreadId,
                        ai_model_object: Model,
                        active_tools: activeTools,
                        thread_name: CurrThreadName,
                        parent_id: newNodeId,
                        is_public: ThreadPublic,
                        ai_message_id: aiMessageId,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                if (!response.body) {
                    throw new Error("No response body");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let done = false;

                while (!done) {
                    const { value, done: doneReading } = await reader.read();
                    done = doneReading;
                    if (value) {
                        const chunk = decoder.decode(value);
                        responseText += chunk;
                        onStreamResponse(chunk, aiMessageId);
                    }
                }

            } catch (error) {
                console.error("Error in fetch:", error);
                showAlert('Failed to send prompt. Please try again.');
            } finally {
                setawaitingResponse(false);
                setresponseComplete(true);
            }
        }

        else {

            showAlert('Please enter a prompt before sending.');
            setawaitingResponse(false);
            // { console.log("awaitingResponse", awaitingResponse) }
        }
    }

    // useEffect(() => {
    //     handleInput();
    // }, []);

    return (
        <div className={`z-50 ${navigatingThread && ("pointer-events-none")} bg-[#171717] focus-within:ring-1 focus-within:ring-white/50 fixed bottom-5 w-[90vw] md:w-[60vw] lg:w-[40vw] rounded-2xl flex flex-row items-center justify-between px-2 md:px-4 border-1 border-white/20 hover:border-white/50 transition-all duration-300 ease-in-out`}>
            

            {isGemini && (
                <div className="relative flex items-center" ref={toolsRef}>
                    <button 
                        type="button"
                        onClick={() => setShowToolsMenu(!showToolsMenu)}
                        className={`mx-1 flex-shrink-0 transition-opacity ${activeTools.length > 0 ? "text-orange-400 opacity-100" : "text-white opacity-50 hover:opacity-100"}`}
                        title="Gemini Tools"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </button>
                    {showToolsMenu && (
                        <div className="absolute bottom-10 left-0 bg-[#1e1e1e] border border-white/20 rounded-lg shadow-lg p-2 flex flex-col gap-2 min-w-48 z-[1001] animate-fadeIn">
                            <div className="text-xs text-white/50 px-1 uppercase tracking-wider font-semibold">Gemini Tools</div>
                            <button
                                type="button"
                                onClick={() => toggleTool("googleSearch")}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${activeTools.includes("googleSearch") ? "bg-orange-500/20 text-orange-400" : "text-white/80 hover:bg-white/10"}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                Google Search
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleTool("codeExecution")}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${activeTools.includes("codeExecution") ? "bg-orange-500/20 text-orange-400" : "text-white/80 hover:bg-white/10"}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                                Code Execution
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* <button className="btn m-20 border-1 border-white/30 rounded-3xl"> */}


            <textarea
                ref={textareaRef}
                id="prompt-input"
                name="prompt"
                role="take-user-prompt"
                className={`text-base md:text-lg overflow-hidden p-2 my-2 flex-1 min-w-0 text-white bg-transparent outline-none rounded-xl border-transparent resize-none max-h-40 transition-all duration-700 ease-in-out ${jetbrainsMono.className}`}
                rows={1}
                onInput={handleInput}
                placeholder="What's On Your Mind...?"
                aria-label="Prompt Input"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendToLLM();
                        textareaRef.current.value = "";
                        handleInput();
                    }
                }}
            />


            <button
                type="button"
                className="flex items-center justify-center p-2 mx-1 md:mx-2 transition-all duration-300 ease-in-out flex-shrink-0 hover:scale-105 active:scale-95"
                onClick={(e) => {
                    e.preventDefault();
                    if (awaitingResponse) {
                        handleInput();
                    } else {
                        sendToLLM();
                        if (textareaRef.current) textareaRef.current.value = "";
                        handleInput();
                    }
                }}
            >
                {awaitingResponse ? (
                    <CircleStop
                        size={24}
                        className="text-red-400 opacity-90 animate-pulse cursor-pointer pointer-events-none"
                    />
                ) : (
                    <SendHorizontal
                        size={24}
                        className="text-white opacity-90 cursor-pointer pointer-events-none"
                    />
                )}
            </button>
        </div >
    );
}
export default PromptBox;
