import Image from "next/image"
import Link from "next/link"

const dummyHistory = [
    {
        id: 1,
        title: "Chat with OmniMind",
        date: "2023-10-01",
        summary: "Discussed various topics with OmniMind, including AI capabilities and future trends."
    },
    {
        id: 2,
        title: "Coding Assistance",
        date: "2023-10-02",
        summary: "Received help with a Python script for data analysis."
    },
    {
        id: 3,
        title: "General Knowledge Q&A",
        date: "2023-10-03",
        summary: "Asked questions about history and science."
    },
]





function HistoryTab() {
    return (
        <div className="flex flex-col w-full h-full max-h-160 ml-6 ">
            <div className="flex flex-row items-center h-full opacity-50">
                <Image
                    src={"/history.svg"}
                    width={25}
                    height={25}
                    alt="History Icon"
                ></Image>
                <h1 className="text-2xl mb-4 mt-4 mx-2">History</h1>
            </div>


            {/* previous chats container */}
            <div className="mx-4 overflow-y-scroll overflow-x-hidden w-full h-2/3">
                {dummyHistory.map(items => (
                    <div key={items.id} className="opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out hover:bg-white/10 text-white rounded-2xl px-4 py-2 cursor-pointer w-fit">
                        <h2 className="text-2sm font-semibold">{items.title}</h2>
                        {/* <p className="text-sm text-gray-400">{items.date}</p>
                        <p className="mt-2">{items.summary}</p> */}
                    </div>
                ))}
            </div>
        </div >
    )
}

export default HistoryTab
