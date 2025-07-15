"use client"
import Image from "next/image"
import { Roboto } from 'next/font/google';
import { oAuth } from "../_actions/oAuth";
import { signUpNewUser } from "../_actions/email_signup";
import { useState } from "react";
import MyAlert from "@/components/MyAlert";

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-roboto',
});

const oAuthProviders = [
    { Name: "Google", Icon: "/Google_Favicon_2025.svg", providerID: "google" },
    // { Name: "Github", Icon: "/github-mark-white.svg", providerID: "github" },
    // { Name: "Microsoft", Icon: "/microsoft.svg", providerID: "microsoft" },
    // { Name: "Discord", Icon: "/Discord-Symbol-Blurple.svg", providerID: "discord" },
]

function page() {
    const [confirmEmail, setconfirmEmail] = useState(false);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // password validation logic
    const hasUpperLowerDigit = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+]/.test(password);
    const hasMinLength = password.length >= 8;

    return (
        <div className={`bg-black flex items-center justify-center w-full h-screen relative ${roboto.className}`}>
            {confirmEmail &&
                <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-51 h-full w-full">
                    <div className="p-8 rounded-lg w-1/2 border-2 border-cyan-400 text-center shadow-2xl shadow-cyan-400/75">
                        <h2 className="text-4xl font-bold mb-4">Confirm Your Email</h2>
                        <p className="mb-6">
                            We’ve sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.
                        </p>
                        <p className="text-lg text-blue-100/75 mb-4">
                            Didn’t receive the email? Check your spam folder or Try Again after 1 Hour
                        </p>
                        <p className="text-lg text-blue-100/75 mb-4">
                            (As we’re currently using a free email service, delivery may be limited—please try again after an hour if you still haven’t received it.)
                        </p>
                        <p className="text-lg text-blue-100/75 mb-4">
                            Or SignUp using OAuth, its instant.
                        </p>
                    </div>
                </div>
            }
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
                <div
                    className="w-110 h-170 rounded-3xl opacity-70 blur-3xl animate-gradient"
                    style={{
                        background: "linear-gradient(45deg, #06b6d4, #8b5cf6, #06b6d4, #8b5cf6)",
                        backgroundSize: "400% 400%",
                    }}></div>
                <style jsx>{`
                    @keyframes gradientMove {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                    .animate-gradient {
                        animation: gradientMove 8s ease-in-out infinite;
                    }
                `}</style>
            </div>

            <div className="z-50 bg-black/50 rounded-2xl p-4 shadow-md shadow-white w-fit max-w-120 h-fit flex flex-col items-center">
                <div className="px-6 py-4 items-center justify-center flex flex-col">

                    <h1 className="text-4xl my-2 mb-4 text-center">Enter the Universe <br></br> Neura Verse</h1>
                    <h2 className="text-green-400">Get full experience in mere seconds. It's quick</h2>
                    <div className="flex items-center text-center w-90  my-6 ">
                        <div className="flex-grow h-px bg-white/50"></div>
                    </div>

                    <div className="flex flex-col gap-4 w-full items-center justify-center">
                        <div className="m-2 text-white/50 text-2xl font-bold">
                            OAuth
                            <h1 className="text-sm text-green-400 text-center">Faster</h1>
                        </div>
                        <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
                            {oAuthProviders.map((item) => (
                                <button
                                    key={item.Name}
                                    className="w-42 h-15 rounded-2xl border-2 border-white/50 flex flex-row flex-wrap items-center justify-start cursor-pointer  hover:bg-white/20 focus:bg-white/20 transition-all duration-300 ease-in-out relative overflow-hidden group"
                                    onClick={() => oAuth(item.providerID)}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                                    <Image
                                        src={item.Icon}
                                        width={50}
                                        height={50}
                                        alt={item.Name}
                                        className="p-2 z-10"
                                    />
                                    <div className="text-white/75 text-2xl px-2 z-10"> {item.Name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center text-center w-90  my-6 ">
                        <div className="flex-grow h-px bg-white/50"></div>
                        <span className="mx-2 font-bold text-white/50">OR</span>
                        <div className="flex-grow h-px bg-white/50"></div>
                    </div>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData;
                            formData.append('email', e.target.elements.email.value);
                            formData.append('password', e.target.elements.password.value);
                            const { error } = await signUpNewUser(formData);
                            if (error) {
                                <MyAlert message={"Sign Up Failed! Try Again!"} />;
                            }
                            else {
                                setconfirmEmail(true);
                            }
                        }}
                    >
                        <div className="flex flex-col gap-4 w-full max-w-md items-center justify-center">
                            <div className="text-white/50 text-2xl m-2 font-bold">
                                Email
                            </div>
                            <div className="rounded-2xl p-2 border-2 border-white/50 flex flex-row hover:bg-black/50 transition-all duration-300 ease-in-out">
                                <Image
                                    src={"/email-1-svgrepo-com.svg"}
                                    width={30}
                                    height={30}
                                    alt="Email"
                                    className="opacity-50"
                                />
                                <input name="email" type="email" placeholder="Email" className="rounded-2xl px-4 py-2 text-xl outline-none min-w-3/4" required />
                            </div>


                            {/*show/hide and validation */}
                            <div className="rounded-2xl p-2 border-2 border-white/50 flex flex-row items-center hover:bg-black/50 transition-all duration-300 ease-in-out relative w-full">
                                <Image
                                    src={"/lock.svg"}
                                    width={30}
                                    height={30}
                                    alt="Password"
                                    className="opacity-50"
                                />
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="rounded-2xl px-4 py-2 text-xl outline-none min-w-3/4 w-full bg-transparent text-white"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    onClick={() => setShowPassword(s => !s)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <Image src={"/eye-password-hide.svg"} width={25} height={25} alt="Show Password" />
                                    ) : (
                                        <Image src={"/eye-password-show.svg"} width={25} height={25} alt="Hide Password" />
                                    )}
                                </button>
                            </div>

                            {/* password criteria checklist */}
                            <div className="mt-2 text-white text-base w-full">
                                <span className="font-bold">Your password must have :</span>
                                <ul className="mt-1 ml-4 space-y-1 ">
                                    <li className={hasUpperLowerDigit ? "text-green-400" : "text-red-500/80"}>
                                        {hasUpperLowerDigit ? "✓" : "✗"} uppercase/lowercase and digits
                                    </li>
                                    <li className={hasSpecialChar ? "text-green-400" : "text-red-500/80"}>
                                        {hasSpecialChar ? "✓" : "✗"} special characters like !@#$%*&()_+
                                    </li>
                                    <li className={hasMinLength ? "text-green-400" : "text-red-500/80"}>
                                        {hasMinLength ? "✓" : "✗"} at least 8 characters long
                                    </li>
                                </ul>
                            </div>
                            <button type="submit" className="px-4 py-2 bg-white/90 text-black rounded-2xl m-4 text-2xl cursor-pointer transition-all duration-300 ease-in-out shadow-lg shadow-white/30 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-indigo-500 hover:text-white hover:scale-105 active:scale-95 focus:ring-2 focus:ring-cyan-400">
                                Sign Up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default page
