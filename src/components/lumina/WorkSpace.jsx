"use client"
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Roboto_Slab } from 'next/font/google';
import DropDown from '../DropDown';
import HorizontalBars from '../icons/HorizontalBars';
import Cross from '../icons/Cross';
import Link from 'next/link';
import OpenInNewTab from '../icons/OpenInNewTab';
import { uploadWorkspaceFiles } from '@/app/playgrounds/(playgrounds)/lumina/_actions/uploadWorkspaceFiles';
import MyAlert from '../MyAlert';
import { fetchListOfWorkspaceFiles } from '@/app/playgrounds/(playgrounds)/lumina/_actions/fetchListOfWorkspaceFiles';
import { getSignedURLsOfWorkspaceFiles } from '@/app/playgrounds/(playgrounds)/lumina/_actions/getSignedURLsOfWorkspaceFiles';
import CircularLoader from '../CircularLoader';
import { deleteWorkspaceFile } from '@/app/playgrounds/(playgrounds)/lumina/_actions/deleteWorkspaceFile';
import { createNewThread } from '@/app/playgrounds/(playgrounds)/lumina/_actions/createNewThread';
import { sendFilesToGemini } from '@/app/playgrounds/(playgrounds)/lumina/_actions/sendFilesToGemini';
import { useRouter } from 'next/navigation';

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


