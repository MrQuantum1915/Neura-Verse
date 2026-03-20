import Link from "next/link";
import { Michroma } from 'next/font/google';
import Image from "next/image";
import LuminaDAGPanel from "@/components/LuminaDAGPanel";

const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-michroma',
})

export default async function Home() {

  return (
    <div className={`flex flex-col text-white font-sans min-h-screen relative overflow-hidden ${michroma.className}`}>

      <div
        className="absolute pointer-events-none z-0"
        style={{
          top: '-450px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1400px',
          height: '800px',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.2) 25%, rgba(200, 200, 200, 0.08) 55%, transparent 75%)',
        }}
      ></div>

      <section className="flex flex-col items-center justify-center text-center relative z-10 mt-20 md:mt-32 px-4 w-full max-w-[1200px] mx-auto">
        <div
          className="w-full flex justify-center"
          style={{
            marginTop: '2rem',
            // mask for simulating illumination on logo
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.4) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0.4) 100%)'
          }}
        >
          <Image
            src={"/logo.svg"}
            width={0}
            height={0}
            sizes="100vw"
            alt="logo"
            className="w-full max-w-[800px] h-auto mb-10 pointer-events-none brightness-150 animate-fade-in"
          />
        </div>

        <p className="text-xl md:text-2xl text-white/60 max-w-2xl mt-4 font-light tracking-widest uppercase">
          The Nexus of Artificial Intelligence
        </p>
      </section>


      <section className="flex flex-col gap-16 md:gap-24 w-full max-w-[1200px] mx-auto px-4 py-20 relative z-10 mt-10">


        <div className="flex flex-col md:flex-row gap-8 items-stretch border border-white/20 bg-black/80 p-6 md:p-12 hover:border-white/50 transition-colors duration-500">
          <div className="flex-1 flex flex-col justify-center text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 md:mb-6">Lumina</h2>
            <p className="text-base md:text-lg text-white/70 mb-4 leading-relaxed font-sans">
              A production-grade, multimodal LLM chat architecture, with code execution capabilities, grounding with citations, and many more features. Engage with several unified AI providers in an ultra-sleek UI offering robust persistent history and total public/private control.
              <br/> 
              <br/> 
              No... its not just another linear chat interface!
              <br />
              <br/>
              <span className="text-orange-500">Meet NEURA FLOW!</span>
            </p>

            <h3 className="text-lg md:text-xl font-bold uppercase tracking-widest text-orange-500 mb-2">Neura Flow</h3>
            <p className="text-base md:text-lg text-white/60 font-sans">
              A revolutionary version-controlled engine within Lumina. Refactor linear chats into a Directed Acyclic Graph (DAG) with Git-like branching. Perfectly isolate context for non-linear reasoning and "deep-think" research tasks using intuitive canvas flow management.
            </p>

            <Link href="/playgrounds/lumina" className="mt-8 md:mt-10 self-center md:self-start">
              <div className="px-6 py-3 md:px-8 md:py-4 border-2 border-white text-base md:text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer">
                Enter Lumina
              </div>
            </Link>
          </div>
          <div className="hidden md:flex flex-1">
            <LuminaDAGPanel />
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-8 items-stretch border border-white/20 bg-black/80 p-6 md:p-12 hover:border-white/50 transition-colors duration-500">
          <div className="flex-1 flex flex-col justify-center items-center md:items-end text-center md:text-right">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-[0.2em] mb-4 md:mb-6">NeuraGlyph</h2>
            <p className="text-base md:text-lg text-white/70 mb-6 md:mb-8 leading-relaxed font-sans max-w-xl">
              An interactive playground hosting custom-trained digit recognition models. Explore the intricacies of machine learning vision systems and test their accuracy in real-time.
            </p>
            <Link href="/playgrounds/neura-glyph" className="mt-4 self-center md:self-end">
              <div className="px-6 py-3 md:px-8 md:py-4 border-2 border-white text-base md:text-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer">
                Launch
              </div>
            </Link>
          </div>
          <div className="hidden md:flex flex-1 border border-white/10 bg-white/5 items-center justify-center">
            <Image
              src={"/playgroundsImages/neura-glyph.png"}
              width={0}
              height={0}
              sizes="100vw"
              alt="NeuraGlyph Preview"
              className="w-full h-auto object-contain rounded-lg filter brightness-110"
            />
          </div>
        </div>

      </section>

      <div className="w-full flex items-center justify-center mb-24 mt-10 px-4">
        <Link href="/playgrounds" className="w-full md:w-auto">
          <div className="px-6 py-4 md:px-12 md:py-6 border-2 border-white/30 text-lg md:text-2xl text-center font-black uppercase tracking-[0.15em] md:tracking-[0.3em] hover:bg-white hover:border-white hover:text-black transition-colors duration-300 cursor-pointer">
            Explore All Modules
          </div>
        </Link>
      </div>
    </div>
  );
}
