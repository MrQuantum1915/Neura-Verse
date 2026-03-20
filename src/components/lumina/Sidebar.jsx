"use client";
import Image from "next/image";
import { Home, Wrench, CircleUser, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import { useState } from "react";
import HistoryTab from "@/components/lumina/HistoryTab";
import Link from "next/link";
import { Oswald, Playfair_Display } from 'next/font/google';
import { useRouter } from "next/navigation";

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
  variable: '--font-oswald',
});

const navigationItems = [

  { href: "/home", label: "Home", icon: <Home size={24} className="text-white cursor-pointer m-1" /> },
  { href: "/playgrounds", label: "Playgrounds", icon: <Wrench size={24} className="text-white cursor-pointer m-1" /> },
];

function Sidebar({ page, sidebarClose, setsidebarClose, profile_pic, CurrThreadID, CurrThreadName, setCurrThreadName, navigatingThread, setnavigatingThread, responseComplete }) {

  const router = useRouter();

  if (profile_pic === null) {
    profile_pic = "/pfp-placeholder-2.svg";
  }
  return (
    <>

      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300 ${!sidebarClose ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => {
          setsidebarClose(true);
        }}
      />

      <div className={`z-[100] md:z-10 absolute top-0 left-0 md:relative flex flex-row items-start justify-between h-full bg-black border-r-2 border-white/20 text-white transition-transform duration-300 ${sidebarClose ? '-translate-x-full md:translate-x-0' : 'shadow-[4px_0_24px_rgba(0,0,0,0.5)] md:shadow-none translate-x-0'}`}>
        <div
          className={
            // sidebar
            `flex flex-col h-full items-start ${!sidebarClose ? ("w-70") : ("opacity-0 w-0 translate-x-[-100%] pointer-events-none")} bg-black transition-all duration-1000 ease-in-out`
            // "flex flex-col h-screen items-start  transition-all duration-1000 ease-in-out"
          }
        >
          <div className="w-full h-full flex flex-col gap-1 justify-between">
            <div className="flex flex-row justify-between items-center w-full px-5 pt-2">
              <Link href="/playgrounds/lumina">
                <h1 className={`text-4xl cursor-pointer bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent transition-all duration-200 ease-in-out ${playfairDisplay.className}`}>{page}</h1>
              </Link>
              <button
                className={`cursor-pointer p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-white/10 transition-all duration-300 ease-in-out active:scale-95`}
                onClick={() => {
                  setsidebarClose(true);
                }}
                aria-label={"Close sidebar"}
              >
                <PanelLeftClose size={30} strokeWidth={1} className="text-white" />
              </button>
            </div>


            <div className="flex-1 min-h-0 w-full">
              <HistoryTab CurrThreadID={CurrThreadID} CurrThreadName={CurrThreadName} setCurrThreadName={setCurrThreadName} setnavigatingThread={setnavigatingThread} navigatingThread={navigatingThread} responseComplete={responseComplete} profile_pic={profile_pic} />
            </div>

            {/* navigation */}
            <div className="flex flex-col m-4">
              {navigationItems.map((items => (
                <Link href={items.href} key={items.label}>
                  <div className="flex items-center justify-center cursor-pointer rounded-lg p-2  hover:bg-white/10 w-fit opacity-75 hover:opacity-100 border border-white/0 hover:border-white/30  transition-all duration-200 ease-in-out">
                    <span className="flex items-center justify-center">{items.icon}</span>
                    <div className="px-4">{items.label}</div>
                  </div>
                </Link>
              )))}

              <Link href={"/profile"}>
                <div className="flex items-center justify-center cursor-pointer rounded-lg p-2 hover:bg-white/10 w-fit opacity-75 hover:opacity-100 border border-white/0 hover:border-white/30  transition-all duration-200 ease-in-out">
                  {profile_pic === "/pfp-placeholder-2.svg" ? (
                    <CircleUser size={40} className="text-white opacity-80 mx-1" />
                  ) : (
                    <Image
                      src={profile_pic}
                      alt="Profile Picture"
                      width={30}
                      height={30}
                      className="rounded-full"
                      style={{ aspectRatio: "1/1" }}
                    />
                  )}
                  <div className="px-4">Profile</div>
                </div>
              </Link>

            </div>
          </div>
        </div>

        {
          sidebarClose && (
            <div className="flex flex-col justify-between items-center w-full min-w-[60px] relative">
              <button
                className="mt-6 cursor-pointer p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-white/10 transition-all duration-300 ease-in-out active:scale-95 hidden md:block"
                onClick={() => {
                  setsidebarClose(false);
                }}
                aria-label={"Open sidebar"}
              >
                <PanelLeftOpen size={30} strokeWidth={1} className="text-white" />
              </button>



              <div className="hidden md:flex flex-col items-center justify-between h-[90vh]">
                <div className="my-8">
                  <button
                    className="rounded-full bg-white/10 border border-white/0 hover:border-white/30 transition-all duration-200 ease-in-out cursor-pointer"
                    onClick={async () => {
                      router.push(`/playgrounds/lumina/`);
                      setCurrThreadName("New Thread");
                    }}
                  >
                    <Plus
                      size={35}
                      className="p-1 text-white opacity-50 hover:opacity-100"
                    />
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center">

                  {navigationItems.map((items => (
                    <Link href={items.href} key={items.label}>
                      <div className="cursor-pointer hover:bg-white/10 opacity-75 hover:opacity-100 border border-white/0 hover:border-white/30   rounded-full p-2 py-1 w-fit transition-all duration-200 ease-in-out">
                        <span className="flex items-center justify-center">{items.icon}</span>
                      </div>
                    </Link>
                  )))}

                  <Link href={"/profile"}>
                    <div className="cursor-pointer border-2 opacity-75 hover:opacity-100 border border-white/0 hover:border-white/30  rounded-full m-2 w-fit transition-all duration-200 ease-in-out">
                      {profile_pic === "/pfp-placeholder-2.svg" ? (
                        <CircleUser size={24} className="text-white opacity-80" />
                      ) : (
                        <Image
                          src={profile_pic}
                          alt="Profile Picture"
                          width={30}
                          height={30}
                          className="rounded-full"
                          style={{ aspectRatio: "1/1" }}
                        />
                      )}
                    </div>
                  </Link>
                </div>

              </div>


            </div>
          )
        }
      </div >
    </>
  );
}

export default Sidebar;
