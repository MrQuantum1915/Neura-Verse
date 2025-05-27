"use client";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

function PromptBox({ onPrompt, onStreamResponse, gotResponse, handleResponseComplete }) {

    const [awaitingResponse, setawaitingResponse] = useState(false);
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


    function sendToGemini() {
        const prompt = textareaRef.current.value;
        if (prompt.trim() !== "") {
            onPrompt(prompt);
            setawaitingResponse(true);
            let responseText = "";
            fetch("/api/gemini", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt }),
            })
                .then(async (Response) => {
                    if (!Response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    if (!Response.body) throw new Error("No response body");
                    const reader = Response.body.getReader();
                    const decoder = new TextDecoder();
                    let done = false;
                    while (!done) {
                        const { value, done: doneReading } = await reader.read();
                        done = doneReading;
                        if (value) {
                            const chunk = decoder.decode(value);
                            responseText += chunk;
                            onStreamResponse(responseText);
                        }
                    }
                    gotResponse(true);
                    handleResponseComplete();
                    setawaitingResponse(false);
                })
                .catch(error => {
                    setawaitingResponse(false);
                    console.error('Error:', error);
                });
        }

        else {
            alert("Please enter a prompt.");
            setawaitingResponse(false);
            { console.log("awaitingResponse", awaitingResponse) }
        }
    }

    // useEffect(() => {
    //     handleInput();
    // }, []);

    return (

        <div className=" fixed bottom-5 w-[40vw] bg-black rounded-3xl flex flex-row items-center justify-between px-2 border-1 border-white/30">

            {/* upload your damn media here , whatever*/}
            <button className="m-3 p-3 cursor-pointer opacity-50 hover:opacity-100 active:translate-y-1 transition-all duration-300 ease-in-out">
                <Image src={"/file-upload-icon.svg"} width={30} height={30} alt="Upload Media"></Image>
            </button>

            {/* <button className="btn m-20 border-1 border-white/30 rounded-3xl"> */}

            {/* </button> */}

            <textarea
                ref={textareaRef}
                role="take-user-prompt"
                className="promptBoxTextarea  text-[1.25em] overflow-hidden p-3 m-3 w-[90%] bg-white/7 outline-none border-2 rounded-2xl border-transparent focus:border-cyan-400 resize-none max-h-40 transition-all duration-700 ease-in-out"
                onInput={handleInput}
                placeholder="What's On Your Mind...?"
                aria-label="Prompt Input"
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendToGemini();
                        textareaRef.current.value = "";
                        handleInput();
                    }
                }}
            >
            </textarea>

            {/* <button className="relative rounded-sm p-1 bg-white/5 cursor-pointer active:translate-y-1 transition-all duration-200 ease-in-out">
                <Image
                    src={"/chip2.svg"}
                    width={50}
                    height={50}
                    alt={"Model"}
                />
            </button> */}

                <button>
                <Image
                    src={`${awaitingResponse ? "/stop.svg" : "/submit.png"}`}
                    width={40}
                    height={40}
                    alt="Submit"
                    className={`cursor-pointer rounded-full p-2 mx-5 transition-all duration-300 ease-in-out hover:scale-105  hover:rotate-45 active:opacity-100 ${awaitingResponse ? "animate-pulse p-4 bg-black/10 hover:rotate-90" : " bg-[linear-gradient(45deg,_#922bff,_#00d9ff)]"}`}
                    aria-label="Submit Prompt"
                    onClick={(e) => {
                        awaitingResponse ? (console.log("stop"), handleInput()) : (sendToGemini(), textareaRef.current.value = "", handleInput());
                        e.preventDefault();
                    }}
                />
            </button>
        </div >

    );
}
export default PromptBox;
