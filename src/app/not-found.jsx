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
                    className="mt-4 inline-block px-6 py-3 bg-cyan-400 hover:bg-indigo-700 transition-colors duration-300 rounded-full text-black font-semibold shadow-lg text-2xl"
                >
                    Get back to realm of Neura Verse
                </Link>
                <p className="mt-4 text-sm italic bg-indigo-600 font-bold text-md rounded-2xl px-4 py-2">
                    Pro tip: Watch out for wormholes on the spacetime!
                </p>
            </div>
        </div>
    );
}
