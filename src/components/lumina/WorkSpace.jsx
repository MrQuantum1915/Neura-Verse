"use client"
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';
import { Roboto_Slab } from 'next/font/google';

const robotoSlab = Roboto_Slab({
    subsets: ['latin'],
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
    variable: '--font-roboto-slab',
});



function WorkSpace({ files, setselectedFiles, selectedFiles, UploadingFile }) {

    const [WorkspaceOpen, setWorkspaceOpen] = useState(false)

    return (
        <div className="flex flex-row">
            <button
                onClick={() => setWorkspaceOpen(!WorkspaceOpen)}
                className="my-15 cursor-pointer h-fit rounded-l-xl rounded-r-[-15px] click hover:bg-white/20 flex-shrink-0 transition-all duration-300 ease-in-out bg-white/10">

                <Image
                    src={WorkspaceOpen ? "/sidebar_1.svg" : "/sidebar_2.svg"}
                    width={30}
                    height={30}
                    alt="sidebar icon"
                />
            </button>

            {!WorkspaceOpen &&
                (
                    <div className="transform rotate-90 mt-15 text-xl w-fit h-fit border-1 border-white/10 rounded-2xl transition-all duration-1000 ease-in-out">
                        <h1 className={`p-1 border border-white/10`}>
                            WorkSpace
                        </h1>
                    </div>
                )
            }


            <div className={`h-full mr-8 ${WorkspaceOpen ? ("w-75 max-w-75") : ("w-0  translate-x-[100%] pointer-events-none  text-wrap-none overflow-hidden opacity-0")} flex flex-col items-center border border-white/10 transition-translate duration-1000 ease-in-out`}>
                <h1 className={`px-4 py-2 text-3xl  transition-transform duration-1000 ease-in-out border-b-2 border-white/50  ${robotoSlab.className}  `}>
                    Workspace
                </h1>
                <div className="text-center text-sm my-2 mx-4 opacity-50">
                    Files are removed from the server after 48 hours.
                </div>
                <div className={`my-2 rounded-2xl border px-4 py-2 border-white/50`}>
                    {UploadingFile ? ("Uploading File...") : ("Workspace is ready")}
                </div>

                <div className="flex flex-col p-2 overflow-x-scroll h-full max-h-screen overflow-y-scroll">
                    {files.map((item) => (
                        <div className="flex flex-row items-center justify-between" key={item.fileURI}>
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
                                <div className={`${selectedFiles.some(f => f.fileName === item.fileName && f.fileURI === item.fileURI && f.mimeType === item.mimeType) ? ("bg-cyan-400/20 text-cyan-400") : ("text-white/75")} rounded-xl px-3 p-1 mx-4 my-2`}>{item.fileName}</div>
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div >
    )
}

export default WorkSpace
