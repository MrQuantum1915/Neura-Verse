import Image from "next/image";
import Link from "next/link";

function Card({ Title, Description, ImageURL, Tags, pageLink }) {

    return (
        <div
            className="card"
        >
            <div className="flex flex-col items-center justify-center w-full h-full">
                <Image
                    src={ImageURL}
                    alt={Title}
                    width={400}
                    height={350}
                    className="mb-4 object-cover w-full"
                />
                <h2 className="text-3xl font-bold mb-2">{Title}</h2>
                <div className="flex flex-wrap gap-2 m-4 items-center justify-center">
                    {Tags.map((tag, index) => (
                        <span key={index} className="bg-gray-800 text-gray-100 px-3 py-1 text-sm font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-lg text-white/70 m-4 text-center">{Description}</p>
                <Link href={pageLink} target="_blank">
                    <button
                        className="cardButton"
                    >
                        Launch
                        <Image src={"/open-in-new-tab-cyan.svg"} width={20} height={20} alt="Open in New tab" className="ml-2 mb-0.5" />
                    </button>
                </Link>
            </div>
        </div >
    );
}

export default Card
