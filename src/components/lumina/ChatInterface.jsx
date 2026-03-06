"use client"
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VerticalBarsLoader from "@/components/VerticalBarsLoader";
import PromptBox from "@/components/lumina/PromptBox";
import { deleteMessage } from "@/app/playgrounds/(playgrounds)/lumina/_actions/deleteMessage";
import { useRouter } from "next/navigation";
import { Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Trash, Split, AudioWaveform, MoreVertical, Copy, Check } from "lucide-react";

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-playfair-display',
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
});

function CustomLink({ href, children }) {
    return (
        <a
            target="_blank"
            rel="noopener noreferrer"
            href={href}
            className="text-white underline decoration-white/30 hover:decoration-white hover:text-orange-400 break-words whitespace-normal transition-colors duration-200"
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
    <p className="text-[1.05rem] leading-[1.75] py-2 text-white/90">{children}</p>
);

const CustomUl = ({ children }) => (
    <ul className="list-disc ml-6 py-2 space-y-2 text-[1.05rem] text-white/90 marker:text-orange-400">{children}</ul>
);

const CustomOl = ({ children }) => (
    <ol className="list-decimal ml-6 py-2 space-y-2 text-[1.05rem] text-white/90 marker:text-orange-400">{children}</ol>
);


const CustomLi = ({ children }) => (
    <li className="py-1 leading-[1.7]">{children}</li>
);

const ChatInterface = ({
    messages,
    setMessagesInStore,
    deleteNode,
    setActiveNode,
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

    const router = useRouter();

    // scroll to bottom on re-render
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" }); 9
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
            <div data-lenis-prevent className=" w-full flex-1 min-h-0 pb-50 flex flex-col items-center overflow-x-scroll overflow-y-auto">
                {
                    (navigatingThread) && (
                        <div className="loader-4 fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 h-full w-full">
                            <VerticalBarsLoader />
                            <div className="text-orange-400 text-sm">Fetching Thread...</div>
                        </div>
                    )
                }
                <div>
                    {messages.length === 0 ? (
                        <div className={`sm:text-5xl text-2xl mt-74 flex flex-col items-center justify-center ${playfairDisplay.className} `}>
                            <div className="flex">
                                <h1 className="bg-gradient-to-r py-4 from-neutral-300 to-neutral-500 bg-clip-text text-transparent">Hey
                                </h1>
                                <h1 className="mx-4 bg-gradient-to-r py-4 from-orange-400 via-orange-500 to-yellow-500 bg-clip-text text-transparent">{name}
                                </h1>
                            </div>
                            <h1 className="bg-gradient-to-r py-4 from-neutral-300 to-neutral-500 bg-clip-text text-transparent">What can I help you with Today?</h1>
                        </div>
                    ) : (
                        <div className="w-full max-w-6xl py-4 px-4 md:px-12">

                            {messages.map((msg, index) => (
                                <div key={index} className={`mb-4 break-words flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    {
                                        ((msg.role === "model")) && (
                                            <div className="my-4 self-start flex-shrink-0 h-full rounded-full">
                                                <div className={`
                                                    ${(((index === messages.length - 1) && (!responseComplete && (responseComplete !== null)))
                                                        ? "animate-pulse" : ""
                                                    )}                
                                                `}>
                                                    <AudioWaveform size={28} className="text-orange-400" />
                                                </div>
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

                                    <div className={`flex flex-col px-7 py-3 rounded-2xl text-white/85 rounded-tl-xs ${msg.role === "user" ? "items-end" : "items-start"}`}>

                                        {
                                            msg.role === "model" && (
                                                <div className="flex flex-row w-fit h-fit rounded-full px-3 py-1 mb-2 bg-white/5 border border-white/10 text-white/50 text-sm font-medium">
                                                    {msg.ai_model.itemName}
                                                </div>
                                            )
                                        }
                                        <div className={`text-[0.95rem] ${jetbrainsMono.className} ${msg.role === "user" ? "px-6 py-4 rounded-2xl max-w-[85%] bg-white/5 border border-white/10 text-white/90 rounded-tr-sm shadow-sm" : `px-6 py-[5px] rounded-2xl max-w-[85%] bg-white/5 border border-white/5 text-white/90 rounded-tl-sm shadow-sm `}`}>
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
                                                {(CopyContent && (ToolbarTriggerIndex === index)) ? (<Check className="text-white" size={20} />) : (<Copy className="text-white" size={20} />)}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setMoreMenu((prev) => (!prev))
                                                    setToolbarTriggerIndex(index);
                                                }}
                                                className="relative mx-2 cursor-pointer hover:bg-white/10 border border-white/0 hover:border-white/30 rounded-full transition-all duration-200 ease-in-out"
                                            >
                                                <MoreVertical size={25} className={`p-1 text-white opacity-50 hover:opacity-100 ${msg.role === "user" ? "mr-[-8px]" : ""}`} />
                                                {
                                                    MoreMenu && (index === ToolbarTriggerIndex) && (
                                                        <div ref={MoreMenuRef} className="absolute mt-1 bg-neutral-900 border border-white/20 rounded-sm shadow-md animate-fadeIn z-[101] flex flex-col p-1 w-fit">
                                                            <div
                                                                onClick={() => {
                                                                    setActiveNode(msg.id);
                                                                    router.push(`/playgrounds/lumina/${CurrThreadID}?node=${msg.id}`);
                                                                    setMoreMenu(false);
                                                                }}
                                                                className="p-1 rounded-lg w-full h-fit flex flex-row gap-2 px-2 items-center hover:bg-white/10 cursor-pointer transition-all duration-300 ease-in-out text-white"
                                                            >
                                                                <Split color="orange" size={16} className="flex-shrink-0" />
                                                                <p>Branch</p>
                                                            </div>
                                                            <div
                                                                onClick={async () => {

                                                                    const { data, error } = await deleteMessage(CurrThreadID, msg.id);
                                                                    if (error) {
                                                                        setalertMessage(error);
                                                                        setalert(true);
                                                                        return;
                                                                    }

                                                                    setMoreMenu(false);

                                                                    if (ToolbarTriggerIndex === messages.length - 1) {
                                                                        if (messages.length > 1) {
                                                                            const prevNodeId = messages[messages.length - 2].id;
                                                                            setActiveNode(prevNodeId);
                                                                            router.push(`/playgrounds/lumina/${CurrThreadID}?node=${prevNodeId}`);
                                                                        } else {
                                                                            setActiveNode(null);
                                                                            router.push(`/playgrounds/lumina/${CurrThreadID}`);
                                                                        }
                                                                    } else {
                                                                        //todo
                                                                    }
                                                                    deleteNode(msg.id);
                                                                }}
                                                                className="p-1 rounded-lg w-full h-fit flex flex-row gap-2 px-2 items-center hover:bg-red-800/30 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-red-500"
                                                            >
                                                                <Trash color="red" size={16} className="flex-shrink-0" />
                                                                <p>Delete</p>
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
                    <div className="pointer-events-none absolute left-0 bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-black" />
                </div >
            </div >
            <PromptBox
                navigatingThread={navigatingThread}
                onPrompt={handleNewPrompt}
                messages={messages}
                onStreamResponse={handleStreamResponse}
                setresponseComplete={setresponseComplete}
                Model={Model}
                selectedFiles={selectedFiles}
                CurrThreadID={CurrThreadID} />
        </div>
    );
};

export default ChatInterface;
