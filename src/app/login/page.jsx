import Image from "next/image"
import { Playfair_Display } from 'next/font/google';


const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
});
const oAuthProviders = [
  { Name: "Google", Icon: "/Google_Favicon_2025.svg" },
  { Name: "Github", Icon: "/github-mark-white.svg" },
  { Name: "Microsoft", Icon: "/microsoft.svg" },
  { Name: "Discord", Icon: "/Discord-Symbol-Blurple.svg" },

]

function page() {
  return (
    <div className={`bg-black flex items-center justify-center w-full h-screen relative ${playfairDisplay.className}`}>

      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div
          className="w-110 h-170 rounded-3xl opacity-70 blur-3xl"
          style={{
            background: "linear-gradient(45deg, #00fff7 0%, #5500ff 100%)",
          }}></div>
      </div>

      <div className="z-50 bg-black/50 rounded-2xl p-4 shadow-md shadow-white w-fit max-w-120 h-fit flex flex-col items-center">
        <h1 className="text-4xl my-2 mb-4 font-bold">Welcome Back</h1>

        <div className="flex flex-col gap-4 w-full items-center justify-center">
          <div className="m-2 text-white/50 text-2xl">
            OAuth
          </div>
          <div className="flex flex-row flex-wrap gap-4 items-center justify-center">
            {
              oAuthProviders.map((item) => {
                return (
                  <button key={item.Name} className="w-42 h-15 rounded-2xl border border-white/50 flex flex-row flex-wrap items-center justify-start cursor-pointer  hover:bg-white/20 focus:bg-white/20 transition-all duration-300 ease-in-out ">
                    <Image
                      src={item.Icon}
                      width={50}
                      height={50}
                      alt={item.Name}
                      className="p-2"
                    />
                    <div className="text-white/75 text-xl px-2"> {item.Name}</div>
                  </button>)
              })
            }
          </div>
        </div>

        <div className="flex items-center text-center w-80  my-6 ">
          <div className="flex-grow h-px bg-white/50"></div>
          <span className="mx-2 font-bold text-white/50">OR</span>
          <div className="flex-grow h-px bg-white/50"></div>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md items-center justify-center">
          <div className="text-white/50 text-2xl m-2">
            Email
          </div>
          <div className="rounded-2xl p-2 border border-white/50 flex flex-row hover:bg-black/50 transition-all duration-300 ease-in-out">
            <Image
              src={"/email-1-svgrepo-com.svg"}
              width={30}
              height={30}
              alt="Email"
              className="opacity-50"
            />
            <input type="email" placeholder="Email" className="rounded-2xl px-4 py-2 text-xl outline-none min-w-3/4" />
          </div>
          <div className="rounded-2xl p-2 border border-white/50 flex flex-row hover:bg-white/10 transition-all duration-300 ease-in-out">
            <Image
              src={"/lock-alt-svgrepo-com.svg"}
              width={30}
              height={30}
              alt="Email"
              className="opacity-50"
            />
            <input type="password" placeholder="Password" className="rounded-2xl px-4 py-2 text-xl outline-none min-w-3/4" />
          </div>
          <button className="px-4 py-2 bg-white text-black rounded-2xl m-4 text-2xl cursor-pointer  transition-all duration-300 ease-in-out">
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default page
