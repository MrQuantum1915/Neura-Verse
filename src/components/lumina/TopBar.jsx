"use client"
import Image from "next/image"
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';
import DropDown from "@/components/DropDown";
import { useState } from "react";


const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-playfair-display',
});

const models = {
    "Gemini-2.0-Flash": "gemini-2.0-flash",
    "Gemini-2.5-Flash-Preview": "gemini-2.5-flash-preview",
    "Gemini-2.5-Pro-Preview": "gemini-2.5-pro-preview",
}

function TopBar({ sidebarClose, Model, setModel }) {
    return (
        <div className={`flex flex-row flex-wrap ${sidebarClose ? ("justify-between") : ("justify-end")}  w-full h-auto border-b border-white/10 `}>
            {
                sidebarClose && (
                    <Link href="/playgrounds/lumina">
                        <div className={`text-5xl ${playfairDisplay.className} font-bold m-6 cursor-pointer`}>
                            Lumina
                        </div>
                    </Link>
                )
            }
            <div className="flex flex-col mx-5 items-end">
                <div className='flex flex-grow-0 items-center cursor-pointer rounded-2xl border border-white/10 w-fit px-2 my-2 font-bold hover:bg-white/5 transition-all duration-300 ease-in-out'>
                    <div className="mx-2">
                        Models
                    </div>
                    <Image src={"/dropdown.svg"} width={40} height={40} alt="Dropdown"></Image>
                    <DropDown />
                </div>
                <div className="border border-white/10 rounded-2xl px-4 mb-1 text-cyan-400">
                    {Model}
                </div>
            </div>
        </div >
    )
}

export default TopBar
