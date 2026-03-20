import Image from "next/image"
import Link from "next/link"

function Card({ Title, Description, ImageURL, Tags, pageLink }) {
    return (
        <div className="flex flex-col border-2 border-white/20 bg-black p-6 hover:border-white transition-colors duration-300 ease-in-out h-full">
            <div className="relative w-full aspect-video mb-6">
                 <Image 
                    src={ImageURL} 
                    alt={Title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="flex flex-col justify-between flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                    {Tags.map((tag, index) => (
                        <span key={index} className="border border-white/50 text-white text-xs md:text-sm font-bold px-3 py-1 uppercase tracking-wider">{tag}</span>
                    ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{Title}</h2>
                <p className="text-white/70 mb-8 text-sm md:text-base leading-relaxed font-sans">{Description}</p>
                <div className="mt-auto w-full">
                    <Link href={pageLink} className="w-full">
                        <button className="w-full flex items-center justify-center gap-2 px-6 py-4 border-2 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300">
                            Launch
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Card