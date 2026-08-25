import { useEffect, useState, useCallback } from "react";
import { ChevronUp } from "lucide-react";
import { scrollToY } from "../../lib/animations";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleScrollToTop = useCallback(() => {
    scrollToY(0);
  }, []);

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Về đầu trang"
      style={{ touchAction: "manipulation" }}
      className={`fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-all duration-300 hover:bg-gray-800 ${
        visible
          ? "translate-y-0 pointer-events-auto"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ChevronUp className="h-5 w-5" strokeWidth={2.5} />
    </button>
  );
}

export default BackToTop;