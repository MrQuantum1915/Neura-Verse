"use client" // doesnt matter beacuse the parent component is already client component.
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRef } from "react"
import { fetchHistory } from "@/app/playgrounds/(playgrounds)/lumina/_actions/fetchHistory"
import MyAlert from '@/components/MyAlert';
import { deleteThread } from "@/app/playgrounds/(playgrounds)/lumina/_actions/deleteThread";
import ExpandHistory from "./ExpandHistory";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OpenInNewTab from "../icons/OpenInNewTab"
import { createClient_client } from "@/utils/supabase/supabaseClient"

const navigationItems = [

    { href: "/home", label: "Home", icon: "/home.svg" },
    { href: "/playgrounds", label: "Playgrounds", icon: "/tools.svg" },
];

function HistoryTab({ profile_pic, CurrThreadID, CurrThreadName, setCurrThreadName, navigatingThread, setnavigatingThread, responseComplete }) {

    const router = useRouter();
    const [History, setHistory] = useState([]);
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");

    const [HistoryExpand, setHistoryExpand] = useState(false);
    const [threadMenu, setthreadMenu] = useState(false);
    const [selectedThreadMenu, setselectedThreadMenu] = useState(null);

    useEffect(() => {
        const fetchSessionAndHistory = async () => {
            // if user not logged in no need to fetch
            const supabase = createClient_client();
            const { data: { session } } = await supabase.auth.getSession();
            if (session === null) {
                return;
            }

            if (!navigatingThread) {

                const { data, error } = await fetchHistory();
                if (error) {
                    setalertMessage(error);
                    setalert(true);
                } else {
                    setHistory(data);
                }

            }
        };
        fetchSessionAndHistory();
    }, [CurrThreadID]);


    // update in history table of frontend when thread name edited
    useEffect(() => {
        if (navigatingThread === false) {
            const updateHistory = () => {
                setHistory((prev) => {
                    const idx = prev.findIndex(item => item.thread_id === CurrThreadID);
                    if (idx === -1) {
                        return prev;
                    }
                    const newArr = [...prev];
                    newArr[idx] = { ...newArr[idx], thread_name: CurrThreadName };
                    return newArr;
                });
            }
            updateHistory();
        }

    }, [CurrThreadName])

    // handling dropdown closing on click outside
    const threadMenuRef = useRef(null);
    useEffect(() => {
        if (!threadMenu) {
            return;
        }

        function handleClickOutside(event) {
            if (
                threadMenuRef.current && !threadMenuRef.current.contains(event.target)
                // dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)
            ) {
                setthreadMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [threadMenu, setthreadMenu]);



    return (
        <div className="flex flex-col w-full h-full">
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }

            {
                HistoryExpand &&

                <ExpandHistory History={History} setCurrThreadName={setCurrThreadName} setHistory={setHistory} setHistoryExpand={setHistoryExpand} setnavigatingThread={setnavigatingThread} />

            }
            <div className="relative flex flex-col w-[95%] h-160 ml-3 mt-4">

                <div className="flex flex-row items-center justify-between w-full">

                    <button
                        className="my-2 flex flex-row gap-2 items-center opacity-50 px-2 py-1 hover:bg-white/20 bg-white/10 hover:opacity-100 font-bold rounded-lg cursor-pointer transition-all duration-300 ease-in-out text-2xl cursor-pointer"
                        onClick={
                            () => {
                                setHistoryExpand(true);
                            }
                        }
                    >
                        History
                        <Image
                            className="p-0.5 hover:scale-130 transition-all duration-200 ease-in-out"
                            src={"/expand.svg"}
                            width={20}
                            height={20}
                            alt="threadMenu in full"
                        />
                    </button>


                    <button
                        onClick={async () => {
                            if (!responseComplete && (responseComplete !== null)) {
                                setalertMessage("Wait until AI reponse is complete.");
                                setalert(true);
                            }
                            else {
                                router.push(`/playgrounds/lumina/`);
                            }
                        }}
                    >
                        <Image
                            src={"/plus.svg"}
                            width={40}
                            height={40}
                            alt={"new thread"}
                            className={`p-2 mr-4 opacity-50 hover:opacity-100 rounded-full bg-white/20 cursor-pointer transition-all duration-300 ease-in-out`}
                        />
                    </button>
                </div>

                <div className="h-[1px] bg-white/50 ml-2 mr-6 my-2"></div>
                {/* previous chats container */}
                <div className="overflow-y-scroll w-full flex flex-col">
                    {History && History.map(items => (
                        <div key={items.thread_id} className="flex flex-row justify-between items-center my-0.5">
                            <button
                                className={`overflow-x-hidden text-ellipsis w-full whitespace-nowrap ${items.thread_id === CurrThreadID
                                    ? "opacity-100 bg-white/20"
                                    : "opacity-50"
                                    } hover:opacity-100 transition-all duration-300 ease-in-out hover:bg-white/10 text-white rounded-lg px-2 py-2 cursor-pointer text-start font-semibold`}
                                onClick={() => {
                                    if (!responseComplete && (responseComplete !== null)) { // null check to allow navigation when page load happened
                                        setalertMessage("Please Wait for AI response for current Thread");
                                        setalert(true);
                                    }
                                    else {
                                        router.push(`/playgrounds/lumina/${items.thread_id}`);
                                        setnavigatingThread(true);
                                        setCurrThreadName(items.thread_name);
                                    }
                                }}
                            >
                                <span>{items.thread_name}</span>
                            </button>

                            <button
                                onClick={() => {
                                    setthreadMenu((prev) => (!prev))
                                    setselectedThreadMenu(items.thread_id)
                                }}

                                className="rounded-lg mx-4 opacity-50 hover:opacity-100 hover:bg-white/20  cursor-pointer transition-all duration-300 ease-in-out flex-shrink-0"
                            >
                                <Image src={"/more.svg"} width={30} height={30} alt={"thread menu"} className="p-0.5 rotate-90" />
                            </button>
                            {
                                threadMenu && (items.thread_id === selectedThreadMenu) && (
                                    <div ref={threadMenuRef} className="absolute left-[95%] mt-1 bg-black border border-white/30 rounded-lg shadow-sm shadow-white/30 z-100 flex flex-col p-1 w-[50%]">
                                        <button
                                            onClick={async () => {
                                                const { data, error } = await deleteThread(items.thread_id);
                                                if (error) {
                                                    setalertMessage(error);
                                                    setalert(true);
                                                    return;
                                                }

                                                setHistory((prev) => {
                                                    return prev.filter((element) => items.thread_id != element.thread_id)
                                                })
                                                setthreadMenu(false);
                                            }}
                                            className="p-1 rounded-lg w-full h-fit flex flex-row gap-2 px-2 items-center hover:bg-red-800/30 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-red-500"
                                        >
                                            <Image src={"/delete.svg"} width={15} height={15} alt={"delete thread"} className="flex-shrink-0" />
                                            <div>Delete</div>
                                        </button>
                                        <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/playgrounds/lumina/${items.thread_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1 rounded-lg w-full h-fit flex flex-row  items-center gap-2 hover:bg-cyan-400/20 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-cyan-400"
                                            style={{ minWidth: '2rem', minHeight: '2rem' }}
                                        >
                                            <OpenInNewTab fill="cyan" size={20} />
                                            <h1>New Tab</h1>
                                        </Link>
                                    </div>
                                )
                            }

                        </div>
                    ))}
                </div>
            </div >

            {/* navigation */}
            <div className="flex flex-col ">
                {navigationItems.map((items => (
                    <Link href={items.href} key={items.label}>
                        <div className="flex items-center justify-center cursor-pointer rounded-lg p-2 m-2 hover:bg-white/20 w-fit opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
                            <Image src={items.icon} width={30} height={30} alt={items.label} className="cursor-pointer m-1 invert " />
                            <div className="px-4">{items.label}</div>
                        </div>
                    </Link>
                )))}



                <Link href={"/profile"}>
                    <div className="flex items-center justify-center cursor-pointer rounded-lg p-2 m-2 hover:bg-white/20 w-fit opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
                        <Image
                            src={profile_pic}
                            alt="Profile Picture"
                            width={40}
                            height={40}
                            className="rounded-full aspectRatio-1/1"
                            style={{ aspectRatio: "1/1" }}
                        />
                        <div className="px-4">Profile</div>
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default HistoryTab
