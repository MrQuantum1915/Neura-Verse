"use client";
import Image from "next/image";
import { useState } from "react";
import HistoryTab from "@/components/lumina/HistoryTab";
import Link from "next/link";
import { Oswald, Playfair_Display } from 'next/font/google';

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
  { href: "dashboard", label: "Dashboard", icon: "/dashboard.svg" },

];

let sidebarSvg = (
  <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white"
    strokeWidth="2" className="feather feather-align-justify">
    <line x1="21" y1="10" x2="3" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="21" y1="18" x2="3" y2="18"></line>
  </svg>
);

function Sidebar({ page, setsidebarClose }) {
  const [sidebar, setSidebar] = useState(true);

  return (
    <div className={`z-2 flex flex-row items-start justify-between min-h-screen  bg-black border-r-2 border-amber-50/10 text-white`}>
      <div
        className={
          sidebar
            ? "flex flex-col h-screen items-start w-64 bg-black transition-all duration-1000 ease-in-out"
            : "flex flex-col h-screen items-start opacity-0 w-0 overflow-hidden text-wrap-none transition-all duration-1000 ease-in-out"
        }
      >
        <div className="w-full">
          <Link href="/playgrounds/lumina">
            <h1 className={`text-5xl m-6  cursor-pointer ${playfairDisplay.className}`}>{page}</h1>
          </Link>

          <div className="h- w-full">
            <HistoryTab />
          </div>
          {/* navigation */}
          <div className="flex flex-col items-center m-2 relative bottom-3">
            {navigationItems.map((items => (
              <Link href={items.href} key={items.label}>
                <div className="flex items-center justify-center cursor-pointer border border-amber-50/10 rounded-2xl p-2 m-2 hover:bg-white/10 w-fit">
                  <Image src={items.icon} width={30} height={30} alt={items.label} className="cursor-pointer m-1 invert " />
                  <div className="px-4">{items.label}</div>
                </div>
              </Link>
            )))}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between items-center">
        <button
          className="mt-5 cursor-pointer w-12 w-16 px-2"
          onClick={() => {
            setSidebar(!sidebar);
            if (!sidebar) {
              setsidebarClose(false);
            } else {
              setsidebarClose(true);
            }
            }}
          aria-label={sidebar ? "Close sidebar" : "Open sidebar"}
        >

          <svg width="50px" height="50px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth="1">
            {sidebar ? (
              <>
                <line x1="21" y1="10" x2="7" y2="10" className="transition-all duration-300" />
                <line x1="21" y1="15" x2="10" y2="15" className="transition-all duration-300" />
                <line x1="21" y1="20" x2="4" y2="20" className="transition-all duration-300" />
              </>
            ) : (
              <>
                <line x1="19" y1="10" x2="3" y2="10" className="transition-all duration-300" />
                <line x1="14" y1="15" x2="3" y2="15" className="transition-all duration-300" />
                <line x1="20" y1="20" x2="3" y2="20" className="transition-all duration-300" />
              </>
            )
            }

          </svg>
          {/* <Image
            src={`${sidebar ? "/sidebar.svg" : "/sidebar.svg"}`}
            width={40}
            height={40}
            alt="Sidebar Toggle"
            className={`${!sidebar ? "rotate-[-180deg]" : ""} transition-all duration-1000 ease-in-out`}
          /> */}
        </button>

        {
          !sidebar && (

            <div className="flex flex-col items-center m-auto fixed bottom-0">
              {navigationItems.map((items => (
                <Link href={items.href} key={items.label}>
                  <div className="flex items-center justify-center cursor-pointer border border-amber-50/10 rounded-xl p-2 m-2 hover:bg-white/10 w-fit">
                    <Image src={items.icon} width={30} height={30} alt={items.label} className="cursor-pointer m-1 invert " />
                  </div>
                </Link>
              )))}
            </div>
          )
        }

      </div>
    </div >
  );
}

export default Sidebar;
