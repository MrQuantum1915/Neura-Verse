// made this a client component because to implement "change profile" feature. For this small page i dont think any significant performance declination will arise.
// also i am including navbar seperately here so that navbar renders again because the profile picture has been set after login, so it should rerender, but the simplest way to do it is this: Include navabr here seperately.

'use client'
import React from 'react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';

import { createClient_client } from '@/utils/supabase/supabaseClient';
import { useRouter } from 'next/navigation'; // client compoent should use useRouter hook instead of redirect
// import { redirect } from 'next/navigation';
import { updateUsername } from './_actions/updateUsername';
import { updateEmail } from './_actions/updateEmail';
import { updateFullName } from './_actions/updateFullName';
import { updateImage } from './_actions/updateImage';
import { removeImage } from './_actions/removeImage';
import { deleteAccountServerAction } from './_actions/deleteAccountServerAction';

import ScreenWidePopUp from '@/components/ScreenWidePopUp';
import MyAlert from '@/components/MyAlert';
import NavBar from '@/components/NavBar';

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
    const [deleteAccountConfirmation, setdeleteAccountConfirmation] = useState(false);
    const [deleteAccount, setdeleteAccount] = useState(false);

    const [alert, setalert] = useState(false);
    const [alertMessage, setalertMessage] = useState("Alert");


    const router = useRouter();


    useEffect(() => {
        const supabase = createClient_client();
        const fetchData = async () => {
            // get user
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
                router.push("/auth/login");
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        async function handleDeleteAccount() {
            if (deleteAccount === true) {
                const { error } = await deleteAccountServerAction();
                if (error) {
                    console.error('Error deleting account:', error);
                    setalertMessage("Error deleting account");
                    setalert(true);
                    setdeleteAccount(false);
                } else {
                    // also delete all cookies
                    const cookies = document.cookie.split(';');
                    for (const cookie of cookies) {
                        const eqPos = cookie.indexOf('=');
                        const name = eqPos > -1 ? cookie.trim().substring(0, eqPos) : cookie.trim();
                        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`; // its starting time of Linux epoch which used to define timestamps. This is past so essentially it deletes the cookie as it is expired

                    }
                    window.location.href = '/'; //force full page reload to home page
                }
            }
        }

        handleDeleteAccount();

    }, [deleteAccount])


    if (!profile) {
        return (
            <>
                <NavBar />
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
            </>
        );
    }

    const Profile_Picture = profile.profile_pic || "/pfp-placeholder-2.svg";

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center break-words my-5">
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
                {
                    deleteAccountConfirmation && (
                        <ScreenWidePopUp headline={"Are You Sure?"} description={"All your Account Data and History with our Playgrounds will be deleted from our servers. You will not be able to access once you click this Confirmation Button."} color={"red-800"} bgcolor={"red-800/50"} buttonName={"Delete"} buttonAction={setdeleteAccount} triggerCause={setdeleteAccountConfirmation}></ScreenWidePopUp>
                    )
                }
                {
                    alert && (
                        <MyAlert message={alertMessage} alertHandler={setalert} />
                    )
                }
                <div className="md:w-[60vw] w-[80vw] my-10 border-2 border-cyan-400 rounded-2xl p-6 bg-cyan-400/10 shadow-xl shadow-cyan-400/50">
                    <div className="text-3xl">My Account</div>
                    <div className="h-0.5 bg-white/50"></div>
                    <div className="flex flex-col">
                        <div className="text-xl mt-4 mb-2 opacity-50">
                            Profile Picture
                        </div>
                        <div className="flex flex-row flex-wrap justify-between items-center">
                            <div className="relative w-[200px] h-[200px] flex-shrink-0">
                                <Image
                                    src={Profile_Picture}
                                    fill
                                    alt="Profile Picture"
                                    className="rounded-full border-2 border-white object-cover aspect-square"
                                />
                            </div>
                            <div className='flex flex-row flex-wrap items-center gap-4'>

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

                                                        setalertMessage("File size exceeds 1MB limit. Please upload a smaller image.");
                                                        setalert(true);
                                                        return;
                                                    }
                                                    const { publicUrl, error } = await updateImage(formData);
                                                    if (error) {
                                                        if (error == "File size exceeds 1MB limit") {
                                                            console.error('File size exceeds 1MB limit:', error);
                                                            setalertMessage("File size exceeds 1MB limit. Please upload a smaller image.");
                                                            setalert(true);
                                                        }
                                                        else {
                                                            console.error('Error updating profile image:', error);
                                                            setalertMessage("Error updating profile image. Please try again.");
                                                            setalert(true);
                                                        }
                                                    } else {
                                                        setProfile((prev) => ({
                                                            ...prev,
                                                            profile_pic: publicUrl,
                                                        }));
                                                    }
                                                } finally {
                                                    e.target.value = "";
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
                                                setalertMessage("No profile picture to remove.");
                                                setalert(true);
                                                return;
                                            }
                                            setIsUpdating(true);
                                            const { error } = await removeImage();
                                            if (error) {
                                                console.error('Error removing profile picture:', error);
                                                setalertMessage("Error removing profile picture. Please try again.");
                                                setalert(true);
                                            } else {
                                                setProfile((prev) => ({
                                                    ...prev,
                                                    profile_pic: null,
                                                }));
                                                //also delete image url from cookies
                                                document.cookie = `profile_pic=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
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
                        <div className="flex flex-row flex-wrap justify-between items-center w-full">
                            {
                                changeUsername ? (
                                    <input
                                        ref={usernameRef}
                                        className="border-b-2 border-white/50 outline-none text-[1.5em]"
                                        placeholder='Enter your username'
                                        type='text'
                                        defaultValue={profile.username ? (profile.username) : ("")}
                                    />
                                ) : (
                                    <div className={`text-[1.5em] overflow-scroll ${profile.username ? "" : "text-red-500 animate-pulse border-2 border-red rounded-2xl px-4"}`}>
                                        {profile.username ? profile.username : "Please Set a Username to continue"}
                                    </div>
                                )
                            }
                            <button
                                className={`
                                    px-4 py-2 mx-2 cursor-pointer border-2
                                    bg-cyan-400/10
                                    border-cyan-400 rounded-lg
                                    transition-all duration-300 ease-in-out
                                    hover:bg-cyan-400/20
                                    flex-shrink-0
                                    whitespace-nowrap
                                `}
                                onClick={
                                    async () => {
                                        if (changeUsername) { // if previous state was changeUsername = true then this click is for saving operation 
                                            if (usernameRef.current) {
                                                setIsUpdating(true);
                                                try {
                                                    const newUsername = usernameRef.current.value;
                                                    const { error } = await updateUsername(newUsername);
                                                    if (error) {
                                                        if (error == "Username already exists") {
                                                            console.error('Username already exists:', error);
                                                            setalertMessage("Username already exists. Please choose a different username.");
                                                            setalert(true);
                                                        }
                                                        else {
                                                            console.error('Error updating username:', error);
                                                            setalertMessage("Error updating username. Please try again.");
                                                            setalert(true);
                                                        }
                                                    }
                                                    else {
                                                        setProfile((prev) => ({
                                                            ...prev,
                                                            username: newUsername,
                                                        }));
                                                    }
                                                } finally {
                                                    usernameRef.current.value = "";
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
                        <div className="flex  flex-row flex-wrap justify-between items-center">
                            {
                                changeFullName ? (
                                    <input
                                        ref={fullNameRef}
                                        className="border-b-2 border-white/50 outline-none text-[1.5em]"
                                        placeholder='Enter your full name'
                                        type='text'
                                        defaultValue={profile.full_name ? (profile.full_name) : ("")}
                                    />
                                ) : (
                                    <div className={`text-[1.5em] overflow-scroll`}>
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
                                    flex-shrink-0
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
                                                        setalertMessage("Error updating full name. Please try again.");
                                                        setalert(true);
                                                    }
                                                    else {
                                                        setProfile((prev) => ({
                                                            ...prev,
                                                            full_name: newFullName,
                                                        }));
                                                    }
                                                } finally {
                                                    fullNameRef.current.value = "";
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
                        <div className="flex  flex-row flex-wrap justify-between items-center">
                            {
                                changeEmail ? (
                                    <input
                                        ref={emailRef}
                                        className="border-b-2 border-white/50 outline-none text-[1.5  em] w-3/4"
                                        placeholder='Enter your email'
                                        type='email'
                                        defaultValue={profile.email_id}
                                    />
                                ) : (
                                    <div className="text-[1.5em] break-words overflow-scroll">
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
                                    flex-shrink-0
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
                                                            setalertMessage("Email already exists. Please choose a different email.");
                                                            setalert(true);
                                                        }
                                                        else {
                                                            console.error('Error updating email:', error);
                                                            setalertMessage("Error updating email. Please try again.");
                                                            setalert(true);
                                                        }
                                                    }
                                                    else {
                                                        setProfile((prev) => ({
                                                            ...prev,
                                                            email_id: newEmail,
                                                        }));
                                                    }
                                                } finally {
                                                    emailRef.current.value = "";
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

                <div className="md:w-[60vw] w-[80vw] my-10 border-2 border-red-800 rounded-2xl p-6 bg-red-800/10 shadow-xl shadow-red-800/50">
                    <div className="text-3xl">Area-51</div>
                    <div className="h-0.5 bg-white/50"></div>
                    <div className="flex flex-col">

                        <div className='flex flex-row flex-wrap items-center justify-between'>
                            <div className="flex  flex-row flex-wrap justify-between gap-5 items-center my-4">
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
                                            setalertMessage("Error signing out. Please try again.");
                                            setalert(true);
                                        } else {
                                            // Also delete all cookies
                                            const cookies = document.cookie.split(';');
                                            for (const cookie of cookies) {
                                                const eqPos = cookie.indexOf('=');
                                                const name = eqPos > -1 ? cookie.trim().substring(0, eqPos) : cookie.trim();
                                                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`; // its starting time of Linux epoch which used to define timestamps. This is past so essentially it deletes the cookie as it is expired

                                            }
                                            window.location.href = '/'; // using this instead of userouter Hook because it does not forec full page reload. Hence component does not rerender , hence some data does not change on the page. Hence i force full page reload to reset everything.
                                        }

                                    }
                                }
                            >
                                Sign Out
                            </button>
                        </div>

                        <div className='flex flex-row flex-wrap items-center justify-between'>
                            <div className="flex  flex-row flex-wrap justify-between gap-5 items-center my-4">
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
                                onClick={() => {
                                    setdeleteAccountConfirmation(true);
                                }
                                }
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Profile