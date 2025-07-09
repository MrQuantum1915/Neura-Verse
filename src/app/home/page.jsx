import Link from "next/link";
import { Instrument_Serif, Michroma } from 'next/font/google';
import Image from "next/image";

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
});
const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-michroma',
})

export default async function Home() {


  return (
    <>
      <div className={`min-h-screen flex flex-col  text-white font-sans ${michroma.className}`}>
        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden mt-20">
          {/* Layered/3D Background Accent */}
          {/* <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-700/20 via-blue-500/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          </div> */}
          <h1 className="text-7xl font-extrabold tracking-tight leading-tight animate-fade-in z-0">
            Welcome to
          </h1>
          <Image src={"/Neura Verse Logo (Self Made)-v2.0.png"} width={1000} height={500} alt="logo"></Image>
        </section>

        {/* Call to Action */}
        <section className="flex flex-col items-center py-12 z-1">
        </section>
      </div>

      <div className="flex flex-col items-center justify-center text-white">
        <h4 className="text-2xl font mb-4">Ready to explore?</h4>
        <button className="btn border-1 border-white/30 rounded-3xl relative cursor-pointer">
          <Link href={"/playgrounds"} className="cursor-pointer">
            <svg id="buttonSvg" width="180px" height="60px" viewBox="0 0 180 60">
              <defs>
                <linearGradient id="stroke-gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ff0000" />
                  <stop offset="16%" stopColor="#ff7300" />
                  <stop offset="33%" stopColor="#fffb00" />
                  <stop offset="50%" stopColor="#48ff00" />
                  <stop offset="66%" stopColor="#00ffd5" />
                  <stop offset="83%" stopColor="#002bff" />
                  <stop offset="100%" stopColor="#7a00ff" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="176" height="56" rx="20" ry="20" fill="none" stroke="url(#stroke-gradient)" />
            </svg>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl font-semibold ">
              Launch
            </span>
          </Link>
        </button>
      </div >

      <div className="w-full flex items-center justify-center my-8">
        <div className="glow p-10 text-5xl w-fit"> Lumina </div>
      </div>
    </>
  );
}
