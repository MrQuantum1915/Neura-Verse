
// made this a client component because to implement "change profile" feature. For this small page i dont think any significant performance declination will arise.

'use client'

import React from 'react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';

import { createClient_client } from '@/utils/supabase/supabaseClient';
import { redirect } from 'next/navigation';
import { updateUsername } from './_actions/updateUsername';
import { updateEmail } from './_actions/updateEmail';
import { updateFullName } from './_actions/updateFullName';
import { updateImage } from './_actions/updateImage';
import { removeImage } from './_actions/removeImage';

function Profile() {

    // const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const usernameRef = useRef(null);
    const emailRef = useRef(null);
    const fullNameRef = useRef(null);
    const imageInputRef = useRef(null);

    const [changeUsername, setChangeUsername] = useState(false);
    const [changeEmail, setChangeEmail] = useState(false);
    const [changeFullName, setChangeFullName] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const supabase = createClient_client();
        const fetchData = async () => {
            // Get user
            const { data: { user } } = await supabase.auth.getUser();
            // setUser(user);

            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*') //selects all columns of table :)
                    .eq('user_id', user.id) //filters the rows where user_id matches the current user's id
                    .single(); //ensures only one row is returned.

                setProfile(data);
            }
            else {
                redirect('/auth/login');
            }
        };
        fetchData();
    }, []);


    if (!profile) {
        return (
            <div className='flex flex-col items-center justify-center h-screen w-full'>
                <div className="loader">
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                </div>
                <h1 className='text-3xl text-cyan-400 mx-4 mt-4'>
                    Fetching Profile...
                </h1>
            </div>
        );
    }

    const Profile_Picture = profile.profile_pic || "/pfp-placeholder-2.svg";

    return (
        <div className="flex flex-col break-words">
            {
                isUpdating && (
                    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 h-full w-full">
                        <div className="loader">
                            <div className="inner one"></div>
                            <div className="inner two"></div>
                            <div className="inner three"></div>
                        </div>
                        <h1 className='text-3xl text-cyan-400 mx-4 mt-4'>
                            Updating Profile...
                        </h1>
                    </div>
                )
            }

            <div className="mx-100 my-10 border-2 border-white/50 rounded-2xl p-6 bg-cyan-400/10 shadow-xl shadow-cyan-400/30">
                <div className="text-3xl">My Account</div>
                <div className="h-0.5 bg-white/50"></div>
                <div className="flex flex-col">
                    <div className="text-xl mt-4 mb-2 opacity-50">
                        Profile Picture
                    </div>
                    <div className="flex  flex-row justify-between items-center">
                        <div className="relative w-[200px] h-[200px]">
                            <Image
                                src={Profile_Picture}
                                fill
                                alt="Profile Picture"
                                className="rounded-full border-2 border-white object-cover"
                                style={{ aspectRatio: "1/1" }}
                            />
                        </div>
                        <div className='flex flex-row items-center gap-4'>

                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={imageInputRef}
                                    onChange={async (e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setIsUpdating(true);
                                            try {
                                                const formData = new FormData();
                                                formData.append("profile_pic", e.target.files[0]);
                                                if (formData.get('profile_pic').size > 1 * 1024 * 1024) {
                                                    console.error('File size exceeds 1MB limit');
                                                    alert("File size exceeds 1MB limit. Please upload a smaller image.");
                                                    return;
                                                }
                                                const { publicUrl, error } = await updateImage(formData);
                                                if (error) {
                                                    if (error == "File size exceeds 1MB limit") {
                                                        console.error('File size exceeds 1MB limit:', error);
                                                        alert("File size exceeds 1MB limit. Please upload a smaller image.");
                                                    }
                                                    else {
                                                        console.error('Error updating profile image:', error);
                                                        alert("Error updating profile image. Please try again.");
                                                    }
                                                } else {
                                                    setProfile((prev) => ({
                                                        ...prev,
                                                        profile_pic: publicUrl,
                                                    }));
                                                }
                                            } finally {
                                                setIsUpdating(false);
                                            }
                                        }
                                    }}
                                />
                                <button
                                    className={`
                                    px-4 py-2 cursor-pointer border-2
                                    bg-cyan-400/10
                                    border-cyan-400 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-cyan-400/20
                                    `}
                                    onClick={() => {
                                        imageInputRef.current.click();
                                    }}
                                >
                                    Change Image
                                </button>
                            </label>

                            <button
                                className={`
                                    px-4 py-2 cursor-pointer border-2
                                    bg-red-800/50
                                    border-red-800 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-red-800/30
                                `}
                                onClick={async () => {
                                    try {
                                        if (!profile.profile_pic) {
                                            alert("No profile picture to remove.");
                                            return;
                                        }
                                        setIsUpdating(true);
                                        const { error } = await removeImage();
                                        if (error) {
                                            console.error('Error removing profile picture:', error);
                                            alert("Error removing profile picture. Please try again.");
                                        } else {
                                            setProfile((prev) => ({
                                                ...prev,
                                                profile_pic: null,
                                            }));
                                        }
                                    }
                                    finally {
                                        setIsUpdating(false);
                                    }
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>

                    <div className="text-xl mt-4 mb-2 opacity-50">
                        Username
                    </div>
                    <div className="flex  flex-row justify-between items-center">
                        {
                            changeUsername ? (
                                <input
                                    ref={usernameRef}
                                    className="border-b-2 border-white/50 outline-none text-2xl"
                                    placeholder='Enter your username'
                                    type='text'
                                    defaultValue={profile.username ? (profile.username) : ("Guest")}
                                />
                            ) : (
                                <div className={`text-2xl ${profile.username ? "" : "text-red-500 animate-pulse border-2 border-red rounded-2xl px-4"}`}>
                                    {profile.username ? profile.username : "Please Set a Username to continue"}
                                </div>
                            )
                        }
                        <button
                            className={`
                                    px-4 py-2 cursor-pointer border-2
                                    bg-cyan-400/10
                                    border-cyan-400 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-cyan-400/20
                                `}
                            onClick={
                                async () => {
                                    if (changeUsername) {
                                        if (usernameRef.current) {
                                            setIsUpdating(true);
                                            try {
                                                const newUsername = usernameRef.current.value;
                                                const { error } = await updateUsername(newUsername);
                                                if (error) {
                                                    if (error == "Username already exists") {
                                                        console.error('Username already exists:', error);
                                                        alert("Username already exists. Please choose a different username.");
                                                    }
                                                    else {
                                                        console.error('Error updating username:', error);
                                                        alert("Error updating username. Please try again.");
                                                    }
                                                }
                                                else {
                                                    setProfile((prev) => ({
                                                        ...prev,
                                                        username: newUsername,
                                                    }));
                                                }
                                            } finally {
                                                setIsUpdating(false);
                                            }
                                        }
                                    }
                                    setChangeUsername((prev) => !prev);
                                }}
                        >
                            {
                                changeUsername ? ("Save Username") : ("Change Username")
                            }
                        </button>
                    </div>


                    <div className="text-xl mt-4 mb-2 opacity-50">
                        Full Name
                    </div>
                    <div className="flex  flex-row justify-between items-center">
                        {
                            changeFullName ? (
                                <input
                                    ref={fullNameRef}
                                    className="border-b-2 border-white/50 outline-none text-2xl"
                                    placeholder='Enter your full name'
                                    type='text'
                                    defaultValue={profile.full_name ? (profile.full_name) : ("")}
                                />
                            ) : (
                                <div className={`text-2xl`}>
                                    {profile.full_name ? profile.full_name : "Not Set"}
                                </div>
                            )
                        }
                        <button
                            className={`
                                    px-4 py-2 cursor-pointer border-2
                                    bg-cyan-400/10
                                    border-cyan-400 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-cyan-400/20
                                `}
                            onClick={
                                async () => {
                                    if (changeFullName) {
                                        if (fullNameRef.current) {
                                            setIsUpdating(true);
                                            try {
                                                const newFullName = fullNameRef.current.value;
                                                const { error } = await updateFullName(newFullName);
                                                if (error) {
                                                    console.error('Error updating full name:', error);
                                                    alert("Error updating full name. Please try again.");
                                                }
                                                else {
                                                    setProfile((prev) => ({
                                                        ...prev,
                                                        full_name: newFullName,
                                                    }));
                                                }
                                            } finally {
                                                setIsUpdating(false);
                                            }
                                        }
                                    }
                                    setChangeFullName((prev) => !prev);
                                }}
                        >
                            {
                                changeFullName ? ("Save Full Name") : ("Change Full Name")
                            }
                        </button>
                    </div>


                    <div className="text-xl mt-4 mb-2 opacity-50">
                        Email
                    </div>
                    <div className="flex  flex-row justify-between items-center">
                        {
                            changeEmail ? (
                                <input
                                    ref={emailRef}
                                    className="border-b-2 border-white/50 outline-none text-2xl w-3/4"
                                    placeholder='Enter your email'
                                    type='email'
                                    defaultValue={profile.email_id}
                                />
                            ) : (
                                <div className="text-2xl break-words">
                                    {profile.email_id}
                                </div>
                            )
                        }
                        <button
                            className={`
                                    px-4 py-2 cursor-pointer border-2
                                    bg-cyan-400/10
                                    border-cyan-400 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-cyan-400/20
                                `}
                            onClick={
                                async () => {
                                    if (changeEmail) {
                                        if (emailRef.current) {
                                            setIsUpdating(true);
                                            try {
                                                const newEmail = emailRef.current.value;
                                                const { error } = await updateEmail(newEmail);
                                                if (error) {
                                                    if (error == "Email already exists") {
                                                        console.error('Email already exists:', error);
                                                        alert("Email already exists. Please choose a different email.");
                                                    }
                                                    else {
                                                        console.error('Error updating email:', error);
                                                        alert("Error updating email. Please try again.");
                                                    }
                                                }
                                                else {
                                                    setProfile((prev) => ({
                                                        ...prev,
                                                        email_id: newEmail,
                                                    }));
                                                }
                                            } finally {
                                                setIsUpdating(false);
                                            }
                                        }
                                    }
                                    setChangeEmail((prev) => !prev);
                                }}
                        >
                            {
                                changeEmail ? ("Save Email") : ("Change Email")
                            }
                        </button>
                    </div>



                </div>
            </div>

            <div className="mx-100 my-10 border-2 border-white/50 rounded-2xl p-6 bg-red-800/10 shadow-xl shadow-red-800/30">
                <div className="text-3xl">Area-51</div>
                <div className="h-0.5 bg-white/50"></div>
                <div className="flex flex-col">

                    <div className='flex flex-row items-center justify-between'>
                        <div className="flex  flex-row justify-between gap-5 items-center my-4">
                            <Image src={"/signOut.svg"} width={30} height={30} alt="Warning" className="" />
                            <div className="opacity-75 text-xl">Sign out of this session</div>
                        </div>
                        <button
                            className={`
                                    px-4 py-2 cursor-pointer border-2
                                    bg-red-800/50
                                    border-red-800 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-red-800/30
                                `}
                            onClick={
                                async () => {
                                    const supabase = createClient_client();
                                    const { error } = await supabase.auth.signOut()
                                    if (error) {
                                        console.error('Error signing out:', error);
                                        alert("Error signing out. Please try again.");
                                    } else {
                                        redirect('/home');
                                    }

                                }
                            }
                        >
                            Sign Out
                        </button>
                    </div>

                    <div className='flex flex-row items-center justify-between'>
                        <div className="flex  flex-row justify-between gap-5 items-center my-4">
                            <Image src={"/warning.svg"} width={30} height={30} alt="Warning" className="" />
                            <div className="opacity-75 text-xl">Delete Your Account</div>
                        </div>
                        <button
                            className={`
                                    px-4 py-2 cursor-pointer border-2
                                    bg-red-800/50
                                    border-red-800 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-red-800/30
                                `}
                            onClick={() => console.log(`Action: Delete Account with ID: delete_account`)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Profile