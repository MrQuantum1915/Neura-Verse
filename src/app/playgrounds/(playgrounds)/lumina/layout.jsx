// named as [[...threadId]] because I want to catch all this routes /playground/lumina/ (no threadId), /playground/lumina/abc123 (with threadId)
// to manage absence of any threadId parameter
"use client"
import React, { use } from "react";
import Sidebar from "@/components/lumina/Sidebar"
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import TopBar from "@/components/lumina/TopBar";
import WorkSpace from "@/components/lumina/WorkSpace";
import MyAlert from "@/components/MyAlert";
import ChatInterface from "@/components/lumina/ChatInterface";

// serve actions
import { createClient_client } from "@/utils/supabase/supabaseClient"; // using browser client as this is a client side component
import { fetchThread } from "./_actions/fetchThread";
import { insertNewMessage } from "./_actions/insertNewMessage";

import { v7 } from "uuid";

import ThreadIdpage from "./[[...threadId]]/page";

import { redirect, useRouter } from "next/navigation";

import { Roboto } from 'next/font/google';
import NeuraFlowInterface from "@/components/lumina/NeuraFlowInterface";

import { useThreadStore, getActiveBranch } from "@/store/lumina/useThreadStore";
import { useShallow } from "zustand/shallow";

import { useInterfaceStore } from "@/store/lumina/useInterfaceStore";
import { add } from "mathjs";

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-roboto',
});

const models = [
    { itemName: "Gemini 3 Flash", id: "gemini-3-flash-preview", icon: "/gemini.svg" },
    // { itemName: "Gemini 3 Pro", id: "gemini-3-pro-preview", icon: "/gemini.svg" },
    { itemName: "Gemini 2.5 Flash", id: "gemini-2.5-flash", icon: "/gemini.svg" },
    { itemName: "Gemini 2.5 Flash-Lite", id: "gemini-2.5-flash-lite", icon: "/gemini.svg" },
    { itemName: "Gemini 2.5 Flash Preview 05-20", id: "gemini-2.5-flash-preview-05-20", icon: "/gemini.svg" },
    // { itemName: "Gemini 2.5 Flash Preview", id: "gemini-2.5-flash-preview-tts" }, //for audio
];

const toolbar = [
    // { itemName: "Like", icon: <LikeIcon fill="white" size={20} /> },
    // { itemName: "Dislike", icon: <DislikeIcon fill="white" size={20} /> },
    // { itemName: "More", icon: <MoreIcon stroke="white" size={20} /> },
];

