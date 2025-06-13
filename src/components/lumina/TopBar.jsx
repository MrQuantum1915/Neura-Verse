"use client"
import Image from "next/image"
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import DropDown from "@/components/DropDown";
import { useState, useEffect, useRef } from "react";


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

function TopBar({ sidebarClose, Model, setModel, page }) {

    const [Open, setOpen] = useState(false);
    const triggerRef = useRef(null);
    const dropdownMenuRef = useRef(null);

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



    const handleSelectItem = (item) => {
        setModel(item);
        setOpen(false);
    };



    return (
        <div className={`flex flex-row flex-wrap ${sidebarClose ? ("justify-between") : ("justify-end")}  w-full h-23 border-b border-white/10 `}>
            {
                sidebarClose && (
                    <Link href="/playgrounds/lumina">
                        <div className={`text-4xl md:text-5xl hover:text-cyan-400 transition-all duration-500 ease-in-out ${playfairDisplay.className} m-4 md:m-6 cursor-pointer`}>
                            {page}
                        </div>
                    </Link>
                )
            }
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
        </div >
    )
}

export default TopBar
