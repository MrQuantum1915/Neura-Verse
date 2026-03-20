"use client" //(although doesnt make a difference if include this or not because the parent component is already a client component "ConditionallyIncludeNavbar.jsx")

import "@/app/globals.css";
import Link from "next/link";
import NavItem from "./NavItem";
import HamburgerButton from "./HamburgerButton";
import { createClient_client } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CircleUser } from "lucide-react";

import { Michroma } from "next/font/google"
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-michroma',
});



const navItems = [
  { href: "/home", label: "HOME" },
  { href: "/playgrounds", label: "PLAYGROUNDS" },
  { href: "/contact", label: "CONTACT" },
];

function NavBar() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [profile_pic, setprofile_pic] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {

    const fetchUserLoggedIn = async () => {
      const supabase = createClient_client();
      const { data, error } = await supabase.auth.getSession();
      setUserLoggedIn(!!data.session);

      // get user's public data saved in cookies
      if (data.session) {
        function getCookie(name) {

          const value = `; ${document.cookie}`; // prepend a semicolon and space to all cookies to make splitting easier

          const parts = value.split(`; ${name}=`);   // split the cookie string into parts at the desired cookie name (with the pattern "; name=")
          // if the cookie was found, there will be 2 parts in the array
          if (parts.length === 2) {
            // pop the last part (after the cookie name), split at the next semicolon, and get the first value (the cookie value itself)
            return decodeURIComponent(parts.pop().split(';').shift()); // because cookie stores the url in encoded version due to certain characters, so we need to decode it first.
          }
          else {
            return null;
          }
        }
        setprofile_pic(getCookie('profile_pic'));
        console.log("pfp", profile_pic)
      }
    };

    fetchUserLoggedIn();

  }, []);


  return (
    <nav className="px-4 w-full top-0 left-0 fixed border-b border-white/20 bg-black z-[120]">
      <div className={`${michroma.className} w-full flex flex-row justify-between items-center py-2 relative`}>
        <Link href="/" className="z-[60]">
          <Image 
            src={"/nv.svg"} 
            width={0} 
            height={0} 
            // sizes="100vw"
            alt="logo" 
            className="w-32 md:w-40 h-auto brightness-150 hover:scale-105 transition-all duration-500 ease-in-out pointer-events-none"
          />
        </Link>
        
 
        <HamburgerButton 
          isOpen={isMenuOpen} 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
        />

      
        <ul className="hidden md:flex flex-row items-center justify-around gap-8 cursor-pointer h-full">
          {navItems.map((items) => (
            <li key={items.label} className="h-full">
              <NavItem href={items.href} className="h-full">
                {items.label} 
              </NavItem>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          {userLoggedIn ? (
            <Link href={"/profile"}>
              <div key={"profile"} className="cursor-pointer">
                {(!profile_pic || profile_pic === "/pfp-placeholder-2.svg") ? (
                  <CircleUser size={45} className="text-white opacity-80 rounded-none border-2 transition-all duration-300 ease-in-out hover:bg-white hover:text-black border-white" />
                ) : (
                  <Image
                    src={profile_pic}
                    width={45}
                    height={45}
                    alt="Profile"
                    style={{ aspectRatio: "1/1" }}
                    className=" object-cover rounded-none border-2 transition-all duration-300 ease-in-out hover:opacity-80 border-white" />
                )}
              </div>
            </Link>
          ) : (
            <Link href={"/auth/login"}>
              <div key={"SignIn"} className="px-6 py-2 border-2 border-white rounded-none bg-white text-black font-bold hover:bg-transparent hover:text-white transition-all duration-300">
                Sign In
              </div>
            </Link>
          )}
        </div>


        <div 
          className={`fixed inset-0 w-full min-h-screen bg-black transform transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1) md:hidden flex flex-col items-center justify-center gap-10 z-[55] overflow-y-auto ${
            isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          }`}
        >
          <ul className="flex flex-col items-center gap-8 text-2xl w-full">
            {navItems.map((items, idx) => (
              <li 
                key={items.label} 
                onClick={() => setIsMenuOpen(false)} 
                className={`w-full flex justify-center transition-all duration-700 ease-out transform ${
                  isMenuOpen ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
                }`}
                style={{ transitionDelay: `${150 + idx * 100}ms` }}
              >
                <NavItem href={items.href} className="justify-center py-4 w-auto text-3xl font-light tracking-wider hover:text-white transition-colors duration-300">
                  {items.label}
                </NavItem>
              </li>
            ))}
          </ul>
          
          <div 
            onClick={() => setIsMenuOpen(false)} 
            className={`flex flex-col items-center gap-6 transition-all duration-700 ease-out transform ${
              isMenuOpen ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"
            }`}
             style={{ transitionDelay: `${150 + navItems.length * 100}ms` }}
          >
            {userLoggedIn ? (
              <Link href={"/profile"} className="flex flex-col items-center gap-2 group">
                 {(!profile_pic || profile_pic === "/pfp-placeholder-2.svg") ? (
                  <CircleUser size={60} className="text-white/80 group-hover:text-white transition-colors duration-300 rounded-none border-2 border-transparent group-hover:border-white p-1" />
                ) : (
                  <Image
                    src={profile_pic}
                    width={60}
                    height={60}
                    alt="Profile"
                    style={{ aspectRatio: "1/1" }}
                    className="object-cover rounded-none border-2 border-white transition-transform duration-300 hover:scale-105" />
                )}
                <span className="text-white text-lg font-bold">My Profile</span>
              </Link>
            ) : (
              <Link href={"/auth/login"}>
                <div key={"SignIn"} className="px-8 py-3 border-2 border-white rounded-none bg-white text-black font-bold text-xl hover:bg-transparent hover:text-white transition-all duration-300">
                  Sign In
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      
    </nav>
  );
}
export default NavBar;
