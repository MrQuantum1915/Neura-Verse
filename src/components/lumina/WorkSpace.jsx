"use client"
import React from 'react'
import { ImageIcon, FileText, AudioLines, Video, Layers, X as XIcon, Upload, CheckCircle, CheckSquare, Square, MoreVertical, Trash, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Roboto_Slab } from 'next/font/google';
import DropDown from '../DropDown';
import Cross from '../icons/Cross';
import Link from 'next/link';
import OpenInNewTab from '../icons/OpenInNewTab';
import { uploadWorkspaceFiles } from '@/app/playgrounds/(playgrounds)/lumina/_actions/uploadWorkspaceFiles';
import MyAlert from '../MyAlert';
import { fetchListOfWorkspaceFiles } from '@/app/playgrounds/(playgrounds)/lumina/_actions/fetchListOfWorkspaceFiles';
import { getSignedURLsOfWorkspaceFiles } from '@/app/playgrounds/(playgrounds)/lumina/_actions/getSignedURLsOfWorkspaceFiles';
import CircularLoader from '../CircularLoader';
import { deleteWorkspaceFile } from '@/app/playgrounds/(playgrounds)/lumina/_actions/deleteWorkspaceFile';
import { useRouter } from 'next/navigation';
import { useThreadStore } from '@/store/lumina/useThreadStore';

import { v7 } from 'uuid';
import { insertNewMessage } from '@/app/playgrounds/(playgrounds)/lumina/_actions/insertNewMessage';

const robotoSlab = Roboto_Slab({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
    variable: '--font-roboto-slab',
});

const fileTypes = [
    { itemName: "Images", mimeType: "image/*", id: "image/*", icon: <ImageIcon size={25} /> },
    { itemName: "PDFs", mimeType: "application/pdf", id: "application/pdf", icon: <FileText size={25} /> },
    { itemName: "Texts", mimeType: "text/plain", id: "text/plain", icon: <FileText size={25} /> },
    { itemName: "Audios", mimeType: "audio/*", id: "audio/*", icon: <AudioLines size={25} /> },
    { itemName: "Videos", mimeType: "video/*", id: "video/*", icon: <Video size={25} /> }
];


