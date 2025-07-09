"use client"
import Image from "next/image"
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import DropDown from "@/components/DropDown";
import { useState, useEffect, useRef } from "react";
import { updateThreadName } from "@/app/playgrounds/(playgrounds)/lumina/_actions/updateThreadName";
import MyAlert from "../MyAlert";

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-playfair-display',
});

const models = [
    { itemName: "Gemini 2.0 Flash", id: "gemini-2.0-flash" },
    { itemName: "Gemini 2.0 Flash-Lite", id: "gemini-2.0-flash-lite" },
    { itemName: "Gemini 2.5 Flash Preview 05-20", id: "gemini-2.5-flash-preview-05-20" },
    // { itemName: "Gemini 2.5 Flash Preview", id: "gemini-2.5-flash-preview-tts" }, //for audio
];

function TopBar({ sidebarClose, Model, setModel, page, CurrThreadName, setCurrThreadName, CurrThreadID }) {

    const [Open, setOpen] = useState(false);
    const [editThreadName, seteditThreadName] = useState(false);
    const triggerRef = useRef(null);
    const dropdownMenuRef = useRef(null);

    const threadNameRef = useRef(null)
    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");

    useEffect(() => {
        if (!Open) {
            return;
        }

        function handleClickOutside(event) {
            if (
                triggerRef.current && !triggerRef.current.contains(event.target) &&
                dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [Open, setOpen]);


    // when user navigate to new thread, halt the operation of change thread name
    useEffect(() => {

        const reset = () => {
            seteditThreadName(false);
        }
        reset();

    }, [CurrThreadID])


    const handleSelectItem = (item) => {
        setModel(item);
        setOpen(false);
    };



    return (
        <div className={` relative flex flex-row flex-wrap justify-between  w-full h-23 border-b border-white/10 z-75`}>
            {
                sidebarClose ? (
                    <Link href="/playgrounds/lumina">
                        <h1 className={`text-5xl m-6  cursor-pointer bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent transition-all duration-500 ease-in-out ${playfairDisplay.className}`}>{page}</h1>
                    </Link>
                ) : (<div></div>) // dummy element to make thread name at center in both sidebar open and close
            }
            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
            }
            <div className="self-center flex flex-row items-center gap-2">
                <Image src={"/hash.svg"} width={20} height={20} alt={"topic"} className="opacity-50 mx-2" />
                <div className="overflow-x-hidden whitespace-nowrap text-center text-xl text-white w-fit max-w-100 overflow-y-hidden overflow-x-hidden text-ellipsis ">
                    {
                        !editThreadName ? (CurrThreadName) : (
                            <input
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
                        (<Image src={`${editThreadName ? ("/tick.svg") : ("/edit.svg")}`} width={35} height={35} alt="edit thread name" className="p-2 opacity-50 hover:opacity-100 hover:bg-white/20 rounded-lg transition-all duration-300 ease-in-out cursor-pointer" />)
                    }
                </button>
            </div>
            
            <button
                className="self-center p-2 bg-cyan-400 rounded text-black h-fit w-fit"
            >Share
            </button>
            
            <div className="flex flex-col mx-5 items-end">

                <div
                    onClick={() => { setOpen(prevOpen => !prevOpen) }}
                    className='relative flex flex-grow-0 items-center cursor-pointer rounded border-2 border-white/10 w-fit px-2 py-1 my-2  hover:bg-white/5 transition-all duration-300 ease-in-out'
                    ref={triggerRef}
                >

                    <div className="mx-2 font-extrabold">
                        Models
                    </div>
                    <Image src={"/dropdown.svg"} width={20} height={20} alt="Dropdown" className="mt-1"></Image>
                    {
                        Open &&
                        <DropDown itemsArray={models} selectItem={handleSelectItem} ref={dropdownMenuRef} />
                    }
                </div>


                <div className="border border-white/10 rounded-xl px-4 mb-1 text-cyan-400">
                    {Model.itemName}
                </div>
            </div>

            <div className="pointer-events-none absolute left-0 bottom-[-20] w-full h-5 z-20 bg-gradient-to-b from-[#000000]/80 to-transparent z-50" />

        </div >
    )
}

export default TopBar
