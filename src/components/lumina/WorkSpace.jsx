"use client"
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Roboto_Slab } from 'next/font/google';
import DotsLoader from '@/components/DotsLoader';
import DropDown from '../DropDown';
import HorizontalBars from '../icons/HorizontalBars';
import Cross from '../icons/Cross';
import Link from 'next/link';
import OpenInNewTab from '../icons/OpenInNewTab';


const robotoSlab = Roboto_Slab({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
    variable: '--font-roboto-slab',
});

const fileTypes = [
    { itemName: "Images", mimeType: "image/*", id: "image/*", icon: "/image.svg" },
    { itemName: "PDFs", mimeType: "application/pdf", id: "application/pdf", icon: "/pdf.svg" },
    { itemName: "Texts", mimeType: "text/plain", id: "text/plain", icon: "/text.svg" },
    { itemName: "Audios", mimeType: "audio/*", id: "audio/*", icon: "/audio.svg" },
    { itemName: "Videos", mimeType: "video/*", id: "video/*", icon: "/video.svg" }
];


function WorkSpace({ files, setFiles, setselectedFiles, selectedFiles, UploadingFile }) {

    const [WorkspaceOpen, setWorkspaceOpen] = useState(false);
    const [currFileType, setcurrFileType] = useState({ itemName: "Images", mimeType: "image/*", id: "image/*", icon: "/image.svg" })
    // {console.log("workspace remounted")}

    const [fileTypesMenu, setfileTypesMenu] = useState(false);
    const fileTypesMenuRef = React.useRef(null);
    const dropdownRef = React.useRef(null);

    useEffect(() => {
        if (!fileTypesMenu) {
            return;
        }

        function handleClickOutside(event) {
            if (
                fileTypesMenuRef.current && !fileTypesMenuRef.current.contains(event.target) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target)
            ) {
                setfileTypesMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [fileTypesMenu, setfileTypesMenu]);

    const handleSelectItem = (item) => {
        setcurrFileType(item);
        setfileTypesMenu(false);
    }


    // dropdowm for each item
    const [fileMenu, setFileMenu] = useState(false);
    const [selectedFileMenu, setselectedFileMenu] = useState(null);

    const fileMenuRef = useRef(null);
    useEffect(() => {
        if (!fileMenu) {
            return;
        }

        function handleClickOutside(event) {
            if (
                fileMenuRef.current && !fileMenuRef.current.contains(event.target)
                // dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)
            ) {
                setFileMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [fileMenu, setFileMenu]);



    return (
        <div className="flex flex-row z-50 ">
            {
                !WorkspaceOpen &&
                <button
                    onClick={() => setWorkspaceOpen(!WorkspaceOpen)}
                    className={`mt-4 bg-[#212121] hover:bg-white/30 rounded-lg p-2 flex flex-row items-center cursor-pointer h-fit flex-shrink-0 transition-all duration-300 ease-in-out ${WorkspaceOpen ? ("") : ("mr-4")}`}>

                    <Image
                        src={"/stacks.svg"}
                        width={30}
                        height={30}
                        alt="Workspace icon"
                    />
                </button>
            }


            <div className={`bg-[#101010] rounded-bl-2xl h-full ${WorkspaceOpen ? ("w-80 max-w-80") : ("w-0  translate-x-[100%] pointer-events-none  whitespace-nowrap overflow-hidden opacity-0")} flex flex-col items-center  transition-translate duration-1000 ease-in-out`}>

                <div className='bg-[#212121]  rounded-b-xl w-[95%] top-0 sticky flex flex-col items-center'>

                    <div className='flex flex-row items-center'>
                        <button
                            onClick={() => setWorkspaceOpen(!WorkspaceOpen)}
                            className="absolute left-0 opacity-50 hover:opacity-100 bg-[#212121] hover:bg-white/10 hover:rotate-90 rounded-full p-2 flex flex-row items-center cursor-pointer h-fit flex-shrink-0 transition-all duration-300 ease-in-out">

                            <Image
                                src={"/cross.svg"}
                                width={30}
                                height={30}
                                alt="Workspace icon"
                            />
                        </button>
                        <Image
                            src={"/stacks.svg"}
                            width={30}
                            height={30}
                            alt="Workspace icon"
                        />
                        <h1 className='p-2 text-2xl font-bold text-center text-white'>Workspace</h1>

                    </div>
                    <h2 className='my-1 text-center opacity-50'>Individual file size limit - 50MB</h2>
                    {
                        UploadingFile ? (
                            <div className='flex flex-col'>
                                <div className="my-4">
                                    <DotsLoader />
                                </div>
                                <div className='text-orange-400 text-sm'>Uploading Files ...</div>
                            </div>
                        ) : (
                            <div className='my-2 text-green-400 flex flex-row gap-4'>
                                Workspace Ready
                            </div>
                        )
                    }
                </div>


                <div className={`flex flex-col rounded-xl border-1 border-white/20 w-[95%] h-full my-1`}>
                    {/*  titles */}

                    <div className='flex flex-row w-full justify-between items-center border-b-1 border-white/30 px-4 py-1'>

                        <div className={`flex flex-row gap-2 py-1 items-center w-full h-fit text-2xl`}>
                            <Image src={`${currFileType.icon}`} width={25} height={25} alt={'icon'}></Image>
                            {currFileType.itemName}
                        </div>

                        <button
                            ref={fileTypesMenuRef}
                            onClick={() => {
                                setfileTypesMenu(!fileTypesMenu);

                            }}
                            className='relative cursor-pointer'>
                            {fileTypesMenu ? (<Cross size={30} fill={"white"} strokeWidth={0.25} />) : (<HorizontalBars size={30} fill={"white"} strokeWidth={1} />)}

                            {
                                fileTypesMenu && (
                                    <DropDown right={0} itemsArray={fileTypes} selectItem={handleSelectItem} currentSelectedItemID={currFileType.id} color={"cyan-400"} width={"w-[400%]"} ref={dropdownRef} />
                                )
                            }

                        </button>

                    </div>

                    {/* files */}
                    <div className='overflow-y-scroll overflow-x-scroll h-full w-full'>
                        {files
                            .filter((file) => file.mimeType.split('/')[0] === currFileType.id.split('/')[0]) // filter out acc to curr file type selected
                            .map((item) => (
                                <div key={item.fileURI}
                                    className={`w-full items-center justify-between rounded-xl p-2 flex flex-row gap-2 items-center my-1 ${selectedFiles.some(f => f.fileName === item.fileName && f.fileURI === item.fileURI && f.mimeType === item.mimeType) ? ("text-cyan-400") : ("text-white/75")}`}
                                >
                                    <button
                                        className="cursor-pointer px-2 flex-shrink-0"
                                        onClick={() => {
                                            setselectedFiles(prev => {

                                                // the .some() method checks whether at least one element in an array passes a test provided by a callback function. Hence used for checking for elements that meet a complex condition: you can write custom logic in the callback function to define the criteria for a match. Comparing objects by property values: You can access object properties within the callback to compare objects based on their contents.


                                                // can't use .inlcudes() because .includes() compares objects and arrays by reference, not by value. If you have two different objects in memory, even if they have the same properties and values, .includes() will return false

                                                if (prev.some(f => f.fileName === item.fileName && f.fileURI === item.fileURI && f.mimeType === item.mimeType)) {
                                                    return prev.filter(f => !(f.fileName === item.fileName && f.fileURI === item.fileURI && f.mimeType === item.mimeType));
                                                }
                                                else {
                                                    return [...prev, { fileName: item.fileName, fileURI: item.fileURI, mimeType: item.mimeType }];
                                                }
                                            });
                                        }}
                                    >

                                        <Image
                                            src={`${selectedFiles.some(f => f.fileName === item.fileName && f.fileURI === item.fileURI && f.mimeType === item.mimeType) ? ("/checkbox-checked.svg") : ("/checkbox-unchecked.svg")}`}
                                            width={25}
                                            height={25}
                                            alt={'checkbox'}
                                            className='flex-shrink-0'
                                        />
                                    </button>
                                    <div className='overflow-x-hidden text-ellipsis w-full whitespace-nowrap'>{item.fileName}</div>
                                    <div
                                        onClick={() => {
                                            setFileMenu((prev) => (!prev))
                                            setselectedFileMenu(item.fileURI)
                                        }}
                                        className='flex-shrink-0 relative opacity-75 hover:opacity-100  cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20 rounded-full'
                                    >
                                        <Image src={"/more.svg"} width={30} height={30} alt='more options' />
                                        {
                                            fileMenu && (item.fileURI === selectedFileMenu) && (
                                                <div ref={fileMenuRef} className="absolute right-0 mt-1 bg-black border border-white/30 rounded-lg shadow-sm shadow-white/30 z-100 flex flex-col p-1 w-[400%]">
                                                    <button
                                                        onClick={async () => {
                                                            setFiles((prev) => {
                                                                return prev.filter((element) => item.fileURI != element.fileURI)
                                                            })
                                                            setFileMenu(false);
                                                        }}
                                                        className="p-1 rounded-lg w-full h-fit flex flex-row gap-2 px-2 items-center hover:bg-red-800/30 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-red-500"
                                                    >
                                                        <Image src={"/delete.svg"} width={15} height={15} alt={"delete thread"} className="flex-shrink-0" />
                                                        <div>Delete</div>
                                                    </button>
                                                    <Link href={`${item.fileURI}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-1 rounded-lg w-full h-fit flex flex-row  items-center gap-2 hover:bg-cyan-400/20 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-cyan-400"
                                                        style={{ minWidth: '2rem', minHeight: '2rem' }}
                                                    >
                                                        <OpenInNewTab fill="cyan" size={20} />
                                                        <h1>View</h1>
                                                    </Link>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            ))}
                    </div>

                </div>
            </div>
        </div >
    )
}

export default WorkSpace
