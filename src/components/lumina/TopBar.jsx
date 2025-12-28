"use client"
import Image from "next/image"
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import DropDown from "@/components/DropDown";
import { useState, useEffect, useRef } from "react";
import { updateThreadName } from "@/app/playgrounds/(playgrounds)/lumina/_actions/updateThreadName";
import MyAlert from "../MyAlert";
import { editThreadVisibility } from "@/app/playgrounds/(playgrounds)/lumina/_actions/editThreadVisibility";
import DropdownIcon from "../icons/DropdownIcon";
import LinkIcon from "../icons/LinkIcon";
import LockIcon from "../icons/LockIcon";
import GlobeIcon from "../icons/GlobeIcon";

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-playfair-display',
});

const models = [
    { itemName: "Gemini 2.0 Flash", id: "gemini-2.0-flash", icon: "/gemini.svg" },
    { itemName: "Gemini 2.0 Flash-Lite", id: "gemini-2.0-flash-lite", icon: "/gemini.svg" },
    { itemName: "Gemini 2.5 Pro", id: "gemini-2.5-pro", icon: "/gemini.svg" },
    { itemName: "Gemini 2.5 Flash", id: "gemini-2.5-flash", icon: "/gemini.svg" },
    { itemName: "Gemini 2.5 Flash-Lite Preview 06-17", id: "gemini-2.5-flash-lite-preview-06-17", icon: "/gemini.svg" },
    { itemName: "Gemini 2.5 Flash Preview 05-20", id: "gemini-2.5-flash-preview-05-20", icon: "/gemini.svg" },
    // { itemName: "Gemini 2.5 Flash Preview", id: "gemini-2.5-flash-preview-tts" }, //for audio
];

const visibility = [
    { itemName: "Public", id: "public", icon: "/globe.svg" },
    { itemName: "Private", id: "private", icon: "/lock.svg" },
];

