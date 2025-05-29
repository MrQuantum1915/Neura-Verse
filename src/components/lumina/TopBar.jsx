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
];

function TopBar({ sidebarClose, Model, setModel }) {

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
        <div className={`flex flex-row flex-wrap ${sidebarClose ? ("justify-between") : ("justify-end")}  w-full h-auto border-b border-white/10 `}>
            {
                sidebarClose && (
                    <Link href="/playgrounds/lumina">
                        <div className={`text-4xl md:text-5xl ${playfairDisplay.className} font-bold m-4 md:m-6 cursor-pointer`}>
                            Lumina
                        </div>
                    </Link>
                )
            }
            <div className="flex flex-col mx-5 items-end">

                <div
                    onClick={() => { setOpen(prevOpen => !prevOpen) }}
                    className='relative flex flex-grow-0 items-center cursor-pointer rounded-2xl border-2 border-white/10 w-fit px-2 my-2 font-bold hover:bg-white/5 transition-all duration-300 ease-in-out'
                    ref={triggerRef}
                >

                    <div className="mx-2">
                        Models
                    </div>
                    <Image src={"/dropdown.svg"} width={40} height={40} alt="Dropdown"></Image>

                    {
                        Open &&
                        <DropDown itemsArray={models} selectItem={handleSelectItem} ref={dropdownMenuRef} />
                    }
                </div>


                <div className="border border-white/10 rounded-2xl px-4 mb-1 text-cyan-400">
                    {Model.itemName}
                </div>
            </div>
        </div >
    )
}

export default TopBar
