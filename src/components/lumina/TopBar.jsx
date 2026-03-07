"use client"
import Image from "next/image"
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import DropDown from "@/components/DropDown";
import { useState, useEffect, useRef } from "react";
import { updateThreadName } from "@/app/playgrounds/(playgrounds)/lumina/_actions/updateThreadName";
import MyAlert from "../MyAlert";
import { editThreadVisibility } from "@/app/playgrounds/(playgrounds)/lumina/_actions/editThreadVisibility";
import { Globe, Lock, Hash, Check, Pencil, ChevronDown, Link as LinkIcon, Menu, MessageSquare, Workflow } from 'lucide-react';


const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-playfair-display',
});

const visibility = [
    { itemName: "Public", id: "public", icon: <Globe size={20} className="text-white" /> },
    { itemName: "Private", id: "private", icon: <Lock size={20} className="text-white" /> },
];

function TopBar({ sidebarClose, setsidebarClose, models, Model, setModel, page, CurrThreadName, setCurrThreadName, CurrThreadID, ThreadPublic, setThreadPublic, ActiveInterface, setActiveInterface }) {

    const [modelDropdownOpen, setmodelDropdownOpen] = useState(false);
    const [editThreadName, seteditThreadName] = useState(false);
    const modelButtonRef = useRef(null);
    const modelDropdownMenuRef = useRef(null);

    const VisibilityDropdownMenuRef = useRef(null);
    const [VisibilityDropdownOpen, setVisibilityDropdownOpen] = useState(false);
    const VisibilityButtonRef = useRef(null);


    const threadNameRef = useRef(null)
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");


    const [copied, setCopied] = useState(false);


    useEffect(() => {
        if (!modelDropdownOpen) {
            return;
        }

        function handleClickOutside(event) {
            if (
                modelButtonRef.current && !modelButtonRef.current.contains(event.target)
                && modelDropdownMenuRef.current && !modelDropdownMenuRef.current.contains(event.target)
            ) {
                setmodelDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modelDropdownOpen, setmodelDropdownOpen]);

    useEffect(() => {
        if (!VisibilityDropdownOpen) {
            return;
        }

        function handleClickOutside(event) {
            if (
                VisibilityButtonRef.current && !VisibilityButtonRef.current.contains(event.target) &&
                VisibilityDropdownMenuRef.current && !VisibilityDropdownMenuRef.current.contains(event.target)
            ) {
                setVisibilityDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [VisibilityDropdownOpen, setVisibilityDropdownOpen]);

    // when user navigate to new thread, halt the operation of change thread name
    useEffect(() => {

        const reset = () => {
            seteditThreadName(false);
        }
        reset();

    }, [CurrThreadID])


    const handleSelectItem = (item) => {
        setModel(item);
        setmodelDropdownOpen(false);
    };

    const handleVisibilityEdit = async (selectedItem) => {
        setVisibilityDropdownOpen(false);
        let value = false;
        // (if threadPublic is true and selected item is public) or (if ThreadPublic is false and selected item is private) then return; else we need to change the Visibility. 
        if ((ThreadPublic === (selectedItem.id === "public")) || (!ThreadPublic === (selectedItem.id === "private"))) {
            return;
        }

        if (selectedItem.id === "public") {
            value = true;
            setThreadPublic(true);
        }
        else {
            value = false;
            setThreadPublic(false);
        }
        const { data, error } = await editThreadVisibility(CurrThreadID, value);
        if (error) {
            setalertMessage(error);
            setalert(true);
            return;
        }
    }



    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
        } else {
            alert("Clipboard API not supported");
        }
    };

    return (
        <div className={`relative flex flex-col md:flex-row items-center justify-between w-full border-b border-white/20 bg-black/40 backdrop-blur-md px-4 py-3 md:py-0 md:h-[64px] z-50 gap-4 md:gap-0 shadow-sm select-none`}>

            {alert && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[60]">
                    <MyAlert message={alertMessage} alertHandler={setalert} />
                </div>
            )}


            <div className="flex flex-row items-center justify-between md:justify-start w-full md:w-auto md:flex-1 gap-4 lg:gap-6 min-w-0">
                {sidebarClose && (
                    <button
                        className="md:hidden p-2 -ml-2 text-white/70 hover:text-white z-[110] transition-colors"
                        onClick={() => setsidebarClose(false)}
                    >
                        <Menu size={24} />
                    </button>
                )}

                {sidebarClose ? (
                    <Link href="/playgrounds/lumina" className="flex-shrink-0 hidden md:block">
                        <h1 className={`text-2xl lg:text-3xl cursor-pointer bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent transition-transform duration-300 hover:scale-[1.02] ease-in-out font-bold tracking-tight ${playfairDisplay.className}`}>
                            {page}
                        </h1>
                    </Link>
                ) : (
                    <div className="w-[1px] hidden md:block"></div>
                )}


                <div className="flex flex-row items-center gap-2 lg:gap-3 bg-white/5 border border-white/10 text-white/90 rounded-full px-3 lg:px-4 py-1.5 backdrop-blur-sm shadow-inner min-w-0">

                    <div className="flex flex-row items-center gap-1.5 lg:gap-2 min-w-0">
                        <Hash size={16} className="text-white/40 flex-shrink-0" />
                        <div className="truncate text-sm lg:text-base text-orange-400/90 font-medium max-w-[120px] lg:max-w-[200px]">
                            {!editThreadName ? (
                                CurrThreadName || "Unnamed Thread"
                            ) : (
                                <input
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            if (editThreadName) {
                                                try {
                                                    const newThreadName = threadNameRef.current.value;
                                                    const { data, error } = await updateThreadName(newThreadName, CurrThreadID);
                                                    if (error) {
                                                        setalertMessage(`Error renaming thread: ${error}`);
                                                        setalert(true);
                                                        return;
                                                    }
                                                    setCurrThreadName(newThreadName);
                                                } finally {
                                                    seteditThreadName(false);
                                                }
                                            } else {
                                                seteditThreadName(true);
                                            }
                                        }
                                    }}
                                    ref={threadNameRef}
                                    className="bg-transparent border-b border-orange-400/50 focus:border-orange-400 outline-none text-orange-400 w-full"
                                    placeholder='Thread Name'
                                    type='text'
                                    defaultValue={CurrThreadName}
                                    autoFocus
                                />
                            )}
                        </div>
                        <button
                            onClick={async () => {
                                if (editThreadName) {
                                    try {
                                        const newThreadName = threadNameRef.current.value;
                                        const { data, error } = await updateThreadName(newThreadName, CurrThreadID);
                                        if (error) {
                                            setalertMessage(`Error renaming thread: ${error}`);
                                            setalert(true);
                                            return;
                                        }
                                        setCurrThreadName(newThreadName);
                                    } finally {
                                        seteditThreadName(false);
                                    }
                                } else {
                                    seteditThreadName(true);
                                }
                            }}
                            className="flex-shrink-0 text-white/50 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
                        >
                            {CurrThreadID !== null && (
                                editThreadName ? <Check size={14} /> : <Pencil size={14} />
                            )}
                        </button>
                    </div>


                    {CurrThreadID !== null && (
                        <>
                            <div className="w-[1px] h-4 bg-white/20"></div>
                            <button
                                className="relative flex flex-row items-center gap-1 lg:gap-1.5 text-xs lg:text-sm font-medium text-white/70 hover:text-white transition-colors"
                                onClick={() => setVisibilityDropdownOpen(prev => !prev)}
                                ref={VisibilityButtonRef}
                            >
                                {ThreadPublic ? <Globe size={14} className="text-green-400" /> : <Lock size={14} className="text-orange-400/80" />}
                                <span className="hidden sm:inline">{ThreadPublic ? "Public" : "Private"}</span>
                                <ChevronDown size={14} className={`opacity-60 transition-transform ${VisibilityDropdownOpen ? "rotate-180" : ""}`} />
                                {VisibilityDropdownOpen && (
                                    <DropDown width="w-[130px]" top={30} left={0} color="orange-400" itemsArray={visibility} selectItem={handleVisibilityEdit} ref={VisibilityDropdownMenuRef} currentSelectedItemID={ThreadPublic ? "public" : "private"} />
                                )}
                            </button>
                        </>
                    )}


                    {CurrThreadID !== null && ThreadPublic && (
                        <>
                            <div className="w-[1px] h-4 bg-white/20"></div>
                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label="Copy thread link"
                                className={`flex flex-row items-center gap-1 lg:gap-1.5 text-xs lg:text-sm font-medium transition-colors ${copied ? "text-green-400" : "text-white/70 hover:text-white"}`}
                            >
                                <LinkIcon size={14} />
                                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center w-full md:w-auto mt-2 md:mt-0 order-3 md:order-none">
                <div className="relative flex bg-[#1A1A1A] border border-white/10 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] h-[40px] w-full md:w-[280px]">

                    <div
                        className={`absolute top-0 bottom-0 left-0 w-1/2 rounded-full bg-white transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-sm ${ActiveInterface === 'neuraflow'
                            ? "translate-x-full"
                            : "translate-x-0"
                            }`}
                    />

                    <button
                        onClick={() => setActiveInterface('chat')}
                        className={`relative z-10 flex-1 flex items-center justify-center text-sm font-semibold tracking-wide transition-colors duration-200 rounded-full ${ActiveInterface === 'chat'
                            ? "text-black drop-shadow-sm"
                            : "text-white/60 hover:text-white/90 hover:bg-white/5"
                            }`}
                    >
                        <MessageSquare size={16} className="mr-1.5" />
                        <span className="hidden md:inline">Chat</span>
                        <span className="md:hidden">Chat</span>
                    </button>


                    <button
                        onClick={() => setActiveInterface('neuraflow')}
                        className={`relative z-10 flex-1 flex items-center justify-center text-sm font-semibold tracking-wide transition-colors duration-200 rounded-full ${ActiveInterface === 'neuraflow'
                            ? "text-black drop-shadow-sm"
                            : "text-white/60 hover:text-white/90 hover:bg-white/5"
                            }`}
                    >
                        <Workflow size={16} className="mr-1.5" />
                        <span className="hidden md:inline">Neura Flow</span>
                        <span className="md:hidden">Flow</span>
                    </button>
                </div>
            </div>


            <div className="flex flex-row items-center justify-center md:justify-end gap-3 w-full md:w-auto md:flex-1 min-w-0 order-2 md:order-none mt-2 md:mt-0 hidden md:flex">
                <div className="flex flex-row items-center bg-white/5 border border-white/10 rounded-full p-1 pl-3 lg:pl-4 pr-1 backdrop-blur-sm shadow-inner transition-colors hover:bg-white/10 cursor-default">
                    {Model.icon && (
                        <div className="flex items-center justify-center w-5 h-5 mr-2 flex-shrink-0">
                            {typeof Model.icon === 'string' ? (
                                <Image src={Model.icon} alt={Model.itemName} width={20} height={20} className="object-contain" />
                            ) : (
                                <span className="flex items-center justify-center w-full h-full">{Model.icon}</span>
                            )}
                        </div>
                    )}
                    <span className="text-orange-400/90 text-xs lg:text-sm font-medium mr-2 lg:mr-3 truncate max-w-[120px] lg:max-w-[180px]">
                        {Model.itemName}
                    </span>
                    <div className="w-[1px] h-4 bg-white/20 mr-1 lg:mr-2"></div>
                    <button
                        onClick={() => setmodelDropdownOpen(!modelDropdownOpen)}
                        ref={modelButtonRef}
                        className="relative flex flex-row items-center gap-1.5 px-3 py-1 lg:py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white text-xs lg:text-sm font-medium transition-colors"
                    >
                        <span>Models</span>
                        <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${modelDropdownOpen ? "rotate-180" : ""}`} />
                        {modelDropdownOpen && (
                            <DropDown width="min-w-[200px] lg:min-w-[240px] w-max" top={35} right={0} color="orange-400" itemsArray={models} selectItem={handleSelectItem} ref={modelDropdownMenuRef} currentSelectedItemID={Model.id} />
                        )}
                    </button>
                </div>
            </div>

            <div className="pointer-events-none absolute top-full left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent" />
        </div>
    )
}

export default TopBar
