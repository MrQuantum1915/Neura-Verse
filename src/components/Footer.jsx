import React from 'react'
import Link from 'next/link'
import Image from 'next/image';


const iconMap = {
  github: (
    <svg width="32" height="32" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
      <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#fff" />
    </svg>
  ),

  x: (
    <svg width="24" height="24" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" fill="white" />
    </svg>

  ),

  linkedin: (
    <Image
      src="/linkedin.png"
      width={35}
      height={35}
      alt="LinkedIn Logo"
    />
  ),
}

const socialItemClass = "opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out cursor-pointer mt-auto px-2 py-2 flex items-center justify-center h-full";

const socialItem = [
  { href: "https://github.com/MrQuantum1915", icon: "github" },
  { href: "https://x.com/PatelDarsh92081", icon: "x" },
  { href: "https://www.linkedin.com/in/darshan-patel-1713062a4", icon: "linkedin" },
];

const footerNavItem = [
  { href: "/home", label: "Home" },
  { href: "/playgrounds", label: "Playgrounds" },
  { href: "/contact", label: "Contact" },
];

function SocialItem({ href, icon }) {
  return (
    <li>
      <Link href={href} target="_blank" className={socialItemClass}>
        {iconMap[icon]}
      </Link>
    </li>
  )
}

const footerNavItemClass = "text-white/50 hover:text-white border-b-1 border-transparent hover:border-white/100 cursor-pointer my-3 transition-all duration-300 ease-in-out";

function FooterNavItem({ href, children }) {
  return (
    <li className={footerNavItemClass}>
      <Link href={href}>{children}</Link>
    </li>
  );
}

function Footer() {
  return (
    <footer className={`flex flex-col items-center gap-4 bg-gradient-to-b from-black/20 via-black/60 to-black text-white items-center justify-center border-t-1 border-t-white/40 w-full z-[100]`}>

      <div className="flex flex-row flex-wrap justify-around w-full mt-10">

        <div className="flex flex-col items-center gap-2 mt-4">
          <p className='text-xl text-white/70 font-black '>Mr. Quantum_1915</p>
          <div>
            <ul className="flex flex-row flex-wrap items-center justify-between">
              {socialItem.map((item) => (
                <SocialItem key={item.href} href={item.href} icon={item.icon} />
              ))}
            </ul>
          </div>
        </div>


        <div className="flex flex-col px-4 mx-10 justify-between items-center">
          <h2 className="text-2xl mb-3 underline">
            Links
          </h2>

          <ul className="flex flex-col items-center h-full text-xl">
            {footerNavItem.map((item) => (
              <FooterNavItem key={item.label} href={item.href}>
                {item.label}
              </FooterNavItem>
            ))}
          </ul>
        </div>

      </div>

      <div >
        <p className="text-lg text-white/50 font-bold ml-2"> &copy; 2025 Neura-Verse. All rights reserved.</p>
        <p className='text-8xl mb-5 text-center font-black text-[#575757] tracking-[2.5rem]'>NEURA VERSE</p>
      </div>

    </footer>
  )
}

export default Footer
