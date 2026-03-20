"use client";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

function ConditionallyIncludeNavbar() {
    const pathname = usePathname();
    const pagesToExclude = ["/auth", "/signup", "/playgrounds/lumina", "/profile"];
    const includeNavbar = !pagesToExclude.some(page => pathname.startsWith(page));
    return (
        includeNavbar && (
            <>
                <NavBar />
                <div className="h-[65px] md:h-[73px]"></div>
            </>
        )
    );
}

export default ConditionallyIncludeNavbar   