function WorkSpace({ files, setFiles, setselectedFiles, selectedFiles, CurrThreadID, setnewchat }) {

    const router = useRouter();
    const [WorkspaceOpen, setWorkspaceOpen] = useState(false);
    const [currFileType, setcurrFileType] = useState({ itemName: "Images", type: "image/*", id: "image/*", icon: <ImageIcon size={25} /> })
    // {console.log("workspace remounted")}

    const [fileTypesMenu, setfileTypesMenu] = useState(false);
    const fileTypesMenuRef = React.useRef(null);
    const dropdownRef = React.useRef(null);

    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");


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
                setselectedFileMenu(null);
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
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const fileMenuRef = useRef(null);
    useEffect(() => {
        if (!fileMenu) {
            return;
        }

        function handleClickOutside(event) {
            if (
                fileMenuRef.current && !fileMenuRef.current.contains(event.target)
            ) {
                setFileMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [fileMenu, setFileMenu]);

    const handleFileUpload = async (e) => {

        setUploadingFile(true);

        try {
            let activeThreadId = CurrThreadID;

            if (activeThreadId === null) {
                const newThreadID = v7();
                const { data, error: newThreaderr } = await insertNewMessage(
                    newThreadID,
                    "Multi-Modal Chat",
                    {
                        id: v7(),
                        role: "user",
                        content: null,
                        ai_model: null,
                        parent_id: null,
                    }
                );
                if (newThreaderr) {
                    setalertMessage(newThreaderr);
                    setalert(true);
                }
                else {
                    useThreadStore.getState().setThreadId(newThreadID);
                    activeThreadId = newThreadID;
                    setnewchat(true);
                    router.push(`/playgrounds/lumina/${newThreadID}`);
                }
            }

            const tempfiles = e.target.files;
            // to sendingToGemini a file from a client to a server,  the recommended approach is to use the FormData object. as using json.stringify would likely result in empty object as it cant handle complex data like a file. It only serialize objects and array in string.

            const formData = new FormData();
            // FormData.append() expects a string or Blob/File, not an array. Hence we need to Loop and append each file individually. otherwise it converts whole to string
            for (let i = 0; i < tempfiles.length; i++) {
                if (files.some(item => item.name === tempfiles[i].name)) {
                    setalertMessage(`Discarded ${tempfiles[i].name}, as it is already uploaded`);
                    setalert(true);
                    continue;
                }
                formData.append('files', tempfiles[i]);
            }

            formData.append('thread_id', activeThreadId);
            const { data, error } = await uploadWorkspaceFiles(formData);
            console.log("log")

            if (error) {
                setalertMessage(error);
                setalert(true);
            }
            else {
                // console.log(data);
                setFiles(data);
            }
        }
        finally {
            setUploadingFile(false);
        }

    }

    // run on every full mount :)
    useEffect(() => {
        const fetchWorkspaceData = async () => {

            const { data, error } = await fetchListOfWorkspaceFiles(CurrThreadID);
            if (error) {
                setalertMessage(error);
                setalert(true);
                return;
            }
            console.log(data);
            setFiles(data);
        }

        fetchWorkspaceData();
    }, [CurrThreadID]);

    const [UploadingFile, setUploadingFile] = useState(false);
    const [sendingToGemini, setSend] = useState(false);
    const [CreatingFileURL, setCreatingFileURL] = useState(false);
    const [DeletingFile, setDeletingFile] = useState(false);

    return (
        <>

            <div
                className={`md:hidden fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${WorkspaceOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setWorkspaceOpen(false)}
            />
            <div className="flex flex-row z-100 md:z-10 absolute right-0 h-full md:relative">
                {
                    !WorkspaceOpen &&
                    <button
                        onClick={() => setWorkspaceOpen(!WorkspaceOpen)}
                        className={`mt-4 bg-[#212121] hover:bg-white/10 border border-white/0 hover:border-white/30 rounded-lg p-2 flex flex-row items-center cursor-pointer h-fit flex-shrink-0 transition-all duration-300 ease-in-out ${WorkspaceOpen ? ("") : ("mr-4")}`}>

                        <Layers size={30} className="text-white" />
                    </button>
                }

                {
                    alert && <MyAlert message={alertMessage} alertHandler={setalert} />
                }
                <div className={`bg-[#101010] rounded-bl-2xl h-full shadow-[-4px_0_24px_rgba(0,0,0,0.5)] md:shadow-none ${WorkspaceOpen ? ("w-[85vw] sm:w-[350px] md:w-80 md:max-w-80") : ("w-0  translate-x-[100%] pointer-events-none  whitespace-nowrap overflow-hidden opacity-0")} flex flex-col items-center  transition-all duration-500 ease-in-out`}>

                    <div className='bg-[#212121]  rounded-b-xl w-[95%] top-0 sticky flex flex-col items-center'>

                        <div className='flex flex-row items-center'>
                            <button
                                onClick={() => setWorkspaceOpen(!WorkspaceOpen)}
                                className="absolute left-0 opacity-50 hover:opacity-100 bg-[#212121] hover:bg-white/5 border border-white/0 hover:border-white/30 hover:rotate-90 rounded-full p-1 flex flex-row items-center cursor-pointer h-fit flex-shrink-0 transition-all duration-300 ease-in-out">

                                <XIcon size={30} className="text-white" />
                            </button>
                            <Layers size={30} className="text-white" />
                            <h1 className='p-2 text-2xl font-bold text-center text-white'>Workspace</h1>

                        </div>
                        <h2 className='my-1 text-center opacity-50'>Individual file size limit - 50MB</h2>

                        <label className={`${UploadingFile ? ("pointer-events-none opacity-50") : ("opacity-85 hover:opacity-100")} cursor-pointer my-2 bg-white hover:bg-neutral-200 flex flex-row p-0.5 rounded-lg text-black items-center gap-1 w-fit self-center active:translate-y-0.5 transition-all duration-300 ease-in-out`}>
                            <input
                                onChange={handleFileUpload}
                                type='file'
                                className="hidden"
                                multiple />
                            <Upload size={24} color='black' className="flex-shrink-0 p-0.5" />
                            <div>Upload Files</div>
                        </label>
                    </div>

                    <div className='flex flex-row items-center justify-between my-2 rounded-lg bg-[#212121] w-[95%]'>
                        <div className='bg-[#404040] rounded-l-lg rounded-r-xl text-xl px-4 py-1 text-gray-300'>Status</div>
                        <div className='flex items-center justify-center'>
                            {
                                UploadingFile ? (
                                    <div className='flex flex-row items-center gap-1 w-full mx-4'>
                                        <div className='text-orange-400'>Uploading Files...</div>
                                    </div>
                                ) : (
                                    CreatingFileURL ? (
                                        <div className='flex flex-row items-center gap-1 w-full mx-4'>
                                            <div className='text-orange-400 text-md'>Fetching Files...</div>
                                        </div>
                                    ) : (
                                        (DeletingFile) ? (
                                            <div className='flex flex-row items-center gap-1 w-full mx-4'>
                                                <div className='text-red-400 text-md'>Deleting Files...</div>
                                            </div>
                                        ) : (
                                            <div className='flex flex-row items-center gap-1  text-green-400'>
                                                <CheckCircle size={20} className="flex-shrink-0 text-green-400" />
                                                <div>Ready</div>
                                            </div>
                                        )
                                    )
                                )
                            }
                        </div>
                        <div className='mx-2'>
                            {
                                (UploadingFile || CreatingFileURL || DeletingFile) && <CircularLoader size={8} color={'orange-400'} />
                            }
                        </div>
                    </div>


                    <div className={`flex flex-col rounded-xl border-1 border-white/20 w-[95%] h-[78%] my-1`}>
                        {/*  titles */}

                        <div className='flex flex-row w-full h-fit justify-between items-center border-b-1 border-white/30 px-4 py-1'>

                            <div className={`flex flex-row gap-2 py-1 items-center w-full h-fit text-2xl`}>
                                <span className="flex-shrink-0 flex items-center justify-center w-[25px] h-[25px] text-white">{currFileType.icon}</span>
                                {currFileType.itemName}
                            </div>
                            <button
                                onClick={async () => {
                                    setSend(true);

                                    try {
                                        const { data, error } = await sendFilesToGemini();
                                        if (error) {
                                            setalertMessage(error);
                                            setalert(true);
                                        }
                                    }
                                    finally {
                                        setSend(false);
                                    }
                                }}
                                className={`${UploadingFile ? ("pointer-events-none opacity-50") : ("opacity-85 hover:opacity-100")} cursor-pointer my-2 bg-white hover:bg-neutral-200 flex flex-row p-0.5 rounded-lg text-black items-center gap-1 w-fit self-center transition-all duration-300 ease-in-out`}>
                                <div>{`${sendingToGemini ? ("Sending...") : ("Sent")}`}</div>
                            </button>


                            <button
                                ref={fileTypesMenuRef}
                                onClick={() => {
                                    setfileTypesMenu(!fileTypesMenu);

                                }}
                                className='relative cursor-pointer'>
                                {fileTypesMenu ? (<Cross size={30} fill={"#bdbdbd"} strokeWidth={0.25} />) : (<Menu size={30} fill={"#bdbdbd"} strokeWidth={1} />)}

                                {
                                    fileTypesMenu && (
                                        <DropDown right={0} itemsArray={fileTypes} selectItem={handleSelectItem} currentSelectedItemID={currFileType.id} color={"white"} width={"w-[400%]"} ref={dropdownRef} />
                                    )
                                }

                            </button>

                        </div>

                        {/* files */}
                        <div data-lenis-prevent className='overflow-y-scroll overflow-x-scroll h-full w-full' onScroll={() => setFileMenu(false)}>
                            {files
                                .filter((file) => file.mimeType.split('/')[0] === currFileType.id.split('/')[0]) // filter out acc to curr file type selected
                                .map((item) => (
                                    <div key={item.name}
                                        className={`w-full items-center justify-between rounded-xl p-2 flex flex-row gap-2 items-center my-1 ${selectedFiles.some(f => f.name === item.name && f.mimeType === item.mimeType) ? ("text-orange-400 font-medium") : ("text-white/75")}`}
                                    >
                                        <button
                                            className="cursor-pointer px-2 flex-shrink-0"
                                            onClick={() => {
                                                setselectedFiles(prev => {

                                                    // the .some() method checks whether at least one element in an array passes a test provided by a callback function. Hence used for checking for elements that meet a complex condition: you can write custom logic in the callback function to define the criteria for a match. Comparing objects by property values: You can access object properties within the callback to compare objects based on their contents.


                                                    // can't use .inlcudes() because .includes() compares objects and arrays by reference, not by value. If you have two different objects in memory, even if they have the same properties and values, .includes() will return false

                                                    if (prev.some(name => name === item.name)) {
                                                        return prev.filter(name => !(name === item.name));
                                                    }
                                                    else {
                                                        // console.log("selectedFiles");
                                                        return [...prev, item.name];
                                                    }
                                                });
                                            }}
                                        >

                                            {selectedFiles.some(name => name === item.name)
                                                ? <CheckSquare size={25} className="flex-shrink-0 text-orange-500" />
                                                : <Square size={25} className="flex-shrink-0 text-white/50" />
                                            }
                                        </button>
                                        <div className='overflow-x-hidden text-ellipsis w-full whitespace-nowrap'>{item.name}</div>
                                        <div
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setMenuPosition({ top: rect.bottom, left: rect.right - 160 });
                                                if (fileMenu && selectedFileMenu === item.name) {
                                                    setFileMenu(false);
                                                    setselectedFileMenu(null);
                                                } else {
                                                    setFileMenu(true);
                                                    setselectedFileMenu(item.name);
                                                }
                                            }}

                                            className='flex-shrink-0 relative cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/10 border border-white/0 hover:border-white/30 rounded-full'
                                        >
                                            <MoreVertical size={24} className="opacity-50 hover:opacity-100 text-white p-0.5" />
                                        </div>
                                    </div>
                                ))}
                        </div>

                    </div>
                </div>
                {
                    fileMenu && selectedFileMenu && (
                        <div
                            ref={fileMenuRef}
                            className="fixed mt-1 bg-black border border-white/20 rounded-sm shadow-md animate-fadeIn z-[101] flex flex-col p-1 w-fit"
                            style={{ top: menuPosition.top, left: menuPosition.left }}>
                            <button
                                onClick={async () => {
                                    setDeletingFile(true);
                                    try {
                                        const { data, error } = await deleteWorkspaceFile(CurrThreadID, selectedFileMenu);
                                        if (error) {
                                            setalertMessage(error);
                                            setalert(true);
                                            return;
                                        }
                                        setFiles((prev) => {
                                            return prev.filter((element) => selectedFileMenu != element.name)
                                        })
                                    }
                                    finally {
                                        setDeletingFile(false);
                                        setFileMenu(false);
                                    }
                                }}
                                className="p-1 rounded-lg w-full h-fit flex flex-row gap-2 px-2 items-center hover:bg-red-800/30 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-red-500"
                            >
                                <Trash size={18} color="red" className="flex-shrink-0 transition-colors" />
                                <div>Delete</div>
                            </button>
                            <button
                                onClick={async (e) => {
                                    setCreatingFileURL(true);
                                    const { data, error } = await getSignedURLsOfWorkspaceFiles(CurrThreadID, [selectedFileMenu]);
                                    if (error) {
                                        setalertMessage("Failed to fetch the file");
                                        setalert(true);
                                        return;
                                    }
                                    setCreatingFileURL(false);
                                    setFileMenu(false);
                                    window.open(data[0].signedUrl, '_blank');
                                }}
                                className="p-1 rounded-lg w-full h-fit flex flex-row items-center gap-2 hover:bg-orange-800/30 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-orange-500"
                                style={{ minWidth: '2rem', minHeight: '2rem' }}
                            >
                                <OpenInNewTab size={18} color="orange" className="flex-shrink-0 transition-colors" />
                                <h1>View</h1>
                            </button>
                        </div>
                    )
                }
            </div >
        </>
    )
}

export default WorkSpace
