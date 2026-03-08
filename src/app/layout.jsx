import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import SmoothScrolling from "@/components/SmoothScrolling";
import ConditionallyIncludeNavbar from "@/components/ConditionallyIncludeNavbar";
import ConditionallyIncludeFooter from "@/components/ConditionallyIncludeFooter";
import {
  Playfair_Display,
  Roboto,
  Michroma,
  Instrument_Serif
} from 'next/font/google';
import Galaxy from "@/components/Galaxy";

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
        <SmoothScrolling>
          <ConditionallyIncludeNavbar />
        <main className="flex-1 flex flex-col bg-black relative">
          <div className="fixed inset-0 z-0">
            <Galaxy
              mouseRepulsion={true}
              mouseInteraction={true}
              density={0.3}
              glowIntensity={0.7}
              saturation={2}
              hueShift={500}
            />
          </div>
          <div className="relative z-10">
            {children}
            <Analytics />
          </div>
        </main>
          <ConditionallyIncludeFooter />
        </SmoothScrolling>
      </body>
    </html>
  );
}
