"use client";
import { usePathname } from "next/navigation";
import NavBar from "@/components/NavBar";

function ConditionallyIncludeNavbar() {
    const pathname = usePathname();
    const pagesToExclude = ["/auth", "/signup", "/playgrounds/", "/profile"];
    const includeNavbar = !pagesToExclude.some(page => pathname.startsWith(page));
    return (
        includeNavbar && (<NavBar />)
    );
}

export default ConditionallyIncludeNavbar   