"use client" // doesnt matter beacuse the parent component is already client component.
import Image from "next/image"
import { useEffect, useState } from "react"
import { fetchHistory } from "@/app/playgrounds/(playgrounds)/lumina/_actions/fetchHistory"
import MyAlert from '@/components/MyAlert';
import { deleteThread } from "@/app/playgrounds/(playgrounds)/lumina/_actions/deleteThread";
import ExpandHistory from "./ExpandHistory";
import { useRouter } from "next/navigation";

function HistoryTab({ CurrThreadID, CurrThreadName, setCurrThreadName, navigatingThread, setnavigatingThread, responseComplete }) {

    const router = useRouter();
    const [History, setHistory] = useState([]);
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");

    const [HistoryExpand, setHistoryExpand] = useState(false);

    useEffect(() => {
        if (!navigatingThread) { // if thread change is due to naviagtion , then dont fetch from database. Else new thread i likely made, hence fetch it.

            console.log("history remount")
            const fetch = async () => {
                const { data, error } = await fetchHistory();
                if (error) {
                    setalertMessage(error);
                    setalert(true);
                }
                setHistory(data);
                console.log("history remount complete")
            }

            fetch();
        }

    }, [])

    // update in history table of frontend when thread name edited
    useEffect(() => {

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
    }, [CurrThreadName])


    return (
        <div className="flex flex-col w-full h-full max-h-160 ml-3 mt-4 ">
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }

            {
                HistoryExpand &&

                <ExpandHistory History={History} setCurrThreadName={setCurrThreadName} setHistory={setHistory} setHistoryExpand={setHistoryExpand} setnavigatingThread={setnavigatingThread} />

            }
            <div className="flex flex-row items-center justify-between w-full h-full">

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
                        src={"/open-in-full.svg"}
                        width={20}
                        height={20}
                        alt="Open in full"
                    />
                </button>


                <button
                    onClick={async () => {
                        router.push(`/playgrounds/lumina/`);
                        setCurrThreadName("New Thread");
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
            <div className="overflow-y-scroll  w-full h-2/3 flex flex-col ">
                {History && History.map(items => (
                    <div key={items.thread_id} className="flex flex-row justify-between items-center my-0.5">
                        <button
                            className={`relative overflow-x-hidden whitespace-nowrap ${items.thread_id === CurrThreadID
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
                                    console.log("curr threadname:  ", items.thread_name);
                                    console.log("shit",CurrThreadName);
                                }
                            }}
                        >
                            <span className="relative pr-8">{items.thread_name}</span>
                            {/* fade effect at overflow point*/}
                            <span className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#111]/80 to-transparent"></span>
                        </button>

                        <button
                            onClick={async () => {
                                const { data, error } = await deleteThread(items.thread_id);
                                if (error) {
                                    setalertMessage(error);
                                    setalert(true);
                                    return;
                                }

                                setHistory((prev) => {
                                    return prev.filter((array) => items.thread_id != array.thread_id)
                                })
                            }}
                            className="rounded-lg mx-4 opacity-50 hover:opacity-100 hover:bg-white/20  cursor-pointer transition-all duration-300 ease-in-out flex-shrink-0"
                        >
                            <Image src={"/delete.svg"} width={30} height={30} alt={"more"} className="p-2" />
                        </button>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default HistoryTab
