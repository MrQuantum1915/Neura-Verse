// made this a client component because to implement "change profile" feature. For this small page i dont think any significant performance declination will arise.
// also i am including navbar seperately here so that navbar renders again because the profile picture has been set after login, so it should rerender, but the simplest way to do it is this: Include navabr here seperately.

'use client'
import React from 'react'
import Image from 'next/image'
import { CircleUser, LogOut, AlertTriangle } from 'lucide-react'
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
import NavBar from '@/components/NavBar';
import { useAlertStore } from '@/store/global/useAlertStore';

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

    const showAlert = useAlertStore((state) => state.showAlert);

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
                    showAlert("Error deleting account");
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
                    <h1 className='text-xl text-white/70 tracking-[0.2em] uppercase font-light mx-4 mt-4'>
                        Compiling your awesomeness...
                    </h1>
                </div>
            </>
        );
    }

    const Profile_Picture = profile.profile_pic || "/pfp-placeholder-2.svg";

    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center break-words my-20">
                {
                    isUpdating && (
                        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 h-full w-full">
                            <div className="loader">
                                <div className="inner one"></div>
                                <div className="inner two"></div>
                                <div className="inner three"></div>
                            </div>
                            <h1 className='text-xl text-white/70 tracking-[0.2em] uppercase font-light mx-4 mt-4'>
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
                <div className="md:w-[60vw] w-[90vw] my-10 border-2 border-white p-8 md:p-12 bg-black">
                    <div className="text-3xl font-black uppercase tracking-widest mb-4">My Account</div>
                    <div className="h-0.5 bg-white/20 mb-8"></div>
                    <div className="flex flex-col">
                        <div className="text-xl mt-4 mb-2 opacity-50">
                            Profile Picture
                        </div>
                        <div className="flex flex-col md:flex-row flex-wrap justify-start items-center md:items-start gap-6">
                            <div className="relative w-32 h-32 md:w-[200px] md:h-[200px] flex-shrink-0 border-2 border-white bg-white/5">
                                {Profile_Picture === "/pfp-placeholder-2.svg" ? (
                                    <CircleUser className="w-full h-full text-white opacity-80 p-4" />
                                ) : (
                                    <Image
                                        src={Profile_Picture}
                                        fill
                                        alt="Profile Picture"
                                        className="rounded-none object-cover aspect-square"
                                    />
                                )}
                            </div>
                            <div className='flex flex-row flex-wrap items-center gap-4 justify-center w-full md:w-auto'>

                                <label className="cursor-pointer w-full md:w-auto">
                                    <input
                                        id='imageInput'
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

                                                        showAlert('Something went wrong. Please try again.');
                                                        return;
                                                    }
                                                    const { publicUrl, error } = await updateImage(formData);
                                                    if (error) {
                                                        if (error == "File size exceeds 1MB limit") {
                                                            console.error('File size exceeds 1MB limit:', error);
                                                            showAlert('Something went wrong. Please try again.');
                                                        }
                                                        else {
                                                            console.error('Error updating profile image:', error);
                                                            showAlert('Something went wrong. Please try again.');
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
                                        className={`px-6 py-3 cursor-pointer border-2 bg-black border-white text-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black w-full md:w-auto flex-1`}
                                        onClick={() => {
                                            imageInputRef.current.click();
                                        }}
                                    >
                                        Change Image
                                    </button>
                                </label>

                                <button
                                    className={`px-6 py-3 cursor-pointer border-2 bg-black text-white border-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white w-full md:w-auto flex-1`}
                                    onClick={async () => {
                                        try {
                                            if (!profile.profile_pic) {
                                                showAlert('Something went wrong. Please try again.');
                                                return;
                                            }
                                            setIsUpdating(true);
                                            const { error } = await removeImage();
                                            if (error) {
                                                console.error('Error removing profile picture:', error);
                                                showAlert('Something went wrong. Please try again.');
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

                        <div className="text-lg mt-8 mb-2 text-white/50 tracking-widest uppercase font-bold">
                            Username
                        </div>
                        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center w-full gap-4">
                            {
                                changeUsername ? (
                                    <input
                                        id='usernameInput'
                                        ref={usernameRef}
                                        className="border-b-2 border-white/50 outline-none text-2xl bg-transparent py-2 flex-grow min-w-[200px] w-full md:w-auto"
                                        placeholder='Enter your username'
                                        type='text'
                                        defaultValue={profile.username ? (profile.username) : ("")}
                                    />
                                ) : (
                                    <div className={`text-xl md:text-2xl break-all flex-grow min-w-[200px] w-full md:w-auto ${profile.username ? "" : "text-red-500 animate-pulse border-2 border-red-500 rounded-none p-4"}`}>
                                        {profile.username ? profile.username : "Please Set a Username to continue"}
                                    </div>
                                )
                            }
                            <button
                                className={`px-6 py-3 cursor-pointer border-2 bg-black border-white text-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black flex-shrink-0 w-full md:w-auto`}
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
                                                            showAlert('Something went wrong. Please try again.');
                                                        }
                                                        else {
                                                            console.error('Error updating username:', error);
                                                            showAlert('Something went wrong. Please try again.');
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


                        <div className="text-lg mt-8 mb-2 text-white/50 tracking-widest uppercase font-bold">
                            Full Name
                        </div>
                        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center w-full gap-4">
                            {
                                changeFullName ? (
                                    <input
                                        id='fullNameInput'
                                        ref={fullNameRef}
                                        className="border-b-2 border-white/50 outline-none text-2xl bg-transparent py-2 flex-grow min-w-[200px] w-full md:w-auto"
                                        placeholder='Enter your full name'
                                        type='text'
                                        defaultValue={profile.full_name ? (profile.full_name) : ("")}
                                    />
                                ) : (
                                    <div className={`text-xl md:text-2xl break-words flex-grow min-w-[200px] w-full md:w-auto`}>
                                        {profile.full_name ? profile.full_name : "Not Set"}
                                    </div>
                                )
                            }
                            <button
                                className={`px-6 py-3 cursor-pointer border-2 bg-black border-white text-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black flex-shrink-0 w-full md:w-auto`}
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
                                                        showAlert('Something went wrong. Please try again.');
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


                        <div className="text-lg mt-8 mb-2 text-white/50 tracking-widest uppercase font-bold">
                            Email
                        </div>
                        <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center w-full gap-4">
                            {
                                changeEmail ? (
                                    <input
                                        id='emailInput'
                                        ref={emailRef}
                                        className="border-b-2 border-white/50 outline-none text-2xl bg-transparent py-2 flex-grow min-w-[200px] w-full md:w-auto"
                                        placeholder='Enter your email'
                                        type='email'
                                        defaultValue={profile.email_id}
                                    />
                                ) : (
                                    <div className="text-xl md:text-2xl break-all flex-grow min-w-[200px] w-full md:w-auto">
                                        {profile.email_id}
                                    </div>
                                )
                            }
                            <button
                                className={`px-6 py-3 cursor-pointer border-2 bg-black border-white text-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black flex-shrink-0 w-full md:w-auto`}
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
                                                            showAlert('Something went wrong. Please try again.');
                                                        }
                                                        else {
                                                            console.error('Error updating email:', error);
                                                            showAlert('Something went wrong. Please try again.');
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

                <div className="md:w-[60vw] w-[90vw] my-10 border-2 border-red-800 p-8 md:p-12 bg-[#050000]">
                    <div className="text-3xl font-black uppercase tracking-widest mb-4 text-red-500">Danger Zone</div>
                    <div className="h-0.5 bg-red-500/20 mb-8"></div>
                    <div className="flex flex-col">

                        <div className='flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-4'>
                            <div className="flex flex-row flex-wrap justify-start gap-4 md:gap-5 items-center my-4">
                                <LogOut size={30} className="text-red-500 flex-shrink-0" />
                                <div className="text-white/70 text-lg md:text-xl tracking-wider uppercase font-bold">Sign out of this session</div>
                            </div>
                            <button
                                className={`px-6 py-3 cursor-pointer border-2 bg-black text-white border-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black w-full md:w-auto`}
                                onClick={
                                    async () => {
                                        const supabase = createClient_client();
                                        const { error } = await supabase.auth.signOut()

                                        if (error) {
                                            console.error('Error signing out:', error);
                                            showAlert('Something went wrong. Please try again.');
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

                        <div className='flex flex-col md:flex-row flex-wrap items-start md:items-center justify-between gap-4 mt-6 pt-6 border-t-2 border-red-500/10'>
                            <div className="flex flex-row flex-wrap justify-start gap-4 md:gap-5 items-center my-4">
                                <AlertTriangle size={30} className="text-red-500 flex-shrink-0" />
                                <div className="text-white/70 text-lg md:text-xl tracking-wider uppercase font-bold">Delete Your Account</div>
                            </div>
                            <button
                                className={`px-6 py-3 cursor-pointer border-2 bg-black text-red-500 border-red-500 font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-red-600 hover:text-white hover:border-red-600 w-full md:w-auto`}
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