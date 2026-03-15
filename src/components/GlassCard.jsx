import Image from "next/image"
import Link from "next/link"
import GlassLaunchButton from "./GlassLaunchButton"


function GlassCard({ Title, Description, ImageURL, Tags, pageLink }) {
    return (
        <div className="flex flex-col border-2 border-white/50 border-opacity-60 bg-transparent backdrop-blur-lg p-3 hover:scale-[1.02] transition-transform duration-300 ease-in-out rounded-lg h-full">
            <div className="relative w-full aspect-video mb-4">
                 <Image 
                    src={ImageURL} 
                    alt={Title}
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="p-2 flex flex-col justify-between flex-grow">
                <div className="flex flex-wrap gap-2 mb-2">
                    {Tags.map((tag, index) => (
                        <span key={index} className="bg-black/50 text-white rounded-sm text-sm font-bold px-3 py-0.5 ">{tag}</span>
                    ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">{Title}</h2>
                <p className="text-blue-100/70 mb-4 text-sm md:text-base">{Description}</p>
                <div className="mt-auto flex justify-center">
                    <GlassLaunchButton text="Launch" link={pageLink} />
                </div>
            </div>
        </div>
    )
}

export default GlassCard