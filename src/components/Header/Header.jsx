import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ANIM, fadeDownVars, scrollToY } from "../../lib/animations";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);

  const navLinks = [
    { label: "Giới thiệu", href: "#gioi-thieu" },
    { label: "Kỹ năng", href: "#ky-nang" },
    { label: "Kinh nghiệm", href: "#kinh-nghiem" },
    { label: "Chứng chỉ", href: "#chung-chi" },
    { label: "Liên hệ", href: "#lien-he" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${ANIM.fadeDown}`, fadeDownVars);
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // Chặn scroll nền khi mở menu mobile/tablet
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    scrollToY(href);
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 overflow-visible bg-[#FFD4D0] lg:static"
    >
      {/* Khối nửa hình tròn, chỉ hiện từ desktop (lg) trở lên */}
      <div className="pointer-events-none absolute -top-25 left-1/2 hidden h-32 w-32 -translate-x-1/2 rounded-full bg-[#FC3314] lg:block" />

      <div className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6 md:py-5">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, 0)}
          className={`${ANIM.fadeDown} text-[24px] leading-[100%] tracking-[0.005em] sm:text-[30px]`}
        >
          <span className="font-extrabold text-[#FC3314]">Y</span>
          <span className="font-semibold text-gray-900">enHong</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`${ANIM.fadeDown} text-[20px] font-bold leading-[130%] text-gray-900 transition-colors hover:text-[#FC3314]`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Desktop Download CV */}
          <a
            href="/cv.pdf"
            download
            className={`${ANIM.fadeDown} hidden rounded-[4px] bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 sm:inline-block lg:text-[18px]`}
          >
            Download CV
          </a>

          {/* Hamburger, ẩn khi panel đang mở và ẩn trên desktop */}
          {!menuOpen && (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`${ANIM.fadeDown} relative z-50 flex h-10 w-10 items-center justify-center rounded-[4px] text-gray-900 lg:hidden`}
              aria-label="Mở menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide panel */}
      <nav
        className={`fixed inset-y-0 right-0 z-40 flex w-full flex-col gap-1 bg-[#FFD4D0] px-6 pb-6 pt-6 shadow-xl transition-transform duration-300 ease-in-out sm:w-96 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Nút đóng panel */}
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          className="mb-4 flex h-10 w-10 items-center justify-center self-end rounded-[4px] text-gray-900"
          aria-label="Đóng menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            className="rounded-[4px] px-3 py-2.5 text-[18px] font-bold leading-[130%] text-gray-900 transition-colors hover:bg-white/40 hover:text-[#FC3314]"
          >
            {link.label}
          </a>
        ))}

        {/* Mobile/tablet Download CV */}
        <a
          href="/cv.pdf"
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