'use client'
import { useState } from "react";
import OpenInNewTab from "../icons/OpenInNewTab";
import { deleteThread } from "@/app/playgrounds/(playgrounds)/lumina/_actions/deleteThread";
import MyAlert from "../MyAlert";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

function ExpandHistory({ History, CurrThreadID, setCurrThreadName, setHistory, setHistoryExpand, setnavigatingThread }) {

    const router = useRouter();
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");

    return (
        <div className="fixed inset-0 z-100 bg-transparent backdrop-blur-sm w-full h-full flex items-center justify-center">
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }
            <div className="flex flex-col justify-start rounded-xl w-3/4 h-3/4 bg-[#171717] border-1  border-white/10 items-center justify-center  transition-all duration-300 ease-out">

                <div className="flex flex-row text-3xl m-2 w-full px-4 justify-between py-2">
                    <h1 className="text-orange-400">Library</h1>
                    <button
                        onClick={() => {
                            setHistoryExpand(false);
                        }}
                        className="hover:rotate-90 rounded-full opacity-50 hover:opacity-100 hover:bg-white/10  border border-white/0 hover:border-white/30  p-1 cursor-pointer transition-all duration-300 ease-out "
                    >
                        <Image src={"/cross.svg"} width={30} height={30} alt={"close"}></Image>
                    </button>
                </div>
                <div className="h-[1px] bg-white/20 w-full" ></div>
                <div className="w-full h-full text-2xl overflow-y-scroll text-wrap flex flex-col mx-4 my-1">
                    {
                        (History.map((item) => {
                            return (
                                <div key={item.thread_id} className="flex flex-col">

                                    <div className="flex flex-row justify-between text-white opacity-50 hover:opacity-100 hover:bg-white/5 border border-white/0 hover:border-white/30  rounded-lg cursor-pointer transition-all duration-300 ease-in-out py-3 w-full">
                                        <button
                                            onClick={() => {
                                                if (CurrThreadID !== item.thread_id) {

                                                    router.push(`/playgrounds/lumina/${item.thread_id}`);
                                                    setnavigatingThread(true);
                                                    setCurrThreadName(item.thread_name);
                                                    setHistoryExpand(false);
                                                }
                                                else {
                                                    setHistoryExpand(false);
                                                }
                                            }}
                                            className="w-full cursor-pointer mx-4 text-start"
                                        >
                                            <h1>
                                                {item.thread_name}
                                            </h1>
                                        </button>

                                        {/*tools */}
                                        <div className="flex flex-row gap-1 mx-4 items-center justify-center">
                                            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/playgrounds/lumina/${item.thread_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg opacity-50 hover:opacity-100 hover:bg-white/10 border border-white/0 hover:border-white/30  cursor-pointer transition-all duration-300 ease-in-out flex-shrink-0 w-8 h-8 flex items-center justify-center"
                                                style={{ minWidth: '2rem', minHeight: '2rem' }}
                                            >
                                                <OpenInNewTab fill="white" size={24} className={"p-0.5"} />
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    const { data, error } = await deleteThread(item.thread_id);
                                                    if (error) {
                                                        setalertMessage(error);
                                                        setalert(true);
                                                        return;
                                                    }

                                                    setHistory((prev) => {
                                                        return prev.filter((array) => item.thread_id != array.thread_id)
                                                    })
                                                }}
                                                className="rounded-lg opacity-50 hover:opacity-100 hover:bg-white/10 border border-white/0 hover:border-white/30  cursor-pointer transition-all duration-300 ease-in-out flex-shrink-0 w-8 h-8 flex items-center justify-center"
                                                style={{ minWidth: '2rem', minHeight: '2rem' }}
                                            >
                                                <Image src={"/delete.svg"} width={24} height={24} alt={"more"} className="p-1" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* <div className="h-0.25 w-full px-6 bg-white/10"></div> */}
                                </div>
                            )
                        }))
                    }
                </div>
            </div>
        </div>
    )
}

export default ExpandHistory
