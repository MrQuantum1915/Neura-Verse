import "@/app/globals.css";
import Link from "next/link";
import NavItem from "./NavItem";

const navItems = [
  { href: "/home", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/playgrounds", label: "Playgrounds" },
  { href: "/contact", label: "Contact" },
];

function NavBar() {
  return (
    <nav className="px-4 h-16 flex items-center top-0 sticky border-b-1 border-b-white/10 bg-transparent backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center h-full">
        <Link href="/" className={`text-white text-5xl font-bold font-italic  transition-colors duration-300`}>
          NEURA VERSE
        </Link>
        <ul className="flex flex-row h-full items-center justify-around cursor-pointer">
          {navItems.map((items) => (
            <li key={items.label} className="h-full">
              <NavItem href={items.href}>
                {/* I made this a client side to dynamically highlight the page user is on, in the navbar. to use client side hooks like usePathname we need to make it client side, it is better to make only navitem a client side instead of making whole navbar client side. Also you can only call a component from server and not a custom hook, so you need to make whole navitem cleint side.*/}
                {items.label} {/* this is the children prop that is passed to navitem) */}
              </NavItem>
            </li>
          ))}
          <li key={"SignIn"} className="ml-6 px-4 py-2 rounded-xl bg-white text-black">
            Sign In
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default NavBar;