function WorkSpace({ files, setFiles, setselectedFiles, selectedFiles, CurrThreadID, setnewchat }) {

    const router = useRouter();
    const [WorkspaceOpen, setWorkspaceOpen] = useState(false);
    const [currFileType, setcurrFileType] = useState({ itemName: "Images", type: "image/*", id: "image/*", icon: "/image.svg" })
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
            if (CurrThreadID === null) {

                const { data: newThreadData, error: newThreaderr } = await createNewThread("MultiModal Chat");
                if (newThreaderr) {
                    setalertMessage(newThreaderr);
                    setalert(true);
                }
                else {
                    setnewchat(true);
                    router.push(`/playgrounds/lumina/${newThreadData[0].thread_id}`)
                }
            }

            const tempfiles = e.target.files;
            // to sendingToGemini a file from a client to a server,  the recommended approach is to use the FormData object. as using json.stringify would likely result in empty object as it cant handle complex data like a file. It only serialize objects and array in string.

            const formData = new FormData();
            // FormData.append() expects a string or Blob/File, not an array. Hence we need to Loop and append each file individually. Otherwise "it tries to convert the entire array into a string, which usually results in a comma-separated string representation of the array's elements."
            for (let i = 0; i < tempfiles.length; i++) {
                if (files.some(item => item.name === tempfiles[i].name)) {
                    setalertMessage(`Discarded ${tempfiles[i].name}, as it is already uploaded`);
                    setalert(true);
                    continue;
                }
                formData.append('files', tempfiles[i]);
            }

            formData.append('thread_id', CurrThreadID);
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
        <div className="flex flex-row z-10">
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

            {
                alert && <MyAlert message={alertMessage} alertHandler={setalert} />
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

                    <label className={`${UploadingFile ? ("pointer-events-none opacity-50") : ("opacity-85 hover:opacity-100")} cursor-pointer my-2 bg-cyan-400 flex flex-row p-0.5 rounded-lg text-black items-center gap-1 w-fit self-center  active:translate-y-0.5 transition-all duration-300 ease-in-out`}>
                        <input
                            onChange={handleFileUpload}
                            type='file'
                            className="hidden"
                            multiple />
                        <Image src={"/cloud_upload.svg"} width={30} height={30} alt='upload files' className='flex-shrink-0' />
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
                                            <Image src={"/circular_check.svg"} width={20} height={20} alt='check' className='flex-shrink-0' />
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
                            <Image src={`${currFileType.icon}`} width={25} height={25} alt={'icon'}></Image>
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
                            className={`${UploadingFile ? ("pointer-events-none opacity-50") : ("opacity-85 hover:opacity-100")} cursor-pointer my-2 bg-cyan-400 flex flex-row p-0.5 rounded-lg text-black items-center gap-1 w-fit self-center transition-all duration-300 ease-in-out`}>
                            <div>{`${sendingToGemini ? ("Sending...") : ("Sent")}`}</div>
                        </button>


                        <button
                            ref={fileTypesMenuRef}
                            onClick={() => {
                                setfileTypesMenu(!fileTypesMenu);

                            }}
                            className='relative cursor-pointer'>
                            {fileTypesMenu ? (<Cross size={30} fill={"#bdbdbd"} strokeWidth={0.25} />) : (<HorizontalBars size={30} fill={"#bdbdbd"} strokeWidth={1} />)}

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
                                <div key={item.name}
                                    className={`w-full items-center justify-between rounded-xl p-2 flex flex-row gap-2 items-center my-1 ${selectedFiles.some(f => f.name === item.name && f.mimeType === item.mimeType) ? ("text-cyan-400") : ("text-white/75")}`}
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

                                        <Image
                                            src={`${selectedFiles.some(name => name === item.name) ? ("/checkbox-checked.svg") : ("/checkbox-unchecked.svg")}`}
                                            width={25}
                                            height={25}
                                            alt={'checkbox'}
                                            className='flex-shrink-0'
                                        />
                                    </button>
                                    <div className='overflow-x-hidden text-ellipsis w-full whitespace-nowrap'>{item.name}</div>
                                    <div
                                        onClick={() => {
                                            if (fileMenu && selectedFileMenu === item.name) {
                                                setFileMenu(false);
                                                setselectedFileMenu(null);
                                            } else {
                                                setFileMenu(true);
                                                setselectedFileMenu(item.name);
                                            }
                                        }}

                                        className='flex-shrink-0 relative cursor-pointer transition-all duration-300 ease-in-out hover:bg-white/20 rounded-full'
                                    >
                                        <Image src={"/more.svg"} width={30} height={30} alt='more options' className='opacity-50 hover:opacity-100' />
                                        {
                                            fileMenu && (item.name === selectedFileMenu) && (
                                                <div
                                                    ref={fileMenuRef}
                                                    className="absolute right-0 mt-1 bg-black border border-white/30 rounded-lg shadow-sm shadow-white/30 z-100 flex flex-col p-1 w-[400%]">
                                                    <button
                                                        onClick={async () => {
                                                            setDeletingFile(true);
                                                            try {
                                                                const { data, error } = await deleteWorkspaceFile(CurrThreadID, item.name);
                                                                if (error) {
                                                                    setalertMessage(error);
                                                                    setalert(true);
                                                                    return;
                                                                }
                                                                setFiles((prev) => {
                                                                    return prev.filter((element) => item.name != element.name)
                                                                })
                                                            }
                                                            finally {
                                                                setDeletingFile(false);
                                                            }
                                                        }}
                                                        className="p-1 rounded-lg w-full h-fit flex flex-row gap-2 px-2 items-center hover:bg-red-800/30 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-red-500"
                                                    >
                                                        <Image src={"/delete.svg"} width={15} height={15} alt={"delete thread"} className="flex-shrink-0" />
                                                        <div>Delete</div>
                                                    </button>
                                                    <button
                                                        onClick={async (e) => {
                                                            setCreatingFileURL(true);
                                                            const { data, error } = await getSignedURLsOfWorkspaceFiles(CurrThreadID, [item.name]);
                                                            if (error) {
                                                                setalertMessage("Failed to fetch the file");
                                                                setalert(true);
                                                                return;
                                                            }
                                                            setCreatingFileURL(false);
                                                            window.open(data[0].signedUrl, '_blank');
                                                        }}
                                                        className="p-1 rounded-lg w-full h-fit flex flex-row  items-center gap-2 hover:bg-cyan-400/20 cursor-pointer transition-all duration-300 ease-in-out text-white hover:text-cyan-400"
                                                        style={{ minWidth: '2rem', minHeight: '2rem' }}
                                                    >
                                                        <OpenInNewTab fill="cyan" size={20} />
                                                        <h1>View</h1>
                                                    </button>
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
