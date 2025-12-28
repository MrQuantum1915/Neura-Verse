"use client"
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VerticalBarsLoader from "@/components/VerticalBarsLoader";
import PromptBox from "@/components/lumina/PromptBox";
import { deleteMessage } from "@/app/playgrounds/(playgrounds)/lumina/_actions/deleteMessage";
import CopyIcon from "@/components/icons/CopyIcon";
import TickIcon from "@/components/icons/TickIcon";
import { Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-playfair-display',
});

function CustomLink({ href, children }) {
    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href={href}
            className="text-cyan-400 hover:text-blue-400 break-words whitespace-normal"
            style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
        >
            {children}
        </a>
    );
}

const CustomH1 = ({ children }) => (
    <h1 className="text-3xl font-bold py-6">{children}</h1>
);

const CustomH2 = ({ children }) => (
    <h2 className="text-2xl font-bold py-5">{children}</h2>
);

const CustomH3 = ({ children }) => (
    <h3 className="text-xl font-bold py-4">{children}</h3>
);

const CustomH4 = ({ children }) => (
    <h4 className="text-lg font-bold py-3">{children}</h4>
);

const CustomH5 = ({ children }) => (
    <h5 className="text-base font-bold py-2">{children}</h5>
);

const CustomH6 = ({ children }) => (
    <h6 className="text-sm font-bold py-1">{children}</h6>
);

const CustomParagraph = ({ children }) => (
    <p className="text-lg leading-relaxed py-2">{children}</p>
);

const CustomUl = ({ children }) => (
    <ul className="list-disc ml-6 py-2 space-y-2">{children}</ul>
);

const CustomOl = ({ children }) => (
    <ol className="list-decimal ml-6 py-2 space-y-2 text-lg">{children}</ol>
);


const CustomLi = ({ children }) => (
    <li className="py-1 text-lg">{children}</li>
);

