"use client";

const HamburgerButton = ({ isOpen, onClick }) => {
  return (
    <button
      className="flex flex-col justify-center items-center w-12 h-12 z-[60] focus:outline-none md:hidden gap-1.5 group"
      onClick={onClick}
      aria-label="Toggle menu"
    >
      <span
        className={`bg-white h-0.5 w-8 rounded-full transition-all duration-300 ease-in-out transform origin-center ${
          isOpen ? "translate-y-[8px] rotate-45" : ""
        }`}
      />
      <span
        className={`bg-white h-0.5 w-8 rounded-full transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-0 translate-x-4" : "opacity-100"
        }`}
      />
      <span
        className={`bg-white h-0.5 w-8 rounded-full transition-all duration-300 ease-in-out transform origin-center ${
          isOpen ? "-translate-y-[8px] -rotate-45" : ""
        }`}
      />
    </button>
  );
};

export default HamburgerButton;
