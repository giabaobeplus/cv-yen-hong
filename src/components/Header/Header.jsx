import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { Menu, X } from "lucide-react";
import { ANIM, fadeDownVars, scrollToY } from "../../lib/animations";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  const navLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Certificates", href: "#certificates" },
    { label: "Contact", href: "#contact" },
  ];

  // Header entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${ANIM.fadeDown}`, fadeDownVars);
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Prevent background scrolling when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Change background, shadow, and padding when scrolling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Measure real header height so scroll targets can subtract it
  useEffect(() => {
    const el = headerRef.current;

    if (!el) return;

    const setVar = () => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${el.offsetHeight}px`
      );
    };

    setVar();

    const observer = new ResizeObserver(setVar);
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Smooth scroll through ScrollSmoother
  // Falls back to native scroll if ScrollSmoother is not ready
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    setMenuOpen(false);

    // Logo click → scroll to top
    if (href === 0 || href === "#" || href === "") {
      scrollToY(0);
      return;
    }

    const id = typeof href === "string" ? href.replace("#", "") : "";
    const target = document.getElementById(id);

    if (!target) return;

    const headerOffset =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-h"
        ),
        10
      ) || 80;

    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerOffset;

    scrollToY(top);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 right-0 top-0 z-50 overflow-visible transition-colors duration-300 ${scrolled
          ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
          : "bg-[#FFD4D0]"
        }`}
    >
      <div
        className={`relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 transition-[padding] duration-300 sm:px-6 ${scrolled ? "py-3 md:py-3" : "py-4 md:py-5"
          }`}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, 0)}
          style={{ touchAction: "manipulation" }}
          className={`${ANIM.fadeDown} text-[24px] leading-[100%] tracking-[0.005em] sm:text-[30px]`}
        >
          <span className="font-extrabold text-[#FC3314]">Y</span>
          <span className="font-semibold text-gray-900">enHong</span>
        </a>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{ touchAction: "manipulation" }}
              className={`${ANIM.fadeDown} text-[20px] font-bold leading-[130%] text-gray-900 transition-colors hover:text-[#FC3314]`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Download CV */}
          <a
            href="/CV_Yen_Hong_Tran_Truong_Phong_DVKT_Thue.pdf"
            download
            className={`${ANIM.fadeDown} hidden rounded-[4px] bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 sm:inline-block lg:text-[18px]`}
          >
            Download CV
          </a>

          {/* Hamburger */}
          {!menuOpen && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`${ANIM.fadeDown} relative z-50 flex h-10 w-10 items-center justify-center rounded-[4px] text-gray-900 lg:hidden`}
              aria-label="Open menu"
              aria-expanded={false}
            >
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 lg:hidden ${menuOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
          }`}
      />

      {/* Mobile / Tablet slide panel */}
      <nav
        className={`fixed inset-y-0 right-0 z-40 flex w-full flex-col gap-1 bg-[#FFD4D0] px-6 pb-6 pt-6 shadow-xl transition-transform duration-300 ease-in-out sm:w-96 lg:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="mb-4 flex h-10 w-10 items-center justify-center self-end rounded-[4px] text-gray-900 transition-colors hover:bg-white/40"
          aria-label="Close menu"
          aria-expanded={menuOpen}
        >
          <X className="h-6 w-6" strokeWidth={2} />
        </button>

        {/* Mobile / Tablet navigation */}
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={{ touchAction: "manipulation" }}
            className="rounded-[4px] px-3 py-2.5 text-[18px] font-bold leading-[130%] text-gray-900 transition-colors hover:bg-white/40 hover:text-[#FC3314]"
          >
            {link.label}
          </a>
        ))}

        {/* Mobile Download CV */}
        <a
          href="/CV_Yen_Hong_Tran_Truong_Phong_DVKT_Thue.pdf"
          download
          className="mt-2 rounded-[4px] bg-gray-900 px-6 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-gray-800 sm:hidden"
        >
          Download CV
        </a>
      </nav>
    </header>
  );
}

export default Header;