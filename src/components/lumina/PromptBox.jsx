"use client";
import Image from "next/image";
import { Paperclip, CircleStop, SendHorizontal } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import MyAlert from "../MyAlert";
import { getSignedURLsOfWorkspaceFiles } from "@/app/playgrounds/(playgrounds)/lumina/_actions/getSignedURLsOfWorkspaceFiles";
import { JetBrains_Mono } from 'next/font/google';

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
    CurrThreadID
}) {

    const model = Model.id;

    const [awaitingResponse, setawaitingResponse] = useState(false);
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");


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

                const newNodeId = await onPrompt(prompt);

                let signedURLs = [];
                if (selectedFiles && selectedFiles.length > 0) {
                    const { data, error } = await getSignedURLsOfWorkspaceFiles(CurrThreadID, selectedFiles);
                    if (error) {

                        setalertMessage("Failed to fetch signed URLs for files.");
                        setalert(true);
                        return;
                    }
                    signedURLs = data.map(file => file.signedUrl);
                    console.log("Signed URLs:", signedURLs);
                }

                // const newNodeId = await newNodeIdPromise;

                let responseText = "";

                // need to await obv
                const response = await fetch("/api/gemini", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        model,
                        mediaURLs: signedURLs,
                        node_id: newNodeId,    // Use the newly created node's ID instead of the old one
                        thread_id: CurrThreadID
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
                        onStreamResponse(chunk);
                    }
                }

            } catch (error) {
                console.error("Error in fetch:", error);
                setalertMessage("An error occurred while processing your request.");
                setalert(true);
            } finally {
                setawaitingResponse(false);
                setresponseComplete(true);
            }
        }

        else {

            setalertMessage("Please enter a prompt.");
            setalert(true);
            setawaitingResponse(false);
            // { console.log("awaitingResponse", awaitingResponse) }
        }
    }

    // useEffect(() => {
    //     handleInput();
    // }, []);

    return (
        <div className={`${navigatingThread && ("pointer-events-none")} bg-[#171717] focus-within:ring-1 focus-within:ring-white/50 fixed bottom-5 w-[40vw] rounded-2xl flex flex-row items-center justify-between px-2 border-1 border-white/20 hover:border-white/50 transition-all duration-300 ease-in-out`}>
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }
            {/* user uploads their damn media here , just whatever*/}
            <label className="relative m-1 opacity-50">
                {/* <input onChange={handleMediaUpload} type="file" className="hidden" multiple /> */}
                <Paperclip size={20} className="text-white hover:text-white transition-opacity" />
                {/* {
                    (files.length != 0) &&
                    (
                        <div className="text-sm text-orange-400 absolute z-50 top-8 left-15 rounded-sm bg-orange-500/20 px-1  ">{selectedFiles.length}
                        </div>
                    )
                } */}
            </label>
            {/* <button className="btn m-20 border-1 border-white/30 rounded-3xl"> */}


            <textarea
                ref={textareaRef}
                id="prompt-input"
                name="prompt"
                role="take-user-prompt"
                className={`text-lg overflow-hidden p-2 m-2 w-[90%] text-white bg-transparent outline-none rounded-xl border-transparent resize-none max-h-40 transition-all duration-700 ease-in-out ${jetbrainsMono.className}`}
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


            <button>
                {awaitingResponse ? (
                    <CircleStop
                        size={24}
                        className="cursor-pointer text-red-400 opacity-90 mx-5 transition-all duration-300 ease-in-out hover:scale-105 animate-pulse"
                        onClick={(e) => {
                            handleInput();
                            e.preventDefault();
                        }}
                    />
                ) : (
                    <SendHorizontal
                        size={24}
                        className="cursor-pointer text-white opacity-90 mx-3 transition-all duration-300 ease-in-out hover:scale-105"
                        onClick={(e) => {
                            sendToLLM();
                            textareaRef.current.value = "";
                            handleInput();
                            e.preventDefault();
                        }}
                    />
                )}
            </button>
        </div >
    );
}
export default PromptBox;
