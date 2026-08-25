import { useEffect } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./animations"; // đảm bảo gsap + ScrollTrigger + ScrollSmoother đã được register

// Khởi tạo hiệu ứng cuộn mượt (scroll smoothing) cho toàn trang.
// Header (sticky) và BackToTop (fixed) được đặt NGOÀI #smooth-wrapper trong
// App.jsx nên không nằm trong phần tử bị ScrollSmoother transform — sticky/
// fixed vẫn hoạt động bình thường, không cần sửa CSS của 2 component đó.
export function useSmoothScroll() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return undefined;

    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2, // độ trễ (giây) khi cuộn bằng chuột/trackpad trên desktop
      // LƯU Ý: smoothTouch: 0 (mặc định) không chỉ tắt smoothing khi vuốt
      // bằng tay — nó còn khiến smoother.scrollTo() (dùng bởi BackToTop và
      // các link neo trong Header) bỏ qua hoàn toàn easing trên thiết bị
      // cảm ứng thật, nên bấm vào là nhảy tới đích ngay lập tức thay vì
      // trượt mượt. Set một giá trị nhỏ để bật lại easing cho scrollTo,
      // trong khi vẫn giữ cảm giác vuốt tay gần với native (0.1 = độ trễ
      // rất nhẹ, không gây "trễ tay" khi kéo).
      smoothTouch: 0.1,
    });

    return () => smoother.kill();
  }, []);
}