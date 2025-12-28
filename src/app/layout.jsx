import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import ConditionallyIncludeNavbar from "@/components/ConditionallyIncludeNavbar";
import ConditionallyIncludeFooter from "@/components/ConditionallyIncludeFooter";
import {
  Playfair_Display,
  Roboto,
  Michroma,
  Instrument_Serif
} from 'next/font/google';
import LightPillar from "@/components/LightPillar";
import GradualBlur from "@/components/GradualBlur";

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument-serif',
});

const michroma = Michroma({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-michroma',
});

export const metadata = {
  title: "Neura-Verse",
  description: "This is website to explore the amazing digital world of AI using our Playgrounds",
  icon: "/brandlogo_white.jpg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${playfairDisplay.variable} ${instrumentSerif.variable}`}>
      <SpeedInsights />
      <body className={`min-h-screen flex flex-col ${michroma.className}`}>
        <ConditionallyIncludeNavbar />
        <main className="flex-1 flex flex-col bg-black relative">
          <div className="fixed inset-0 z-0">
            <LightPillar
              topColor="#5227FF"
              bottomColor="#FF9FFC"
              intensity={0.9}
              rotationSpeed={0.5}
              glowAmount={0.002}
              pillarWidth={3.0}
              pillarHeight={0.4}
              noiseIntensity={0.5}
              pillarRotation={45}
              interactive={true}
              mixBlendMode="normal"
            />



          </div>
          <div className="relative z-10">
            {children}
            {/* <GradualBlur
              target="page"
              position="bottom"
              height="6rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential={true}
              opacity={1}
            /> */}
          </div>
        </main>
        <ConditionallyIncludeFooter />
      </body>
    </html>
  );
}
