import Image from "next/image"
import Link from "next/link";
import { Playfair_Display } from 'next/font/google';

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
    display: 'swap',
    variable: '--font-playfair-display',
});

function TopBar({ sidebarClose }) {
    return (
        <div className="flex flex-row w-full h-auto border-b border-white/10 ">
            {
                sidebarClose && (
                    <Link href="/playgrounds/lumina">
                        <div className={`text-5xl ${playfairDisplay.className} font-bold m-6 cursor-pointer`}>
                            Lumina
                        </div>
                    </Link>
                )
            }
            <div className='flex flex-grow-0 items-center cursor-pointer rounded-2xl border border-white/10 w-fit px-2 py-1 m   m-4 font-bold hover:bg-white/5 transition-all duration-300 ease-in-out'>
                <div className="mx-2">
                    Models
                </div>
                <Image src={"/dropdown.svg"} width={40} height={40} alt="Dropdown" className="mb-1"></Image>
            </div>
        </div>
    )
}

export default TopBar
