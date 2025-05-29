"use client"
import Sidebar from "@/components/lumina/Sidebar"
import PromptBox from "@/components/lumina/PromptBox";
import ReactMarkdown from 'react-markdown';
import { useState } from "react";
import remarkGfm from 'remark-gfm';
import { useRef, useEffect } from "react";
import Image from "next/image";
import TopBar from "@/components/lumina/TopBar";
import MoreIcon from "@/components/icons/MoreIcon";
import LikeIcon from "@/components/icons/LikeIcon";
import DislikeIcon from "@/components/icons/DislikeIcon";
import CopyIcon from "@/components/icons/CopyIcon";

function CustomLink({ href, children }) {
    return (
        <a target="_blank" rel="noopener noreferrer" href={href} className="text-cyan-400 hover:text-blue-400">
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
    <p className="text-xl leading-relaxed py-2">{children}</p>
);

const CustomUl = ({ children }) => (
    <ul className="list-disc ml-6 py-2 space-y-2">{children}</ul>
);

const CustomOl = ({ children }) => (
    <ol className="list-decimal ml-6 py-2 space-y-2">{children}</ol>
);


const CustomLi = ({ children }) => (
    <li className="py-1">{children}</li>
);

const defaultModel = {
    itemName: "Gemini 2.0 Flash", id: "gemini-2.0-flash"
}
const toolbar = [
    { itemName: "Like", icon: <LikeIcon fill="white" size={20} /> },
    { itemName: "Dislike", icon: <DislikeIcon fill="white" size={20} /> },
    { itemName: "Copy", icon: <CopyIcon fill="white" size={20} /> },
    { itemName: "More", icon: <MoreIcon stroke="white" size={20} /> },
];

function Lumina() {

    const [sidebarClose, setsidebarClose] = useState(false);

    const [messages, setMessages] = useState([]);
    const [gotResponse, setgotResponse] = useState(false);

    const [Model, setModel] = useState(defaultModel)




    // handlers to add user and AI messages
    const handleNewPrompt = (userPrompt) => {
        setMessages(prev => [
            ...prev,
            { role: "user", text: userPrompt },
        ]);
        setgotResponse(false);
    };

    // appending stream responses
    const handleStreamResponse = (streamResponse) => {
        setMessages(prev => {
            // if last message is ai, update it; else, add new ai message
            if (prev.length > 0 && prev[prev.length - 1].role === "ai") {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], text: streamResponse };
                return updated;
            } else {
                return [...prev, { role: "ai", text: streamResponse, responseComplete: false, model: Model }];
            }
        });
    };


    //handling updation of responseComplete key after gotresponse
    const handleResponseComplete = () => {
        setMessages(prev => {
            const updated = [...prev];

            // Create a copy to avoid direct mutation
            // Becauses (https://react.dev/learn/updating-objects-in-state) and (https://react.dev/learn/updating-arrays-in-state)

            updated[updated.length - 1] = { ...updated[updated.length - 1], responseComplete: true };
            return updated;
        });
    };



    // scroll to bottom on re-render
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-row h-screen w-full overflow-hidden">
            <Sidebar page="Lumina" setsidebarClose={setsidebarClose} />
            <main className="w-full h-screen flex flex-col justify-between items-center ">
                <TopBar sidebarClose={sidebarClose} Model={Model} setModel={setModel} />

                <div className=" w-full h-screen pb-50 flex flex-col items-center overflow-x-scroll overflow-y-auto">

                    <div>
                        {messages.length === 0 ? (
                            <div className="text-5xl mt-74 flex flex-col items-center justify-center ">
                                <h1 className="bg-gradient-to-r py-4 from-green-400 to-cyan-400 bg-clip-text text-transparent">Hey Buddy</h1>
                                <h1 className="bg-gradient-to-r py-4 from-green-400 to-cyan-400 bg-clip-text text-transparent">What can I help you with Today ?</h1>
                            </div>
                        ) : (
                            <div className="w-240 py-4">

                                {messages.map((msg, index) => (
                                    <div key={index} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        {
                                            msg.role === "ai" && (
                                                <div className={`${msg.responseComplete ? ("self-start mt-2") : ("fixed left-[50%] top-[2%]")} flex-shrink-0 h-full`}>
                                                    {
                                                        (msg.responseComplete) ? (
                                                            <Image
                                                                src={"/lumina.jpg"}
                                                                alt="Lumina"
                                                                width={48}
                                                                height={48}
                                                                className="rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center">
                                                                <div className="loader">
                                                                    <div className="inner one"></div>
                                                                    <div className="inner two"></div>
                                                                    <div className="inner three"></div>
                                                                </div>
                                                                <div className="px-4">
                                                                    THINKING...
                                                                </div>
                                                            </div>
                                                        )}
                                                </div>
                                            )
                                        }

                                        <div className={`inline-block px-10 py-3 rounded-2xl ${msg.role === "user" ? "bg-white/10 text-white/85 rounded-tr-xs" : "text-white/85 rounded-tl-xs"}`}>

                                            {
                                                msg.role === "ai" && (
                                                    <div className="flex flex-row w-fit h-fit rounded-2xl p-2 border border-white/50 text-cyan-400/85">
                                                        {msg.model.itemName}
                                                    </div>
                                                )
                                            }

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
                                                {msg.text}
                                            </ReactMarkdown>


                                            {/* toolbar */}
                                            {

                                                msg.role === "ai" && (
                                                    <div className="flex flex-row w-fit h-fit p-2 mx-0 m-2 rounded-2xl bg-white/10">
                                                        {toolbar.map((item) => (
                                                            <div key={item.itemName} className="mx-2 cursor-pointer">
                                                                {item.icon}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )


                                            }
                                        </div>
                                    </div>
                                ))}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                        <div className="w-full fixed bottom-0 h-[7vw] backdrop-blur-xs"></div>
                    </div>
                </div>

                <PromptBox onPrompt={handleNewPrompt} onStreamResponse={handleStreamResponse} gotResponse={setgotResponse} handleResponseComplete={handleResponseComplete} Model={Model} />

            </main >
        </div >
    )
}

export default Lumina;