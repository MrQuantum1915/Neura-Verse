'use client'
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black h-screen text-white text-center p-6">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mb-8">
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="none" />
                <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="square" />
            </svg>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4">Something went wrong.</h1>
            <p className="text-lg md:text-xl text-white/70 mb-8 max-w-md text-center font-sans">
                A problem arose while Authorizing you.<br />Please try again or contact support if the problem persists.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <Link href="/home" className="no-underline">
                    <button
                        className="w-full px-8 py-4 border-2 border-white bg-black text-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black"
                    >
                        Go to Home
                    </button>
                </Link>
                <Link href="/auth/login" className="no-underline">
                    <button
                        className="w-full px-8 py-4 border-2 border-orange-500 bg-orange-500 text-white font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-black hover:text-orange-500"
                    >
                        Try Again
                    </button>
                </Link>
                <Link href="/contact" className="no-underline">
                    <button
                        className="w-full px-8 py-4 border-2 border-white/30 bg-black text-white/70 font-bold uppercase tracking-widest transition-colors duration-300 hover:border-white hover:text-white"
                    >
                        Contact Support
                    </button>
                </Link>
            </div>
        </div>
    );
}
