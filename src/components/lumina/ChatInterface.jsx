"use client"
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VerticalBarsLoader from "@/components/VerticalBarsLoader";
import TextLoader from "@/components/lumina/TextLoader";
import PromptBox from "@/components/lumina/PromptBox";
import { deleteMessage } from "@/app/playgrounds/(playgrounds)/lumina/_actions/deleteMessage";
import { useRouter } from "next/navigation";
import { Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Trash, Split, AudioWaveform, MoreVertical, Copy, Check, ChevronDown, ChevronUp, Terminal, Code2, BrainCircuit, Globe } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

const CustomTable = ({ children }) => (
    <div className="overflow-x-auto my-4 w-full">
        <table className="w-full text-sm text-left border-collapse border border-white/20">
            {children}
        </table>
    </div>
);

const CustomTh = ({ children }) => (
    <th className="px-4 py-2 border border-white/20 bg-white/10 font-medium text-white/90">{children}</th>
);

const CustomTd = ({ children }) => (
    <td className="px-4 py-2 border border-white/20 text-white/80">{children}</td>
);

const CustomImg = ({ src, alt, ...props }) => {
    if (!src) return null;
    return (
        <img src={src} alt={alt} {...props} className="my-4 max-w-full h-auto rounded-xl border border-white/20 shadow-lg object-contain bg-white/5" />
    );
};

const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="text-white/50 hover:text-white transition-colors"
            title="Copy Code"
        >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
    );
};

const CustomCode = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');

    return !inline && match ? (
        <div className="my-4 rounded-lg overflow-hidden border border-white/10 text-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                <span className="text-xs text-white/50 font-medium tracking-wider uppercase">{match[1]}</span>
                <CopyButton text={String(children).replace(/\n$/, '')} />
            </div>
            <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                customStyle={{ margin: 0, padding: '1rem', background: '#0d0d0d' }}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </div>
    ) : (
        <code {...props} className="bg-white/10 text-orange-300 px-1.5 py-0.5 rounded text-[0.9em]">
            {children}
        </code>
    );
};

const ThinkBlock = ({ content, isStreaming, isThinking }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (isThinking) {
            setIsExpanded(true);
        } else if (!isStreaming && content) {
             setIsExpanded(false); 
        }
    }, [isThinking, isStreaming, content]);

    return (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-white/70 hover:text-white transition-colors bg-white/5"
            >
                <div className="flex items-center gap-2">
                    {isThinking ? (
                        <div className="flex space-x-1 items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                        </div>
                    ) : (
                        <span className="text-orange-400">
                            <BrainCircuit size={16} />
                        </span>
                    )}
                    <span className="font-semibold">{isThinking ? 'Thinking...' : 'Thought Process'}</span>
                </div>
                <div className="flex items-center justify-center">
                    {isExpanded ? (
                        <ChevronUp size={16} />
                    ) : (
                        <ChevronDown size={16} />
                    )}
                </div>
            </button>
            {isExpanded && (
                <div className="px-4 py-3 text-sm text-white/60 border-t border-white/10 whitespace-pre-wrap font-mono leading-relaxed bg-black/40">
                    {content}
                </div>
            )}
        </div>
    );
};

