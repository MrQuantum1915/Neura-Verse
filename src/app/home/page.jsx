export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <h1 className="text-4xl font-bold m-10">Home</h1>
      <button className="btn m-20 border-1 border-white/30 rounded-3xl">
        <svg width="180px" height="60px" viewBox="0 0 180 60">
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
      </button>

      <div className="glow p-10 text-5xl"> Lumina </div>
    </div>
  )
}

