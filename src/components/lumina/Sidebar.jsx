"use client";
import Image from "next/image";
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

  { href: "/home", label: "Home", icon: "/home.svg" },
  { href: "/playgrounds", label: "Playgrounds", icon: "/tools.svg" },
];

// let sidebarSvg = (
//   <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white"
//     strokeWidth="2" className="feather feather-align-justify">
//     <line x1="21" y1="10" x2="3" y2="10"></line>
//     <line x1="21" y1="6" x2="3" y2="6"></line>
//     <line x1="21" y1="14" x2="3" y2="14"></line>
//     <line x1="21" y1="18" x2="3" y2="18"></line>
//   </svg>
// );

function Sidebar({ page, setsidebarClose, profile_pic, CurrThreadID, CurrThreadName, setCurrThreadName, navigatingThread, setnavigatingThread, responseComplete }) {

  const router = useRouter();

  const [sidebar, setSidebar] = useState(true);
  if (profile_pic === null) {
    profile_pic = "/pfp-placeholder-2.svg";
  }
  return (
    <div className={`z-100 flex flex-row items-start justify-between min-h-screen  bg-black border-r-2 border-white/20 text-white`}>
      <div
        className={
          // sidebar
          `flex flex-col h-screen items-start ${sidebar ? ("w-70") : ("opacity-0 w-0 translate-x-[-100%] pointer-events-none overflow-hidden text-wrap-none overflow-x-hidden")} bg-black transition-all duration-1000 ease-in-out`
          // "flex flex-col h-screen items-start  transition-all duration-1000 ease-in-out"
        }
      >
        <div className="w-full">
          <div className="flex flex-row justify-between items-centerm">
            <Link href="/playgrounds/lumina">
              <h1 className={`text-5xl m-4  cursor-pointer bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent transition-all duration-300 ease-in-out ${playfairDisplay.className}`}>{page}</h1>
            </Link>
            <button
              className={` cursor-pointer w-12 w-16 px-2 rounded-full opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out`}
              onClick={() => {
                setSidebar(false);
                setsidebarClose(true);
              }}
              aria-label={"Close sidebar"}
            >

              <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth="1">

                <>
                  <line x1="21" y1="10" x2="7" y2="10" className="transition-all duration-300" />
                  <line x1="21" y1="15" x2="10" y2="15" className="transition-all duration-300" />
                  <line x1="21" y1="20" x2="4" y2="20" className="transition-all duration-300" />
                </>

              </svg>

            </button>
          </div>


          <div className="w-full">
            <HistoryTab CurrThreadID={CurrThreadID} CurrThreadName={CurrThreadName} setCurrThreadName={setCurrThreadName} setnavigatingThread={setnavigatingThread} navigatingThread={navigatingThread} responseComplete={responseComplete} />
          </div>


          {/* navigation */}
          <div className="flex flex-col items-start absolute bottom-3">
            {navigationItems.map((items => (
              <Link href={items.href} key={items.label}>
                <div className="flex items-center justify-center cursor-pointer rounded-lg p-2 m-2 hover:bg-white/20 w-fit opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
                  <Image src={items.icon} width={30} height={30} alt={items.label} className="cursor-pointer m-1 invert " />
                  <div className="px-4">{items.label}</div>
                </div>
              </Link>
            )))}



            <Link href={"/profile"}>
              <div className="flex items-center justify-center cursor-pointer rounded-lg p-2 m-2 hover:bg-white/20 w-fit opacity-75 hover:opacity-100 transition-all duration-300 ease-in-out">
                <Image
                  src={profile_pic}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full aspectRatio-1/1"
                  style={{ aspectRatio: "1/1" }}
                />
                <div className="px-4">Profile</div>
              </div>
            </Link>

          </div>


        </div>
      </div>

      {
        !sidebar && (
          <div className="flex flex-col justify-between items-center w-fit relative">
            <button
              className="mt-5 cursor-pointer w-12 w-16 px-2 rounded-full opacity-50   hover:opacity-100 transition-all duration-300 ease-in-out"
              onClick={() => {
                setSidebar(true);
                setsidebarClose(false);
              }}
              aria-label={"Open sidebar"}
            >

              <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth="1">

                <>
                  <line x1="19" y1="10" x2="3" y2="10" className="transition-all duration-300" />
                  <line x1="14" y1="15" x2="3" y2="15" className="transition-all duration-300" />
                  <line x1="20" y1="20" x2="3" y2="20" className="transition-all duration-300" />
                </>


              </svg>
              {/* <Image
            src={`${sidebar ? "/sidebar.svg" : "/sidebar.svg"}`}
            width={40}
            height={40}
            alt="Sidebar Toggle"
            className={`${!sidebar ? "rotate-[-180deg]" : ""} transition-all duration-1000 ease-in-out`}
          /> */}
            </button>



            <div className="flex flex-col items-center justify-between h-[90vh]">
              <div className="my-8">
                <button
                  onClick={async () => {
                    router.push(`/playgrounds/lumina/`);
                    setCurrThreadName("New Thread");
                  }}
                >
                  <Image
                    src={"/plus.svg"}
                    width={40}
                    height={40}
                    alt={"new thread"}
                    className={`p-2 opacity-50 hover:opacity-100 rounded-full bg-white/20 cursor-pointer transition-all duration-300 ease-in-out`}
                  />
                </button>
              </div>
              <div>

                {navigationItems.map((items => (
                  <Link href={items.href} key={items.label}>
                    <div className="flex items-center justify-center cursor-pointer hover:bg-white/20 opacity-75 hover:opacity-100  rounded-lg p-2 py-1 m-2  w-fit transition-all duration-400 ease-in-out">
                      <Image src={items.icon} width={30} height={30} alt={items.label} className="cursor-pointer m-1 invert " />
                    </div>
                  </Link>
                )))}

                <Link href={"/profile"}>
                  <div className="flex items-center justify-center cursor-pointer border-2 opacity-75 hover:opacity-100 rounded-full m-2 w-fit transition-all duration-400 ease-in-out">
                    <Image
                      src={profile_pic}
                      alt="Profile Picture"
                      width={50}
                      height={50}
                      className="rounded-full aspectRatio-1/1"
                      style={{ aspectRatio: "1/1" }}
                    />
                  </div>
                </Link>
              </div>

            </div>


          </div>
        )
      }
    </div >
  );
}

export default Sidebar;
