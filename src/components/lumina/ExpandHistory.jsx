'use client'
import { useAlertStore } from '@/store/global/useAlertStore';
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import OpenInNewTab from "../icons/OpenInNewTab";
import { deleteThread } from "@/app/playgrounds/(playgrounds)/lumina/_actions/deleteThread";

import Image from "next/image";
import { X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
});

function ExpandHistory({ History, CurrThreadID, setCurrThreadName, setHistory, setHistoryExpand, setnavigatingThread }) {

    const router = useRouter();
    const showAlert = useAlertStore((state) => state.showAlert);
const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-transparent backdrop-blur-sm w-full h-full flex items-center justify-center font-sans">
            
            <div data-lenis-prevent className="flex flex-col justify-start rounded-xl w-[95%] md:w-1/2 h-3/4 bg-[#171717] border  border-white/10 items-center transition-all duration-300 ease-out">

                <div className="flex flex-row text-3xl m-2 w-full px-4 justify-between py-2">
                    <h1 className={`text-orange-400 ${playfairDisplay.className}`}>Library</h1>
                    <button
                        onClick={() => {
                            setHistoryExpand(false);
                        }}
                        className="hover:rotate-90 rounded-full opacity-50 hover:opacity-100 hover:bg-white/10  border border-white/0 hover:border-white/30  p-1 cursor-pointer transition-all duration-300 ease-out "
                    >
                        <X size={30} className="text-white" />
                    </button>
                </div>
                <div className="h-[1px] bg-white/20 w-full" ></div>
                <div className="w-full h-full text-xl overflow-y-auto flex flex-col px-4 my-1">
                    {
                        (History.map((item) => {
                            return (
                                <div key={item.thread_id} className="flex flex-col">

                                    <div className="flex flex-row justify-between items-center text-white opacity-50 hover:opacity-100 hover:bg-white/5 border border-white/0 hover:border-white/30 rounded-lg cursor-pointer transition-all duration-300 ease-in-out py-2 w-full min-w-0 gap-2">
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
                                            className="flex-1 min-w-0 cursor-pointer mx-4 text-start"
                                        >
                                            <h1 className="break-words line-clamp-2">
                                                {item.thread_name}
                                            </h1>
                                        </button>

                                        {/*tools */}
                                        <div className="flex flex-row gap-1 mx-4 items-center justify-center">
                                            <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/playgrounds/lumina/${item.thread_id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rounded-lg opacity-50 hover:opacity-100 hover:bg-white/10 border border-white/0 hover:border-white/30  cursor-pointer transition-all duration-300 ease-in-out flex-shrink-0 w-8 h-8 flex items-center justify-center text-white hover:text-orange-400"
                                                style={{ minWidth: '2rem', minHeight: '2rem' }}
                                            >
                                                <OpenInNewTab fill="currentColor" size={24} className="p-0.5 transition-colors" />
                                            </Link>
                                            <button
                                                onClick={async () => {
                                                    const { data, error } = await deleteThread(item.thread_id);
                                                    if (error) {
                                                        showAlert('Failed to delete thread.');
                                                        return;
                                                    }

                                                    setHistory((prev) => {
                                                        return prev.filter((array) => item.thread_id != array.thread_id)
                                                    })
                                                }}
                                                className="rounded-lg opacity-50 hover:opacity-100 hover:bg-white/10 border border-white/0 hover:border-white/30  cursor-pointer transition-all duration-300 ease-in-out flex-shrink-0 w-8 h-8 flex items-center justify-center text-white hover:text-red-400"
                                                style={{ minWidth: '2rem', minHeight: '2rem' }}
                                            >
                                                <Trash2 size={24} className="p-0.5 transition-colors" />
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
        </div>,
        document.body
    )
}

export default ExpandHistory
