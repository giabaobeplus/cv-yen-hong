import { useEffect } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./animations"; // đảm bảo gsap + ScrollTrigger + ScrollSmoother đã được register

// Khởi tạo hiệu ứng cuộn mượt (scroll smoothing) cho toàn trang.
// Header (sticky) và BackToTop (fixed) được đặt NGOÀI #smooth-wrapper trong
// App.jsx nên không nằm trong phần tử bị ScrollSmoother transform — sticky/
// fixed vẫn hoạt động bình thường, không cần sửa CSS của 2 component đó.
export function useSmoothScroll() {
  useEffect(() => {
    // Tôn trọng lựa chọn "giảm hiệu ứng chuyển động" của người dùng, không ép cuộn mượt
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return undefined;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2, // độ trễ (giây) khi cuộn bằng chuột/trackpad trên desktop
      // smoothTouch để mặc định (0 = tắt) — giữ nguyên cảm giác cuộn quán
      // tính gốc của trình duyệt trên mobile, đúng tinh thần comment cũ:
      // "Native smooth scroll — works reliably on real mobile devices".
    });

    return () => smoother.kill();
  }, []);
}