const ChatInterface = ({
    messages,
    setMessages,
    navigatingThread,
    name,
    responseComplete,
    setresponseComplete,
    Model,
    selectedFiles,
    CurrThreadID,
    handleNewPrompt,
    handleStreamResponse,
    setalert,
    setalertMessage
}) => {

    // scroll to bottom on re-render
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    const loadingMessages = [
        "Analysing...",
        "Thinking...",
        "Generating...",
        "Cooking...",
        "Crafting...",
    ];
    const [currentLoadingMessage, setCurrentLoadingMessage] = useState(loadingMessages[0]);
    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            index = (index + 1) % loadingMessages.length;
            setCurrentLoadingMessage(loadingMessages[index]);
        }, 2000);

        return () => {
            clearInterval(interval);
        }
    }, [])


    // toolbar related
    const [CopyContent, setCopyContent] = useState(false);
    const [ToolbarTriggerIndex, setToolbarTriggerIndex] = useState(null);
    const handleCopy = (content) => {
        setCopyContent(true);
        setTimeout(() => {
            setCopyContent(false);
        }, 2000);
        navigator.clipboard.writeText(content);
    }

    const [MoreMenu, setMoreMenu] = useState(false);
    const MoreMenuRef = useRef(null);
    // handling dropdown closing on click outside
    useEffect(() => {
        if (!MoreMenu) {
            return;
        }

        function handleClickOutside(event) {
            if (
                MoreMenuRef.current && !MoreMenuRef.current.contains(event.target)
            ) {
                setMoreMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [MoreMenu, setMoreMenu]);

    return (
        <div className="flex flex-col flex-1 min-w-0 h-full items-center">
            <div className=" w-full flex-1 min-h-0 pb-50 flex flex-col items-center overflow-x-scroll overflow-y-auto">
                {
                    (navigatingThread) && (
                        <div className="loader-4 fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50 h-full w-full">
                            <VerticalBarsLoader />
                            <div className="text-orange-400 text-sm">Fetching Thread...</div>
                        </div>
                    )
                }
                <div>
                    {messages.length === 0 ? (
                        <div className={`sm:text-5xl text-2xl mt-74 flex flex-col items-center justify-center ${playfairDisplay.className} `}>
                            <div className="flex">
                                <h1 className="bg-gradient-to-r py-4 from-green-400 to-cyan-400 bg-clip-text text-transparent">Hey
                                </h1>
                                <h1 className="mx-4 bg-gradient-to-r py-4 from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">{name}
                                </h1>
                            </div>
                            <h1 className="bg-gradient-to-r py-4 from-green-400 to-cyan-400 bg-clip-text text-transparent">What can I help you with Today ?</h1>
                        </div>
                    ) : (
                        <div className="w-full max-w-6xl py-4 px-4 md:px-12">

                            {messages.map((msg, index) => (
                                <div key={index} className={`mb-4 break-words flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    {
                                        ((msg.role === "model")) && (
                                            <div className="my-4 self-start flex-shrink-0 h-full rounded-full">
                                                <Image
                                                    src={"/ai_logo_orange-nobg.png"}
                                                    alt="Lumina"
                                                    width={40}
                                                    height={40}
                                                    className=
                                                    {`bg-black rounded-full 
                                                                    ${(
                                                            ((index === messages.length - 1) && (!responseComplete && (responseComplete !== null)))
                                                                ? "animate-pulse" : "animate-none"
                                                        )}
                                                                `}
                                                />
                                            </div>)
                                    }

                                    {
                                        msg.role === "model" && (
                                            <div className="fixed left-[50%] top-[2%] flex-shrink-0 h-full">

                                                {
                                                    (!responseComplete && (responseComplete !== null)) && (
                                                        <div className="flex items-center">
                                                            <div className="loader">
                                                                <div className="inner one"></div>
                                                                <div className="inner two"></div>
                                                                <div className="inner three"></div>
                                                            </div>
                                                            <div className="px-4">
                                                                {currentLoadingMessage}
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }

                                    <div className={`flex flex-col px-7 py-3 rounded-2xl text-white/85 rounded-tl-xs"}`}>

                                        {
                                            msg.role === "model" && (
                                                <div className="flex flex-row w-fit h-fit rounded-2xl p-2 border border-white/50 text-cyan-400/85">
                                                    {msg.ai_model.itemName}
                                                </div>
                                            )
                                        }
                                        <div className={`${msg.role === "user" && "px-7 py-3 rounded-2xl  max-w-150 bg-white/10 text-white/85 rounded-tr-xs"}`}>
                                            <ReactMarkdown components={
                                                {
                                                    h1: CustomH1,
                                                    h2: CustomH2,
                                                    h3: CustomH3,
                                                    h4: CustomH4,
                                                    h5: CustomH5,
                                                    h6: CustomH6,
                                                    p: CustomParagraph,
                                                    ul: CustomUl,
                                                    ol: CustomOl,
                                                    li: CustomLi,
                                                    a: CustomLink,
                                                }
                                            } remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>

                                        {/* toolbar */}

                                        <div className={`flex flex-row w-fit h-fit p-2 mx-0 m-2 ${msg.role === "user" ? ("self-end") : ("self-start")}`}>
                                            {/* toolbar from the map */}
                                            <button
                                                onClick={() => {
                                                    handleCopy(msg.content);
                                                    setToolbarTriggerIndex(index);
                                                }}
                                                className="mx-2 cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">
                                                {(CopyContent && (ToolbarTriggerIndex === index)) ? (<TickIcon fill="white" size={20} />) : (<CopyIcon fill="white" size={20} />)}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setMoreMenu((prev) => (!prev))
                                                    setToolbarTriggerIndex(index);
                                                }}
                                                className="relative mx-2 cursor-pointer hover:bg-white/10 border border-white/0 hover:border-white/30 rounded-full transition-all duration-200 ease-in-out"
                                            >
                                                <Image src={"/more.svg"} width={30} height={30} alt={"more menu"} className="opacity-50 hover:opacity-100" />
                                                {
                                                    MoreMenu && (index === ToolbarTriggerIndex) && (
                                                        <div ref={MoreMenuRef} className="absolute left-2 mt-1 bg-black border border-white/30 rounded-lg shadow-sm shadow-white/30 z-100 flex flex-col">
                                                            <div
                                                                onClick={async () => {
                                                                    const { data, error } = await deleteMessage(CurrThreadID, index);
                                                                    if (error) {
                                                                        setalertMessage(error);
                                                                        setalert(true);
                                                                        return;
                                                                    }

                                                                    setMessages((prev) => prev.filter((_, index) => index !== ToolbarTriggerIndex));

                                                                    setMoreMenu(false);
                                                                }}
                                                                className="p-1 rounded-lg w-full h-fit flex flex-row gap-2 px-2 items-center hover:bg-red-800/30 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-red-500"
                                                            >
                                                                <Image src={"/delete.svg"} width={15} height={15} alt={"delete thread"} className="flex-shrink-0" />
                                                                <div>Delete</div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>
                    )
                    }
                    <div className="pointer-events-none absolute left-0 bottom-0 w-full h-50 bg-gradient-to-b from-transparent to-[#000000]/80" />
                </div >
            </div >
            <PromptBox navigatingThread={navigatingThread} onPrompt={handleNewPrompt} onStreamResponse={handleStreamResponse} setresponseComplete={setresponseComplete} Model={Model} context={messages} selectedFiles={selectedFiles} CurrThreadID={CurrThreadID} />
        </div>
    );
};

export default ChatInterface;