function Lumina({ children }) {

    const router = useRouter();

    // for alerts
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");

    // for user session and login
    const [name, setname] = useState("Mystery Guest")
    const [profile_pic, setprofile_pic] = useState(null)

    // chat/neuragraph area related
    // const [ActiveInterface, setActiveInterface] = useState(1); // 1-chat, 2-neuragraph
    const ActiveInterface = useInterfaceStore((state) => state.activeInterface);
    const setActiveInterface = useInterfaceStore((state) => state.setActiveInterface);


    // this runs on every full render and checks if session is active or user logged in (client side)
    useEffect(() => {
        const fetchUserLoggedIn = async () => {
            try {
                const supabase = createClient_client();
                const { data: { session } } = await supabase.auth.getSession(); // only client side authentication
                // console.log(session);
                // console.log(session===null);
                if (session === null) {
                    // router.push("/auth/login");
                    return;
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
                        } else {
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

    const messages = useThreadStore(useShallow(getActiveBranch));// useshallow to prevent re-renders as getActiveBranch returns new array everytime -> new reference. We only need it to change when the content actually changes
    const setMessagesInStore = useThreadStore((state) => state.setMessages);
    const setActiveNode = useThreadStore((state) => state.setActiveNodeId);
    const deleteNode = useThreadStore((state) => state.deleteMessage);
    const addFirstChunk = useThreadStore((state) => state.addFirstChunk);
    const appendStreamChunk = useThreadStore((state) => state.appendStreamChunk);
    const addMessage = useThreadStore((state) => state.addMessage);
    const setNeuraFlow = useThreadStore((state) => state.setNeuraFlow);
    const getThreadStoreState = useThreadStore.getState;

    // const [messages, setMessages] = useState(() => useThreadStore.getState().getActiveBranch());
    const [files, setfiles] = useState([]);
    const [selectedFiles, setselectedFiles] = useState([]);

    const [responseComplete, setresponseComplete] = useState(null); // set to null because when first time page mounts, we do not need this to trigger the insertAIResponse() function.

    const [Model, setModel] = useState(models[0]);




    const [CurrThreadID, setCurrThreadID] = useState(null);
    const [CurrThreadName, setCurrThreadName] = useState("New Thread");
    const [navigatingThread, setnavigatingThread] = useState(false);
    const [ThreadPublic, setThreadPublic] = useState(false);
    const [newchat, setnewchat] = useState(false);

    //related to current branch
    const [nodeID, setNodeID] = useState(null);

    // This block is implemented because here we are using CurrThreadName and ID in various operation like inserting messages in database. And as state upadates are async, they may not get latest value of the CURRThreadName and ID. So use this ref there.
    // create refs for thread ID/name
    // const currThreadIDRef = useRef(CurrThreadID);
    // const currThreadNameRef = useRef(CurrThreadName);

    // // update refs when thread ID/name change
    // useEffect(() => {
    //     currThreadIDRef.current = CurrThreadID;
    //     currThreadNameRef.current = CurrThreadName;
    // }, [CurrThreadID, CurrThreadName]);
    // //


    // managing fetching of chat from threadID
    useEffect(() => {
        // setresponseComplete(null)
        if (CurrThreadID === null) { // when new thread button is clicked it sets thread ID to null, hence now reset the messages array in frontend
            setCurrThreadName("New Thread");
            setMessagesInStore(null, []);
            setNeuraFlow({ nodes: [], edges: [] });
        }
        else {
            if (!newchat) {
                setnavigatingThread(true);
                const getThread = async () => {
                    try {
                        const { data, error } = await fetchThread(CurrThreadID);
                        if (error) {
                            setalertMessage(error);
                            setalert(true);
                            return;
                        }
                        else {
                            const { content, neuraFlow } = data;
                            setMessagesInStore(CurrThreadID, content);

                            const defaultNodeId = content[content.length - 1]?.id;

                            setActiveNode(defaultNodeId);
                            router.push(`/playgrounds/lumina/${CurrThreadID}?node=${defaultNodeId}`);


                            setNeuraFlow(neuraFlow);
                            setCurrThreadName(content[0].thread_name);
                            if (content[0].is_public === true) {
                                setThreadPublic(true);
                            }
                            else {
                                setThreadPublic(false);
                            }
                        }
                    } catch (err) {
                        setalertMessage(err.message);
                        setalert(true);
                    }

                    finally {
                        setnavigatingThread(false);
                    }
                }

                getThread();

            }
            else {
                setnewchat(false);
            }
        }
    }, [CurrThreadID])


    // add new message
    const handleNewPrompt = async (userPrompt) => {
        setresponseComplete(false);

        // add in store
        const messageId = v7();
        const parentId = messages.length > 0 ? messages[messages.length - 1].id : null;
        const temp = {
            id: messageId,
            role: "user",
            content: userPrompt,
            ai_model: null,
            is_public: ThreadPublic,
            thread_name: CurrThreadName,
            parent_id: parentId,
            is_head: false
        };
        addMessage(temp);

        // add in DB
        // if this is first message, update thread name
        // let tempThreadId;
        if (messages.length === 0 && CurrThreadID === null) { // 2 because after setMessages() this still will be 2 not 3 because state update are async. And 2 because there are already 2 dummy messages while creating new thread.
            const threadName = (userPrompt.length > 60) ? (userPrompt.substring(0, 60) + "...") : (userPrompt);
            const supabase = createClient_client();
            // if the user is not logged in ...
            const { data: { session } } = await supabase.auth.getSession();
            if (session === null) {
                redirect("/auth/login");
            }

            else {
                const newThreadID = v7();
                const { data, error } = await insertNewMessage(
                    newThreadID,
                    threadName,
                    {
                        id: messageId,
                        role: "user",
                        content: userPrompt,
                        ai_model: null,
                        is_public: ThreadPublic,
                        thread_name: CurrThreadName,
                        is_head: false,
                        parent_id: null
                    }
                );

                if (error) {
                    setalertMessage(error);
                    setalert(true);
                    return;
                }
                // setCurrThreadID(data[0].thread_id); // we are using dyanmic routes now so we will only update url, the current thread id will update due to useeffect of threadId, and also we donot wnat to fetch the thread from database, so we stop fetch in the useeffect of CurrThreadId by using newchat state :) I am genius huh?
                setnewchat(true);
                // tempThreadId = data[0].thread_id;
                setCurrThreadName(threadName);
                router.push(`/playgrounds/lumina/${newThreadID}`)
            }
        }
        else {
            const threadName = CurrThreadName; //  we cant rely on CurrThreadName to use it when thread name is updated in above if(). bcz state update are async
            const { data, error } = await insertNewMessage( // sending three arguments, one is thread id second is name and third is object having role,content,ai_model
                CurrThreadID,
                threadName,
                {
                    id: messageId,
                    role: "user",
                    content: userPrompt,
                    ai_model: null,
                    is_public: ThreadPublic,
                    thread_name: CurrThreadName,
                    parent_id: parentId,
                    is_head: false
                }
            );

            if (error) {
                setalertMessage(error);
                setalert(true);
            }
        }
        return messageId;
    };

    // appending stream responses
    const handleStreamResponse = (chunk) => {
        /*
        we need to actvely get the nodeid from store, 
        because the loop that is calling this function, 
        fetches the old version of this version (bcz same loop) 
        and hence also have that same old messages array. 
        (stale closure problem)
        */
        const storeState = getThreadStoreState();
        const activeNode = storeState.activeNodeId ? storeState.messages[storeState.activeNodeId] : null;
        
        // if last message is ai, update it; else, add new ai message
        if (activeNode && activeNode.role === "model") {
            appendStreamChunk(activeNode.id, chunk);
        }
        else {
            // 'id, role , content, ai_model, is_public, thread_name, parent_id, is_head'
            const obj = {
                id: v7(),
                role: "model",
                content: chunk,
                ai_model: Model,
                is_public: ThreadPublic,
                thread_name: CurrThreadName,
                parent_id: activeNode ? activeNode.id : null,
                is_head: false
            };
            addFirstChunk(obj, chunk);
        }
    };


    // to insert the ai response to database after got response in currThread.
    useEffect(() => {
        const insertAIResponse = async () => {
            try {
                /*
                here i used CurrThreadID insetaed of ref value because see this scenario : 
                when user navigate to differetn thread while ai response in curr thread is pendingitems-center, 
                if we use ref value than it will insert the message in the new navaigated thread instead of previous, 
                so here i am using stale value.
                */

                const { data, error } = await insertNewMessage(
                    CurrThreadID,
                    CurrThreadName,
                    {
                        id: messages[messages.length - 1].id,
                        role: "model",
                        content: messages[messages.length - 1].content,
                        ai_model: messages[messages.length - 1].ai_model,
                        parent_id: messages[messages.length - 1].parent_id,
                    })
                if (error) {
                    setalertMessage(error);
                    setalert(true);
                }
            } catch (err) {
                setalertMessage(err.message);
                setalert(true);
            }
        }

        // extra check for last role to be model, because if the LLM does not send the response than we set response Complete to true and we do not want to perform insert new message operation.
        if (responseComplete && messages[messages.length - 1].role === "model") {
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







    return (
        <div className={`${roboto.className} flex flex-row fixed inset-0 w-full overflow-hidden bg-black`}>
            <ThreadIdpage setCurrThreadID={setCurrThreadID} setActiveNode={setActiveNode} />
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }

            <Sidebar
                page="Lumina"
                setsidebarClose={setsidebarClose}
                profile_pic={profile_pic}
                CurrThreadID={CurrThreadID}
                CurrThreadName={CurrThreadName}
                setCurrThreadName={setCurrThreadName}
                setnavigatingThread={setnavigatingThread}
                responseComplete={responseComplete}
                navigatingThread={navigatingThread}
            />


            <main className="flex-1 min-w-0 h-full flex flex-col justify-between items-center ">

                <TopBar
                    sidebarClose={sidebarClose}
                    models={models}
                    Model={Model}
                    setModel={setModel}
                    page="Lumina" CurrThreadName={CurrThreadName}
                    setCurrThreadName={setCurrThreadName}
                    CurrThreadID={CurrThreadID}
                    ThreadPublic={ThreadPublic}
                    setThreadPublic={setThreadPublic}
                    ActiveInterface={ActiveInterface}
                    setActiveInterface={setActiveInterface}
                />


                <div className={`flex w-full flex-1 overflow-hidden`}>

                    <div className="relative flex-1 overflow-hidden">
                        <div
                            className={`flex w-full h-full transition-transform duration-500 ease-in-out ${ActiveInterface === 'chat' ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <div className="w-full h-full flex-shrink-0 flex flex-col">
                                <ChatInterface
                                    messages={messages}
                                    setMessagesInStore={setMessagesInStore}
                                    setActiveNode={setActiveNode}
                                    deleteNode={deleteNode}
                                    navigatingThread={navigatingThread}
                                    name={name}
                                    responseComplete={responseComplete}
                                    setresponseComplete={setresponseComplete}
                                    Model={Model}
                                    selectedFiles={selectedFiles}
                                    CurrThreadID={CurrThreadID}
                                    handleNewPrompt={handleNewPrompt}
                                    handleStreamResponse={handleStreamResponse}
                                    setalert={setalert}
                                    setalertMessage={setalertMessage}
                                />
                            </div>
                            <div className="w-full h-full flex-shrink-0 flex flex-col">
                                <NeuraFlowInterface
                                    messages={messages}
                                />
                            </div>
                        </div>
                    </div>

                    <WorkSpace
                        setnewchat={setnewchat}
                        files={files}
                        setFiles={setfiles}
                        setselectedFiles={setselectedFiles}
                        selectedFiles={selectedFiles}
                        CurrThreadID={CurrThreadID}
                    />

                </div>

            </main >
        </div >
    )
}

export default Lumina;