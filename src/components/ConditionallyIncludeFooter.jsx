"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

function ConditionallyIncludeFooter() {
    const pathname = usePathname();
    const pagesToExclude = ["/login", "/signup", "/playgrounds/"];
    const includeNavbar = !pagesToExclude.some(page => pathname.startsWith(page));
    return (
        includeNavbar && (<Footer />)
    );
}

export default ConditionallyIncludeFooter 