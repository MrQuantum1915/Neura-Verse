"use client" //(although doesnt make a difference if include this or not because the parent component is already a client component "ConditionallyIncludeNavbar.jsx")

import "@/app/globals.css";
import Link from "next/link";
import NavItem from "./NavItem";
import { createClient_client } from "@/utils/supabase/supabaseClient";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Michroma } from "next/font/google"
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-michroma',
});



const navItems = [
  { href: "/home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/playgrounds", label: "Playgrounds" },
  { href: "/contact", label: "Contact" },
];

function NavBar() {

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [profile_pic, setprofile_pic] = useState(null)

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
        console.log("pfp",profile_pic)
      }
    };

    fetchUserLoggedIn();

  }, []);


  //convert to SSR


  return (
    <nav className="px-4 h-fit w-full flex items-center top-0 sticky border-b-1 border-b-white/10 bg-black/20 backdrop-blur-lg z-90">
      <div className={`${michroma.className} w-full h-full flex flex-row justify-between items-center flex-wrap items-center`}>
        <Link href="/">
          <Image src={"/Neura Verse Logo (Self Made)-v3.0-nobg.png"} width={200} height={55} alt="logo" className="my-2 hover:scale-105 transition-all duration-500 ease-in-out"></Image>
        </Link>

        <ul className="flex flex-row flex-wrap h-full items-center justify-around cursor-pointer">
          {navItems.map((items) => (
            <li key={items.label} className="h-full">
              <NavItem href={items.href}>
                {/* I made this a client side to dynamically highlight the page userLoggedIn is on, in the navbar. to use client side hooks like usePathname we need to make it client side, it is better to make only navitem a client side instead of making whole navbar client side. Also you can only call a component from server and not a custom hook, so you need to make whole navitem cleint side.*/}
                {items.label} {/* this is the children prop that is passed to navitem) */}
              </NavItem>
            </li>
          ))}
        </ul>
        {
          userLoggedIn ? (
            <Link href={"/profile"}>
              <div key={"profile"}>
                <Image
                  src={profile_pic || "/pfp-placeholder-2.svg"}
                  width={55}
                  height={55}
                  alt="Profile"
                  style={{ aspectRatio: "1/1" }}
                  className=" object-cover rounded-full border-2 transition-all duration-300 ease-in-out hover:bg-white/50 border-white" />
              </div>
            </Link>
          ) : (
            <Link href={"/auth/login"}>
              <div key={"SignIn"} className="px-4 py-2 rounded-xl bg-white text-black font-bold">
                Sign In
              </div>
            </Link>
          )
        }
      </div>
    </nav>
  );
}
export default NavBar;
