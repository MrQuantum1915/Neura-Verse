"use client"
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { Roboto_Slab } from 'next/font/google';
import DotsLoader from '@/components/DotsLoader';

const robotoSlab = Roboto_Slab({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
    variable: '--font-roboto-slab',
});

const fileTypes = [
    { name: "Images", mimeType: "image/*" },
    { name: "PDFs", mimeType: "application/pdf" },
    { name: "Text", mimeType: "text/plain" },
];

function WorkSpace({ files, setselectedFiles, selectedFiles, UploadingFile }) {

    const [WorkspaceOpen, setWorkspaceOpen] = useState(false);
    const [currFileType, setcurrFileType] = useState("image/*")
    {console.log("workspace remounted")}

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


            <div className={`bg-[#101010] rounded-l-2xl h-full ${WorkspaceOpen ? ("w-80 max-w-80") : ("w-0  translate-x-[100%] pointer-events-none  text-wrap-none overflow-hidden opacity-0")} flex flex-col items-center  transition-translate duration-1000 ease-in-out`}>

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
                    <h2 className='mx-8 my-1 text-center opacity-50'>Files are removed from the server after 48 hours</h2>
                    {
                        UploadingFile ? (
                            <div className='flex flex-col'>
                                <div className="my-4">
                                    <DotsLoader />
                                </div>
                                <div className='text-orange-400 text-lg'>Uploading Files ...</div>
                            </div>
                        ) : (
                            <div className='my-2 text-green-400 flex flex-row gap-4'>
                                Workspace Ready
                            </div>
                        )
                    }
                </div>


                <div className="flex flex-col overflow-x-scroll overflow-y-scroll rounded-2xl border-1 border-white/20 w-[95%] h-full m-2 p-4">
                    {/*  titles */}
                    <div className='flex flex-row gap-2 overflow-x-scroll border-b-1 border-white/20'>
                        {
                            fileTypes.map((item) => (

                                <button
                                    className={`items-center ${(currFileType === item.mimeType) ? ("opacity-100 bg-white/20 border-cyan-400") : ("opacity-50 hover:opacity-100 border-transparent")} border-b-2 rounded-t-sm cursor-pointer  hover:bg-white/15  transition-all duration-300 ease-in-out px-4 p-1 mb-2`}
                                    key={item.name}
                                    onClick={() => {
                                        setcurrFileType(item.mimeType);
                                    }
                                    }
                                >
                                    {item.name}
                                </button>
                            ))
                        }

                    </div>
                    {/* files */}
                    <div>
                        {files
                            .filter((file) => file.mimeType.split('/')[0] === currFileType.split('/')[0]) // filter out acc to curr file type selected
                            .map((item) => (
                                <div className="flex flex-row items-center justify-between" key={item.fileURI}>
                                    <div
                                        className={`flex flex-row gap-2 items-center my-2 ${selectedFiles.some(f => f.fileName === item.fileName && f.fileURI === item.fileURI && f.mimeType === item.mimeType) ? ("text-cyan-400") : ("text-white/75")}`}
                                    >
                                        <button
                                            className="cursor-pointer px-2"
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
                                                width={30}
                                                height={30}
                                                alt={'checkbox'}
                                            />
                                        </button>
                                        {item.fileName}
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