const CitationsBlock = ({ citations }) => {
    if (!citations || citations.length === 0) return null;

    return (
        <div className="mt-4 pt-3 border-t border-white/10 w-full">
            <div className="text-xs text-white/50 mb-2 font-medium uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={12} />
                Sources
            </div>
            <div className="flex flex-wrap gap-2">
                {citations.map((c, idx) => (
                    <a
                        key={idx}
                        href={c.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs text-white/80 transition-colors max-w-[200px] group"
                        title={c.title}
                    >
                        <span className="truncate group-hover:text-orange-400 transition-colors">{c.title}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

const CodeExecutionBlock = ({ executions }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!executions || executions.length === 0) return null;

    return (
        <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-black/20">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm text-white/70 hover:text-white transition-colors bg-white/5"
            >
                <div className="flex items-center gap-2">
                    <span className="text-orange-400">
                        <Code2 size={16} />
                    </span>
                    <span className="font-semibold">Executed Tool: Python Code</span>
                </div>
                <div className="flex items-center justify-center">
                    {isExpanded ? (
                        <ChevronUp size={16} />
                    ) : (
                        <ChevronDown size={16} />
                    )}
                </div>
            </button>
            {isExpanded && (
                <div className="p-4 border-t border-white/10 bg-black/40 flex flex-col gap-4">
                    {executions.map((exec, idx) => (
                        <div key={idx} className="bg-[#0d0d0d] border border-white/10 rounded-lg overflow-hidden">
                            {exec.type === 'code' ? (
                                <>
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <Code2 size={14} className="text-white/50" />
                                            <span className="text-xs text-white/50 font-medium tracking-wider uppercase">{exec.language || 'Python'}</span>
                                        </div>
                                        <CopyButton text={exec.code.trim()} />
                                    </div>
                                    <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={(exec.language || 'python').toLowerCase()}
                                        PreTag="div"
                                        customStyle={{ margin: 0, padding: '1rem', background: '#0d0d0d', fontSize: '0.85rem' }}
                                    >
                                        {exec.code.trim()}
                                    </SyntaxHighlighter>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/10">
                                        <div className="flex items-center gap-2">
                                            <Terminal size={14} className="text-white/50" />
                                            <span className={`text-xs font-medium tracking-wider uppercase ${exec.outcome === 'OUTCOME_OK' ? 'text-green-400' : 'text-red-400'}`}>
                                                Output ({exec.outcome})
                                            </span>
                                        </div>
                                        <CopyButton text={exec.output.trim()} />
                                    </div>
                                    <div className="p-3 overflow-x-auto text-xs font-mono text-white/60">
                                        <pre><code>{exec.output.trim()}</code></pre>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TypewriterMarkdown = ({ content, isStreaming }) => {
    const [displayedContent, setDisplayedContent] = useState(content);

    useEffect(() => {
        if (!isStreaming) {
            setDisplayedContent(content);
            return;
        }
    }, [isStreaming, content]);

    useEffect(() => {
        if (!isStreaming) return;
        if (content.length < displayedContent.length || content === "") {
            setDisplayedContent(content);
            return;
        }

        if (displayedContent.length < content.length) {
            const timeout = setTimeout(() => {
                setDisplayedContent(content.substring(0, displayedContent.length + 4));
            }, 10);
            return () => clearTimeout(timeout);
        }
    }, [content, displayedContent, isStreaming]);

    let mainContent = displayedContent;
    let thinkContent = null;
    let isThinking = false;
    let citationsContent = null;
    let codeExecutionsContent = null;

    const thinkMatch = displayedContent.match(/<think>([\s\S]*?)(?:<\/think>|$)/);
    if (thinkMatch) {
        thinkContent = thinkMatch[1].trim();
        mainContent = displayedContent.replace(/<think>[\s\S]*?(?:<\/think>|$)/, '').trim();
        if (isStreaming && !displayedContent.includes('</think>')) {
            isThinking = true;
        }
    }

    const citationsMatch = displayedContent.match(/<citations>([\s\S]*?)(?:<\/citations>|$)/);
    if (citationsMatch) {
        try {
            citationsContent = JSON.parse(citationsMatch[1].trim());
        } catch (e) {
            // silently ignore if json is incomplete because of streaming
        }
        mainContent = mainContent.replace(/<citations>[\s\S]*?(?:<\/citations>|$)/, '').trim();
    }

    const execMatch = displayedContent.match(/<codeexecution>([\s\S]*?)(?:<\/codeexecution>|$)/);
    if (execMatch) {
        try {
            codeExecutionsContent = JSON.parse(execMatch[1].trim());
        } catch (e) {}
        mainContent = mainContent.replace(/<codeexecution>[\s\S]*?(?:<\/codeexecution>|$)/, '').trim();
    }

    return (
        <div className="flex flex-col w-full">
            {(thinkContent !== null && thinkContent !== "") && (
                <ThinkBlock content={thinkContent} isStreaming={isStreaming} isThinking={isThinking} />
            )}
            {mainContent && (
                <div className="w-full">
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
                            table: CustomTable,
                            th: CustomTh,
                            td: CustomTd,
                            code: CustomCode,
                            img: CustomImg,
                        }
                    } 
                    remarkPlugins={[remarkGfm]}
                    urlTransform={(value) => value.startsWith('data:') ? value : value}
                    >
                        {mainContent}
                    </ReactMarkdown>
                </div>
            )}
            <CodeExecutionBlock executions={codeExecutionsContent} />
            <CitationsBlock citations={citationsContent} />
        </div>
    );
};

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
    CurrThreadName,
    ThreadPublic,
    handleNewPrompt,
    handleStreamResponse,
    setalert,
    setalertMessage
}) => {

    const router = useRouter();

    const messagesEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const isUserScrolledUp = useRef(false);

    const handleScroll = (e) => {
        const container = e.target;
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        isUserScrolledUp.current = !isNearBottom;
    };

    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;

            if (!isUserScrolledUp.current || messages.length <= 2) {

                const isStreaming = !responseComplete && responseComplete !== null;

                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: isStreaming ? "auto" : "smooth"
                });
            }
        }
    }, [messages, responseComplete]);


    const loadingMessages = [
        "Analysing...",
        "Thinking...",
        "Generating...",
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
            <div ref={scrollContainerRef} onScroll={handleScroll} data-lenis-prevent className=" w-full flex-1 min-h-0 pb-50 flex flex-col items-center overflow-x-scroll overflow-y-auto">
                {
                    (navigatingThread) && (
                        <div className="loader-4 fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 h-full w-full">
                            <VerticalBarsLoader />
                            <div className="text-orange-400 text-sm">Fetching Thread...</div>
                        </div>
                    )
                }
                <div className="w-full flex justify-center">
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
                        <div className="w-full max-w-6xl py-4 px-2 md:px-12">

                            {messages.map((msg, index) => (
                                <div key={index} className={`mb-4 w-full flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`flex flex-col px-2 md:px-7 py-2 md:py-3 ${msg.role === "user" ? "max-w-[90%] md:max-w-[85%]" : "max-w-[98%] md:max-w-[85%]"} rounded-2xl text-white/85 rounded-tl-xs ${msg.role === "user" ? "items-end" : "items-start"}`}>

                                        {
                                            msg.role === "model" && (
                                                <div className="flex flex-row items-center gap-2 mb-2 w-fit">
                                                    <div className={`
                                                        ${(((index === messages.length - 1) && (!responseComplete && (responseComplete !== null)))
                                                            ? "animate-pulse" : ""
                                                        )}                
                                                    `}>
                                                        <AudioWaveform size={22} className="text-orange-400" />
                                                    </div>
                                                    <div className="flex flex-row w-fit h-fit rounded-full px-3 py-1 bg-white/5 border border-white/10 text-white/50 text-xs md:text-sm font-medium">
                                                        {msg.ai_model.itemName}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        <div className={`text-[0.95rem] ${jetbrainsMono.className} break-words ${msg.role === "user" ? "px-4 md:px-6 py-3 md:py-4 rounded-2xl bg-white/5 border border-white/10 text-white/90 rounded-tr-sm shadow-sm" : `px-4 md:px-6 py-2 md:py-[5px] rounded-2xl bg-white/5 border border-white/5 text-white/90 rounded-tl-sm shadow-sm `}`}>
                                            {(!responseComplete && responseComplete !== null && index === messages.length - 1 && !msg.content) ? (
                                                <TextLoader currentLoadingMessage={currentLoadingMessage} />
                                            ) : (
                                                <TypewriterMarkdown
                                                    content={msg.content}
                                                    isStreaming={!responseComplete && responseComplete !== null && index === messages.length - 1 && msg.role === 'model'}
                                                />
                                            )}
                                        </div>

                                        {/* toolbar */}

                                        <div className={`flex flex-row w-fit h-fit p-2 mx-0 m-2 ${msg.role === "user" ? ("self-end") : ("self-start")}`}>
                                            {/* toolbar from the map */}
                                            <button
                                                onClick={() => {
                                                    handleCopy(msg.content);
                                                    setToolbarTriggerIndex(index);
                                                }}
                                                className="flex items-center justify-center w-8 h-8 mx-2 cursor-pointer opacity-50 hover:opacity-100 hover:bg-white/10 rounded-full transition-all duration-300 ease-in-out">
                                                {(CopyContent && (ToolbarTriggerIndex === index)) ? (<Check className="text-white" size={18} />) : (<Copy className="text-white" size={18} />)}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setMoreMenu((prev) => (!prev))
                                                    setToolbarTriggerIndex(index);
                                                }}
                                                className="relative flex items-center justify-center w-8 h-8 mx-2 cursor-pointer hover:bg-white/10 border border-white/0 hover:border-white/30 rounded-full transition-all duration-200 ease-in-out"
                                            >
                                                <MoreVertical size={20} className="text-white opacity-50 hover:opacity-100" />
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

                            {(!responseComplete && responseComplete !== null && (messages.length === 0 || messages[messages.length - 1].role === 'user')) && (
                                <div className="mb-4 w-full flex justify-start">
                                    <div className="flex flex-col px-2 md:px-7 py-2 md:py-3 max-w-[98%] md:max-w-[85%] rounded-2xl text-white/85 rounded-tl-xs items-start">
                                        <div className="flex flex-row items-center gap-2 mb-2 w-fit">
                                            <div className="animate-pulse">
                                                <AudioWaveform size={22} className="text-orange-400" />
                                            </div>
                                        </div>
                                        <div className={`text-[0.95rem] ${jetbrainsMono.className} px-4 md:px-6 py-2 md:py-[5px] rounded-2xl bg-white/5 border border-white/5 text-white/90 rounded-tl-sm shadow-sm`}>
                                            <TextLoader currentLoadingMessage={currentLoadingMessage} />
                                        </div>
                                    </div>
                                </div>
                            )}
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
                CurrThreadID={CurrThreadID}
                CurrThreadName={CurrThreadName}
                ThreadPublic={ThreadPublic} />
        </div>
    );
};

export default ChatInterface;