function TopBar({ sidebarClose, Model, setModel, page, CurrThreadName, setCurrThreadName, CurrThreadID, ThreadPublic, setThreadPublic }) {

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
        <div className={`relative flex flex-row flex-wrap justify-between w-full h-12 border-b-1 border-white/70 z-50`}>
            {
                sidebarClose ? (
                    <Link href="/playgrounds/lumina">
                        <h1 className={`text-4xl m-1 mx-2 cursor-pointer bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent transition-all duration-500 ease-in-out ${playfairDisplay.className}`}>{page}</h1>
                    </Link>
                ) : (<div></div>) // dummy element to make thread name at center in both sidebar modelDropdownopen and close
            }
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }

            <div className="flex flex-row gap-8">
                <div className="self-center flex flex-row items-center gap-2">
                    <Image src={"/hash.svg"} width={20} height={20} alt={"topic"} className="opacity-50 mx-2" />
                    <div className="overflow-x-hidden whitespace-nowrap text-center text-xl text-orange-400 w-fit max-w-100 overflow-y-hidden overflow-x-hidden text-ellipsis ">
                        {
                            !editThreadName ? (CurrThreadName) : (
                                <input
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            if (editThreadName) { // if previous state was editThreadName = true then this click is for saving operation
                                                try {
                                                    const newThreadName = threadNameRef.current.value;
                                                    const { data, error } = await updateThreadName(newThreadName, CurrThreadID);
                                                    if (error) {
                                                        setalertMessage(`Error renaming thread title :  ${error}`);
                                                        setalert(true);
                                                        return;
                                                    }
                                                    setCurrThreadName(newThreadName);
                                                }
                                                finally {
                                                    seteditThreadName((prev) => {
                                                        return !prev;
                                                    });
                                                }
                                            }
                                            else {
                                                seteditThreadName((prev) => {
                                                    return !prev;
                                                })
                                            }
                                        }
                                    }}
                                    ref={threadNameRef}
                                    className="border-b-2 border-cyan-400 outline-none text-2xl w-fit"
                                    placeholder='Enter Thread Name'
                                    type='text'
                                    defaultValue={CurrThreadName}
                                />
                            )
                        }
                    </div>

                    <button

                        onClick={async () => {

                            if (editThreadName) { // if previous state was editThreadName = true then this click is for saving operation 
                                try {
                                    const newThreadName = threadNameRef.current.value;
                                    const { data, error } = await updateThreadName(newThreadName, CurrThreadID);
                                    if (error) {
                                        setalertMessage(`Error renaming thread title :  ${error}`);
                                        setalert(true);
                                        return;
                                    }
                                    setCurrThreadName(newThreadName);
                                }
                                finally {
                                    seteditThreadName((prev) => {
                                        return !prev;
                                    });
                                }
                            }
                            else {
                                seteditThreadName((prev) => {
                                    return !prev;
                                })
                            }
                        }}
                        className="flex-shrink-0"
                    >
                        {
                            (CurrThreadID !== null) &&
                            (<Image src={`${editThreadName ? ("/tick.svg") : ("/edit.svg")}`} width={35} height={35} alt="edit thread name" className="p-2 opacity-50 hover:opacity-100 hover:bg-white/10 border border-white/0 hover:border-white/30  rounded-lg transition-all duration-300 ease-in-out cursor-pointer" />)
                        }
                    </button>
                </div>
                {
                    (CurrThreadID !== null) && (

                        <button
                            className="z-50 relative self-center p-1 bg-cyan-400/90 rounded text-black h-fit w-fit cursor-pointer"
                            onClick={() => { setVisibilityDropdownOpen(prev => !prev) }}
                            ref={VisibilityButtonRef}
                        >
                            <div className="flex flex-row gap-1 font-bold">
                                {
                                    ThreadPublic ? (
                                        <GlobeIcon size={22} alt="Public" fill="black" />
                                    ) : (
                                        <LockIcon size={22} alt="Private" fill="black" />
                                    )
                                }
                                <div>{ThreadPublic ? ("Public") : ("Private")}</div>
                                <DropdownIcon fill="black" size={24} alt="Choose who can access this Thread" open={VisibilityDropdownOpen} className={`${(VisibilityDropdownOpen) ? ("rotate-180") : ("")} transition-all duration-200 ease-in-out`} />
                            </div>
                            {
                                VisibilityDropdownOpen &&
                                <DropDown width="w-[100%]" top={35} left={0} color={"cyan-400"} itemsArray={visibility} selectItem={handleVisibilityEdit} ref={VisibilityDropdownMenuRef} currentSelectedItemID={ThreadPublic ? ("public") : ("private")} />
                            }
                        </button>

                    )
                }
                {
                    (CurrThreadID !== null) && ThreadPublic && (
                        <button
                            type="button"
                            onClick={handleCopy}
                            aria-label="Copy thread link to clipboard"
                            className="self-center opacity-50 hover:opacity-80 hover:text-cyan-400 flex flex-row gap-1 items-center h-fit w-fit cursor-pointer border-1 border-white/50 rounded-lg p-1 transition-all duration-300 ease-in-out"
                        >
                            <LinkIcon size={24} fill={`${copied ? ("cyan") : ("white")}`} />
                            <span className={`${copied ? ("text-cyan-400") : ("text-white")}`}>{copied ? "Copied!" : "Copy Link"}</span>
                        </button>
                    )
                }
            </div>




            <div className="flex flex-row mx-5 items-center justify-center  gap-4">

                <div className="border border-white/20 rounded-xl px-4 text-cyan-400">
                    {Model.itemName}
                </div>

                <div
                    onClick={() => { setmodelDropdownOpen(prevmodelDropdownOpen => !prevmodelDropdownOpen) }}
                    className='relative flex flex-row items-center justify-center flex-grow-0 items-center cursor-pointer rounded w-fit pl-2 transition-all duration-300 ease-in-out text-black font-semibold bg-cyan-400/90'
                    ref={modelButtonRef}
                >

                    <div>
                        Models
                    </div>
                    <DropdownIcon fill="black" size={28} width={20} height={20} alt="Choose Model" open={modelDropdownOpen} className={`${(modelDropdownOpen) ? ("rotate-180") : ("")} transition-all duration-200 ease-in-out`} />

                    {
                        modelDropdownOpen &&
                        <DropDown width={"w-[250%]"} top={35} right={0} color={"cyan-400"} itemsArray={models} selectItem={handleSelectItem} ref={modelDropdownMenuRef} currentSelectedItemID={Model.id} />
                    }
                </div>


            </div>

            <div className="z-5 pointer-events-none absolute top-full w-full h-5 bg-gradient-to-b from-[#000000]/80 to-transparent" />

        </div >
    )
}

export default TopBar
