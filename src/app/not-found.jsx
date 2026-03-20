'use client'
import Link from "next/link";
import Image from "next/image";

export default function Custom404() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <Image
                src="/deep_space.jpg"
                alt="Deep Space"
                fill
                priority
                className="object-cover w-full h-full absolute top-0 left-0 z-0"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/50 z-10"></div>

            <div className="relative z-20 flex flex-col gap-9 items-center justify-center min-h-screen text-white px-6 text-center">
                <h1 className="text-5xl font-bold">
                    404: Page Lost in the Cosmic Void
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-4">
                    You’ve ventured beyond the mapped dimensions of this universe.
                </p>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-4">
                    The world you’re looking for might’ve slipped through a wormhole, or perhaps never existed in this timeline.
                </p>
                <Link
                    href="/"
                    className="mt-8 px-8 py-4 border-2 border-white text-base md:text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
                >
                    Get back to realm of Neura Verse
                </Link>
                <div className="mt-12 bg-black/60 border border-white/20 border-l-4 border-l-orange-500 font-sans tracking-wide text-md px-6 py-4">
                    <span className="font-bold text-orange-500 uppercase mr-2">Pro tip:</span> Watch out for wormholes on the spacetime!
                </div>
            </div>
        </div>
    );
}
