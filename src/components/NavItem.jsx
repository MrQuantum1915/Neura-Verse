"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItemClass =
    "text-white/50 hover:text-white/100 border-b-2 border-transparent hover:border-b-white/50 active:border-b-white h-full px-2 flex items-center transition-colors duration-300 ease-in-out mx-2 rounded-lg font-bold px-4 py-2";
const navItemActiveClass =
    "text-white/100 border-b-2 border-white hover:border-b-white/50 active:border-b-white h-full px-2 flex items-center transition-colors duration-300 ease-in-out mx-2 rounded-lg font-bold px-4 py-2";

function NavItem({ href, children }) {

    const pathname = usePathname();
    const isActive = href === pathname;

    return (
        <Link href={href} className={isActive ? `${navItemActiveClass}` : navItemClass}>
            {children}
        </Link>
    );
}

export default NavItem