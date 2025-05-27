import "./globals.css";
import ConditionallyIncludeNavbar from "@/components/ConditionallyIncludeNavbar";
import ConditionallyIncludeFooter from "@/components/ConditionallyIncludeFooter";
import {
  Courier_Prime,
  Oswald,
  Playfair_Display,
  Roboto_Slab,
  Roboto,
  Share_Tech_Mono,
} from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
});

const courierPrime = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-courier-prime',
});

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-playfair-display',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-roboto-slab',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-share-tech-mono',
});

export const metadata = {
  title: "Neura-Verse",
  description: "This is website to explore the amazing digital world of AI using our Playgrounds",
  icon: "/brandlogo_white.jpg",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${roboto.variable} ${courierPrime.variable} ${oswald.variable} ${playfairDisplay.variable} ${robotoSlab.variable} ${shareTechMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ConditionallyIncludeNavbar />
        <main className="flex-1 flex flex-col  bg-black">
          {children}
        </main>
        <ConditionallyIncludeFooter />
      </body>
    </html>
  );
}
