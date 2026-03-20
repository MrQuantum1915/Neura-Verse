"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItemClass =
    "text-white/50 hover:text-orange-500 relative group flex items-center transition-colors duration-300 ease-in-out mx-2 font-bold px-4 py-2";
const navItemActiveClass =
    "text-orange-500 relative group flex items-center transition-colors duration-300 ease-in-out mx-2 font-bold px-4 py-2";

function NavItem({ href, children, className = "" }) {

    const pathname = usePathname();
    const isActive = href === pathname;

    return (
        <Link href={href} className={`${isActive ? navItemActiveClass : navItemClass} ${className}`}>
            {children}
            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-white transform origin-center transition-transform duration-300 ease-in-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
        </Link>
    );
}

export default NavItem