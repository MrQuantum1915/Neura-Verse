"use client"
import Image from "next/image"
import Link from "next/link";
import { Roboto } from 'next/font/google';
import { oAuth } from "../_actions/oAuth";
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

  // const handleOAuth = async (providerID) => {
  // oAuth(providerID);

  // well this is not true, guess what because it is possible :) 
  // we can't use server actions to handle OAuth because Server actions ('use server') run on the server and cannot open a browser window or redirect the user. OAuth requires the user to be redirected to the provider (Google, etc.) and then back to your app.

  // const supabase = createClient_client();
  // const {data, error } = await supabase.auth.signInWithOAuth({
  //   provider: providerID,
  //   options: {
  //       redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`, // this is callback route to handle storing asession cookies in browser
  //   },
  // });

  // if (error) {
  //   console.error('Error during OAuth login:', error);
  //   redirect('/auth/error');
  // }


  // }


  return (
    <div className={`bg-black flex items-center justify-center w-full h-screen relative ${roboto.className}`}>

      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div
          className="w-110 h-170 rounded-3xl opacity-70 blur-3xl"
          style={{
            background: "linear-gradient(45deg, #00fff7 0%, #5500ff 100%)",
          }}></div>
      </div>

      <div className="z-50 bg-black/50 rounded-2xl p-4 shadow-md shadow-white w-fit max-w-120 h-fit flex flex-col items-center">
        <div className="px-6 py-4 items-center justify-center flex flex-col">

          <h1 className="text-4xl my-2 mb-4">Welcome back</h1>
          
          <div className="flex flex-col gap-4 w-full items-center justify-center">
            <div className="m-2 text-white/50 text-2xl font-bold">
              OAuth
            </div>
            <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
              {
                oAuthProviders.map((item) => {
                  return (
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
                    </button>)
                })
              }
            </div>
          </div>

          <div className="flex items-center text-center w-90  my-6 ">
            <div className="flex-grow h-px bg-white/50"></div>
            <span className="mx-2 font-bold text-white/50">OR</span>
            <div className="flex-grow h-px bg-white/50"></div>
          </div>

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
              <input type="email" placeholder="Email" className="rounded-2xl px-4 py-2 text-xl outline-none min-w-3/4" />
            </div>
            <div className="rounded-2xl p-2 border-2 border-white/50 flex flex-row hover:bg-black/50 transition-all duration-300 ease-in-out">
              <Image
                src={"/lock-alt-svgrepo-com.svg"}
                width={30}
                height={30}
                alt="Email"
                className="opacity-50"
              />
              <input type="password" placeholder="Password" className="rounded-2xl px-4 py-2 text-xl outline-none min-w-3/4" />
            </div>

            <button className="px-4 py-2 bg-white/90 text-black rounded-2xl m-4 text-2xl cursor-pointer transition-all duration-300 ease-in-out shadow-lg shadow-white/30 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-indigo-500 hover:text-white hover:scale-105 active:scale-95 focus:ring-2 focus:ring-cyan-400">
              Login
            </button>
            <div>
              <p className="text-white/50 text-lg">
                Don't have an account? <Link href="/auth/signup" className="text-cyan-400 hover:underline">Sign Up</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default page
