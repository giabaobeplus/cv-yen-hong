import { useEffect, useState } from "react";
import { scrollToY } from "../../lib/animations";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  // hiện nút sau khi scroll qua khỏi header
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => scrollToY(0)}
      aria-label="Về đầu trang"
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all duration-300 hover:bg-gray-800 ${
        visible
          ? "translate-y-0 opacity-100 points-auto"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}

export default BackToTop;