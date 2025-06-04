"use client"
import React from 'react'
import { useState } from 'react';
import Image from 'next/image';



function WorkSpace({ files }) {

    const [WorkspaceOpen, setWorkspaceOpen] = useState(false)
    const [selectedFiles, setselectedFiles] = useState([]);


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
                        <h1 className={`p-1 border border-white/10`}> WorkSpace
                        </h1>
                    </div>
                )
            }


            <div className={`h-full ${WorkspaceOpen ? ("w-75") : ("w-0  translate-x-[100%] pointer-events-none  text-wrap-none overflow-hidden ")} flex flex-col items-center border border-white/10 transition-translate duration-1000 ease-in-out`}>
                <h1 className={`px-4 py-2 text-xl  transition-transform duration-1000 ease-in-out border border-white/30`}>
                    Workspace
                </h1>

                <div className="flex flex-col p-2  w-full h-full max-h-screen overflow-y-scroll">
                    {files.map((item) => (
                        <div className="flex flex-row" key={item.fileURI}>
                            <button
                                className="cursor-pointer px-2"
                                onClick={() => {
                                    setselectedFiles(prev => {
                                        if (prev.includes(item.fileName)) {
                                            return prev.filter(f => f !== item.fileName);
                                        } else {
                                            return [...prev, item.fileName];
                                        }
                                    });
                                }}
                            >
                                <div className={`${selectedFiles.includes(item.fileName) ? ("bg-cyan-400/20 text-cyan-400") : ("text-white/75")} rounded-xl px-3 p-1 mx-4 my-2`}>{item.fileName}</div>
                            </button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default WorkSpace
