import Link from "next/link";
import { Michroma } from 'next/font/google';
import Image from "next/image";

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
      <div className={`flex flex-col  text-white font-sans ${michroma.className}`}>
        <section className="flex-1 flex flex-col gap-4 items-center  text-center relative overflow-hidden mt-20">        
          <Image src={"/logo.svg"} width={600} height={400} alt="logo" className="mb-6 pointer-events-none brightness-120 z-0 animate-fade-in" />
        </section>

        <section className="flex flex-col items-center py-12 z-1">
        </section>
      </div>

      <div className="flex flex-col items-center justify-center text-white">
        <h4 className="text-2xl font mb-4">Ready to explore?</h4>
      </div >

      <div className="w-full flex items-center justify-center my-8">
        <div className="glow p-10 text-5xl w-fit"> Lumina </div>
      </div>
    </>
  );
}
