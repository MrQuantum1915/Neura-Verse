import Image from "next/image";
import Link from "next/link";

function Card({ Title, Description, ImageURL, Tags, pageLink }) {

    return (
        <div
            className="card"
        >
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
                <div className="w-full aspect-video relative mb-4">
                    <Image
                        src={ImageURL}
                        alt={Title}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 450px"
                    />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">{Title}</h2>
                <div className="flex flex-wrap gap-2 my-2 items-center justify-center">
                    {Tags.map((tag, index) => (
                        <span key={index} className="bg-gray-800 text-gray-100 px-3 py-1 text-xs md:text-sm font-semibold rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-base md:text-lg text-white/70 my-4 text-center line-clamp-3">{Description}</p>
                <Link href={pageLink} target="_blank" className="mt-auto">
                    <button
                        className="cardButton flex items-center gap-2"
                    >
                        Launch
                        <Image src={"/open-in-new-tab-cyan.svg"} width={20} height={20} alt="Open in New tab" className="mb-0.5" />
                    </button>
                </Link>
            </div>
        </div >
    );
}

export default Card
