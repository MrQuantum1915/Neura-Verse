import Link from "next/link";
import { Share_Tech_Mono } from 'next/font/google';
const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-share-tech-mono',
});

export default async function Home() {


  return (
    <div className={`min-h-screen flex flex-col  text-white font-sans ${shareTechMono.className}`}>
      {/* Fixed Gradient Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-black via-purple-900/50 to-black h-screen"></div>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden mt-20">
        {/* Layered/3D Background Accent */}
        {/* <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-700/20 via-blue-500/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        </div> */}
        <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold tracking-tight leading-tight mb-4 animate-fade-in z-0">
          Welcome to <span className="text-cyan-400">NEURA VERSE</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8 animate-fade-in delay-100">
          A universe of AI playgrounds for creators, thinkers, and the curious.<br />
          Dive in to experiment, build, and play—<span className="text-cyan-300 font-semibold">new features arriving soon.</span>
        </p>

      </section>

      {/* Features / Playgrounds */}
      <section id="playgrounds" className="py-20 px-4 z-1">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">AI Playgrounds</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="rounded-2xl bg-gray-900/80 p-8 shadow-xl hover:shadow-cyan-400/40  transition group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition"></div>
            <h3 className="text-2xl font-semibold mb-2">Lumina</h3>
            <p className="text-gray-400">Generate stories, brainstorm, or automate writing with advanced AI models.</p>
          </div>
          <div className="rounded-2xl bg-gray-900/80 p-8 shadow-xl hover:shadow-cyan-400/40  transition group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition"></div>
            <h3 className="text-2xl font-semibold mb-2">Stellara Vision</h3>
            <p className="text-gray-400">Create stunning visuals and experiment with generative art tools.</p>
          </div>
          <div className="rounded-2xl bg-gray-900/80 p-8 shadow-xl hover:shadow-cyan-400/40  transition group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition"></div>
            <h3 className="text-2xl font-semibold mb-2">Code Forge</h3>
            <p className="text-gray-400">Get code suggestions, debug, and build with AI-powered coding assistants.</p>
          </div>
        </div>
        <p className="text-center text-3xl font-bold mt-10">More playgrounds and features coming soon!</p>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 max-w-3xl z-1 mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-4">About Neura Verse</h3>
        <p className="text-lg text-gray-300 mb-2">
          Neura Verse is your gateway to exploring, learning, and creating with AI. Whether you’re a developer, artist, or just curious, our playgrounds are designed to inspire experimentation and regular use.
        </p>
        <p className="text-lg text-gray-400">
          Stay tuned—our universe is expanding with new tools and features!
        </p>
      </section>

      {/* Call to Action */}
      <section className="flex flex-col items-center py-12 z-1">
        <h4 className="text-2xl font-bold mb-4">Ready to explore?</h4>
        <Link
          href="/playgrounds"
          className="px-6 py-3 bg-purple-700 rounded-lg text-xl font-semibold hover:bg-purple-800 transition"
        >
          Launch
        </Link>
      </section>
    </div>
  );
}
