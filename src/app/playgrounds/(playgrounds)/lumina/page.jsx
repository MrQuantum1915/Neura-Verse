"use client"
import Sidebar from "@/components/lumina/Sidebar"
import PromptBox from "@/components/lumina/PromptBox";
import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from "react";
import remarkGfm from 'remark-gfm';
import Image from "next/image";
import TopBar from "@/components/lumina/TopBar";
import WorkSpace from "@/components/lumina/WorkSpace";
import MyAlert from "@/components/MyAlert";

// serve actions
import { createClient_client } from "@/utils/supabase/supabaseClient"; // using browser client as this is a client side component
import { fetchThread } from "./_actions/fetchThread";
import { insertNewMessage } from "./_actions/insertNewMessage";
import { createNewThread } from "./_actions/createNewThread";

import MoreIcon from "@/components/icons/MoreIcon";
import LikeIcon from "@/components/icons/LikeIcon";
import DislikeIcon from "@/components/icons/DislikeIcon";
import CopyIcon from "@/components/icons/CopyIcon";
// import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

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
    <ol className="list-decimal ml-6 py-2 space-y-2 text-lg">{children}</ol>
);


const CustomLi = ({ children }) => (
    <li className="py-1 text-lg">{children}</li>
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

    // for alerts
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");

    // for user session and login
    const [name, setname] = useState("Visitor")
    const [profile_pic, setprofile_pic] = useState(null)

    // this runs on every full render and checks if session is active or user logged in
    const router = useRouter();

    useEffect(() => {
        const fetchUserLoggedIn = async () => {
            try {
                const supabase = createClient_client();
                const { data: { session } } = await supabase.auth.getSession();
                // console.log(session);
                // console.log(session===null);
                if (session === null) {
                    router.push("/auth/login");
                }
                // if (!session || !session.user) {
                // redirect("/auth/login");
                // }
                else {

                    function getCookie(name) {
                        const value = `; ${document.cookie}`; // prepend a semicolon and space to all cookies to make splitting easier

                        const parts = value.split(`; ${name}=`);   // split the cookie string into parts at the desired cookie name (with the pattern "; name=")
                        // if the cookie was found, there will be 2 parts in the array
                        if (parts.length === 2) {
                            // pop the last part (after the cookie name), split at the next semicolon, and get the first value (the cookie value itself)
                            return decodeURIComponent(parts.pop().split(';').shift()); // because cookie stores the url in encoded version due to certain characters, so we need to decode it first.
                        }
                        else {
                            return null;
                        }
                    }

                    setprofile_pic(getCookie('profile_pic'));
                    const fullName = getCookie('full_name');
                    if (fullName === null) {
                        setname(getCookie('username'));
                    } else {
                        setname(fullName);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserLoggedIn();
    }, []);


    // for frontend
    const [sidebarClose, setsidebarClose] = useState(false);

    const [messages, setMessages] = useState([]);
    const [Frontend_UploadedFiles, setFrontend_UploadedFiles] = useState([]);
    const [UploadedFiles_middlewareSet, setUploadedFiles_middlewareSet] = useState(new Set());
    const [selectedFiles, setselectedFiles] = useState([]);
    const [UploadingFile, setUploadingFile] = useState(false);

    const [responseComplete, setresponseComplete] = useState(null); // set to null because when first time page mounts, we do not need this to trigger the insertAIResponse() function.

    const [Model, setModel] = useState(defaultModel);



    // managing threads
    const [CurrThreadID, setCurrThreadID] = useState(null);
    const [CurrThreadName, setCurrThreadName] = useState("New Thread")
    const [navigatingThread, setnavigatingThread] = useState(false)

    // This block is implemented because here we are using CurrThreadName and ID in various operation like inserting messages in database. And as state upadates are async, they may not get latest value of the CURRThreadName and ID. So use this ref there.
    // create refs for thread ID/name
    const currThreadIDRef = useRef(CurrThreadID);
    const currThreadNameRef = useRef(CurrThreadName);

    // update refs when thread ID/name change
    useEffect(() => {
        currThreadIDRef.current = CurrThreadID;
        currThreadNameRef.current = CurrThreadName;
    }, [CurrThreadID, CurrThreadName]);
    //


    // managing fetching of chat from threadID
    useEffect(() => {
        if (CurrThreadID === null) { // when new thread button is clicked it sets thread ID to null, hence now reset the messages array in frontend
            setMessages([]);
        }
        else {
            if (navigatingThread) {

                setnavigatingThread(false);

                const fetchChat = async () => {
                    if (CurrThreadID == null) {
                        return;
                    }

                    const { data, error } = await fetchThread(CurrThreadID);
                    if (error) {
                        setalertMessage(error);
                        setalert(true);
                        return;
                    }
                    setMessages(data);
                }
                fetchChat();
            }
        }
    }, [CurrThreadID])


    // handlers to add user and AI messages
    const handleNewPrompt = async (userPrompt) => {
        setresponseComplete(false);
        const newMessages = [
            ...messages,
            { role: "user", content: userPrompt },
        ];
        setMessages(newMessages);



        // if this is first message, update thread name
        let tempThreadId;
        if (messages.length === 0) { // 2 because after setMessages() this still will be 2 not 3 because state update are async. And 2 because there are already 2 dummy messages while creating new thread.
            const { data, error } = await createNewThread(userPrompt);

            if (error) {
                setalertMessage(error);
                setalert(true);
                return;
            }
            // setalertMessage(data[0].thread_id);
            // setalert(true); 
            setCurrThreadID(data[0].thread_id);
            tempThreadId = data[0].thread_id;
            setCurrThreadName(userPrompt);
        }
        else {

            const threadNameToUse = messages.length === 0 ? userPrompt : CurrThreadName; //  we cant rely on CurrThreadName to use it when thread name is updated in above if(). bcz state update are async

            const { data, error } = await insertNewMessage( // sending three arguments, one is thread id second is name and third is object having role,content,ai_model
                CurrThreadID,
                threadNameToUse,
                { role: "user", content: userPrompt, ai_model: null }
            );

            if (error) {
                setalertMessage(error);
                setalert(true);
            }
        }
    };

    // appending stream responses
    const handleStreamResponse = (streamResponse) => {
        setMessages(prev => {
            // if last message is ai, update it; else, add new ai message
            if (prev.length > 0 && prev[prev.length - 1].role === "model") {
                const updated = [...prev];
                updated[updated.length - 1] = { ...updated[updated.length - 1], content: streamResponse };
                return updated;
            } else {
                return [...prev, { role: "model", content: streamResponse, ai_model: Model }];
            }
        });
    };


    // to insert the ai response to database after got response in currThread.
    useEffect(() => {

        const insertAIResponse = async () => {
            try {
                // here i used CurrThreadID insetaed of ref value because see this scenario : when user navigate to differetn thread while ai response in curr thread is pending, if we use ref value than it will insert the message in the new navaigated thread instead of previous, so here i am using stale value.

                const { data, error } = await insertNewMessage(CurrThreadID, CurrThreadName, { role: "model", content: messages[messages.length - 1].content, ai_model: messages[messages.length - 1].ai_model }) // sending three arguments, one is thread id second is name and third is object having role,content,ai_model
                if (error) {
                    setalertMessage(error);
                    setalert(true);
                }
            } catch (err) {
                setalertMessage(err.message);
                setalert(true);
            }
        }

        if (responseComplete) {
            insertAIResponse();
        }

    }, [responseComplete])


    // //handling updation of responseComplete key after gotresponse
    // const handleResponseComplete = async () => {
    //     setMessages(prev => {
    //         const updated = [...prev];

    //         // Create a copy to avoid direct mutation
    //         // Becauses (https://react.dev/learn/updating-objects-in-state) and (https://react.dev/learn/updating-arrays-in-state)

    //         updated[updated.length - 1] = { ...updated[updated.length - 1], responseComplete: true };
    //         return updated;
    //     });
    // };



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


    return (
        <div className={`flex flex-row h-screen w-full overflow-hidden`}>
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }
            <Sidebar page="Lumina" setsidebarClose={setsidebarClose} profile_pic={profile_pic} CurrThreadID={CurrThreadID} setCurrThreadID={setCurrThreadID} CurrThreadName={CurrThreadName} setCurrThreadName={setCurrThreadName} setnavigatingThread={setnavigatingThread} responseComplete={responseComplete} navigatingThread={navigatingThread} />

            <main className="w-full h-full flex flex-col justify-between items-center ">

                <TopBar sidebarClose={sidebarClose} Model={Model} setModel={setModel} page="Lumina" CurrThreadName={CurrThreadName} setCurrThreadName={setCurrThreadName} CurrThreadID={CurrThreadID} />

                {/* Set height below TopBar to fill remaining space */}
                <div className="flex w-full flex-row" style={{ height: "calc(100vh - 90px)" }}>
                    <div className="flex flex-col  w-full h-full items-center">
                        <div className=" w-full h-full pb-50 flex flex-col items-center overflow-x-scroll overflow-y-auto">

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
                                    <div className="w-240 py-4">

                                        {messages.map((msg, index) => (
                                            <div key={index} className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                {
                                                    ((msg.role === "model")) && (
                                                        <div className="my-4 self-start flex-shrink-0 h-full rounded-full">
                                                            <Image
                                                                src={"/ai_logo_orange-nobg.png"}
                                                                alt="Lumina"
                                                                width={50}
                                                                height={50}
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
                                                                (!responseComplete && (responseComplete!==null)) && (
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

                                                <div className={`inline-block px-10 py-3 rounded-2xl ${msg.role === "user" ? "bg-white/10 text-white/85 rounded-tr-xs max-w-150" : "text-white/85 rounded-tl-xs"}`}>

                                                    {
                                                        msg.role === "model" && (
                                                            <div className="flex flex-row w-fit h-fit rounded-2xl p-2 border border-white/50 text-cyan-400/85">
                                                                {msg.ai_model.itemName}
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
                                                        {msg.content}
                                                    </ReactMarkdown>


                                                    {/* toolbar */}
                                                    {

                                                        msg.role === "model" && (
                                                            <div className="flex flex-row w-fit h-fit p-2 mx-0 m-2 rounded-2xl bg-white/10">
                                                                {toolbar.map((item) => (
                                                                    <div key={item.itemName} className="mx-2 cursor-pointer opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out">
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
                                )
                                }
                                <div className="pointer-events-none absolute left-0 bottom-0 w-full h-50 z-20 bg-gradient-to-b from-transparent to-[#000000]/80" />
                            </div >
                        </div >
                        <PromptBox onPrompt={handleNewPrompt} onStreamResponse={handleStreamResponse} setresponseComplete={setresponseComplete} Model={Model} context={messages} Frontend_UploadedFiles={Frontend_UploadedFiles} setFrontend_UploadedFiles={setFrontend_UploadedFiles} UploadedFiles_middlewareSet={UploadedFiles_middlewareSet} setUploadedFiles_middlewareSet={setUploadedFiles_middlewareSet} selectedFiles={selectedFiles} setUploadingFile={setUploadingFile} UploadingFile={UploadingFile} />
                    </div>

                    <WorkSpace files={Frontend_UploadedFiles} setselectedFiles={setselectedFiles} selectedFiles={selectedFiles} UploadingFile={UploadingFile} />

                </div>

            </main >
        </div >
    )
}

export default Lumina;