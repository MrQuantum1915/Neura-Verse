'use client'
import Link from "next/link";

export default function ErrorPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-black via-purple-900/50 to-black h-screen text-white text-center p-6">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mb-6">
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2" fill="#ff4f5a" />
                <path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h1 className="text-4xl font-bold mb-3">Oops! Something went wrong.</h1>
            <p className="text-lg mb-6 max-w-md text-center">
                A problem arose while Authorizing you.<br />Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-4">
                <Link href="/home" className="no-underline">
                    <button
                        className="px-8 py-3 text-base bg-purple-700 text-white rounded-md font-semibold shadow-md hover:bg-purple-800 transition"
                    >
                        Go to Home
                    </button>
                </Link>
                <Link href="/login" className="no-underline">
                    <button
                        className="px-8 py-3 text-base bg-white text-purple-700 rounded-md font-semibold shadow-md hover:bg-gray-100 transition"
                    >
                        Try Again
                    </button>
                </Link>
                <Link href="/contact" className="no-underline">
                    <button
                        className="px-8 py-3 text-base bg-gray-800 text-white rounded-md font-semibold shadow-md hover:bg-gray-700 transition"
                    >
                        Contact Support
                    </button>
                </Link>
            </div>
        </div>
    );
}
