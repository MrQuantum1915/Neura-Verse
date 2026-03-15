"use client"
import Image from "next/image"
import { Mail, Lock } from "lucide-react"
import Link from "next/link";
import { Roboto } from 'next/font/google';
import { oAuth } from "../_actions/oAuth";
import { loginWithEmail } from "../_actions/email_login";
import MyAlert from "@/components/MyAlert";
import { useState } from "react";
// import { createClient_client } from "@/utils/supabase/supabaseClient";
// import { redirect } from 'next/navigation'


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

  const [alert, setalert] = useState(false);
  const [alertMessage, setalertMessage] = useState("Alert");

  return (
    <div className={`bg-black flex items-center text-center justify-center w-full h-screen relative ${roboto.className}`}>
      {
        alert && (
          <MyAlert message={alertMessage} alertHandler={setalert} />
        )
      }
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div
          className="w-full max-w-lg h-[70vh] rounded-3xl opacity-70 blur-3xl"
          style={{
            background: "linear-gradient(45deg, #00fff7 0%, #5500ff 100%)",
          }}></div>
      </div>

      <div className="z-50 bg-black/50 rounded-2xl p-4 shadow-md shadow-white w-[90%] max-w-md flex flex-col items-center">
        <div className="px-6 py-4 items-center justify-center flex flex-col w-full">

          <h1 className="text-3xl md:text-4xl my-2 mb-4">Welcome back</h1>
          <h1 className="text-2xl md:text-3xl my-2 mb-4">LOGIN To Gain Full Experience</h1>
          <h2 className="text-green-400">It'll only take mere seconds</h2>
          <div className="flex flex-col gap-4 w-full items-center justify-center">
            <div className="m-2 text-white/50 text-2xl font-bold">
              OAuth
            </div>
            <div className="flex flex-row flex-wrap gap-4 items-center justify-center w-full">
              {
                oAuthProviders.map((item) => {
                  return (
                    <button
                      key={item.Name}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl border-2 border-white/50 flex flex-row items-center justify-center cursor-pointer hover:bg-white/20 focus:bg-white/20 transition-all duration-300 ease-in-out relative overflow-hidden group"
                      onClick={() => oAuth(item.providerID)}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                      <Image
                        src={item.Icon}
                        width={30}
                        height={30}
                        alt={item.Name}
                        className="z-10 mr-2"
                      />
                      <div className="text-white/75 text-xl z-10"> {item.Name}</div>
                    </button>)
                })
              }
            </div>
          </div>

          <div className="flex items-center text-center w-full my-6 ">
            <div className="flex-grow h-px bg-white/50"></div>
            <span className="mx-2 font-bold text-white/50">OR</span>
            <div className="flex-grow h-px bg-white/50"></div>
          </div>

          <form
            className="w-full"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData;
              formData.append('email', e.target.elements.email.value);
              formData.append('password', e.target.elements.password.value);
              const { error } = await loginWithEmail(formData);
              if (error) {
                if (error == "AuthApiError: Invalid login credentials") {
                  setalertMessage("User credentials are invalid. Please enter correct Email and Password!")
                  setalert(true);
                }
                else {
                  setalertMessage("Login Failed. Try Again!")
                  setalert(true);
                }
              }
              else {
                window.location.href = "/"
              }
            }}
          >
            <div className="flex flex-col gap-4 w-full items-center justify-center">
              <div className="text-white/50 text-2xl m-2 font-bold self-start">
                Email
              </div>
              <div className="w-full rounded-2xl p-2 border-2 border-white/50 flex flex-row items-center hover:bg-black/50 transition-all duration-300 ease-in-out">
                <Mail size={25} className="opacity-50 text-white min-w-[25px]" />
                <input name="email" type="email" placeholder="Email" className="bg-transparent text-white w-full rounded-2xl px-4 py-2 text-xl outline-none" required />
              </div>
              <div className="w-full rounded-2xl p-2 border-2 border-white/50 flex flex-row items-center hover:bg-black/50 transition-all duration-300 ease-in-out">
                <Lock size={25} className="opacity-50 text-white min-w-[25px]" />
                <input name="password" type="password" placeholder="Password" className="bg-transparent text-white w-full rounded-2xl px-4 py-2 text-xl outline-none" required />
              </div>

              <button type="submit" className="w-full sm:w-auto px-8 py-3 bg-white/90 text-black rounded-2xl m-4 text-2xl cursor-pointer transition-all duration-300 ease-in-out shadow-lg shadow-white/30 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-indigo-500 hover:text-white hover:scale-105 active:scale-95 focus:ring-2 focus:ring-cyan-400">
                Login
              </button>
            </div>

          </form>

          <div>
            <p className="text-white/50 text-lg">
              Don't have an account? <Link href="/auth/signup" className="text-cyan-400 hover:underline">Sign Up</Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default page
