"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItemClass =
    "text-white/50 text-xl hover:text-white border-b-2 border-transparent hover:border-b-white/50 active:border-b-white h-full px-2 flex items-center transition-colors duration-300 ease-in-out mx-2";
const navItemActiveClass =
    "text-white/100 border-b-2 border-b-white font-bold";

function NavItem({ href, children }) {

    const pathname = usePathname();
    const isActive = href === pathname;

    return (
        <Link href={href} className={isActive ? `${navItemClass} ${navItemActiveClass}` : navItemClass}>
            {children}
        </Link>
    );
}

export default NavItem