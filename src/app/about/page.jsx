
export default function About() {
    return (
        <div className="bg-transparent flex flex-col items-center justify-center min-h-[60vh] text-white">
            {/* About Section */}
            <section id="about" className="flex flex-col gap-20 py-16 max-w-[90%] z-1 mx-auto px-6 text-center">
                <h3 className="text-9xl font mb-4">About Neura Verse</h3>
                <p className="text-5xl text-gray-300 mb-2">
                    Neura Verse is your gateway to exploring, learning, and creating with AI. 
                    <br>
                    </br>
                    Whether you’re a developer, artist, or just curious, our playgrounds are designed to inspire experimentation and regular use.
                </p>
                <p className="text-4xl text-gray-400">
                    Stay tuned—our universe is expanding with new tools and features!
                </p>
            </section>
        </div>
    )
}