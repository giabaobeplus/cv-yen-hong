import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// class hook để target phần tử cần animate bằng gsap
export const ANIM = {
  fadeDown: "anim-fade-down",
  fadeUp: "anim-fade-up",
  scaleIn: "anim-scale-in",
};

export const fadeDownVars = {
  y: -24,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out",
  stagger: 0.08,
};

export const fadeUpVars = {
  y: 28,
  opacity: 0,
  duration: 0.7,
  ease: "power3.out",
  stagger: 0.12,
};

export const scaleInVars = {
  scale: 0.9,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
};

// Cuộn mượt tới 1 vị trí y (px tính từ đầu trang). Ưu tiên dùng ScrollSmoother
// (khởi tạo trong App.jsx qua useSmoothScroll) để đồng bộ với độ trễ/ease
// chung của toàn trang; nếu ScrollSmoother chưa sẵn sàng hoặc bị tắt (ví dụ
// prefers-reduced-motion) thì fallback về scroll native của trình duyệt.
export const scrollToY = (y) => {
  const smoother = ScrollSmoother.get();

  if (smoother) {
    smoother.scrollTo(y, true);
    return;
  }

  const supportsSmoothScroll =
    "scrollBehavior" in document.documentElement.style;

  window.scrollTo({
    top: y,
    left: 0,
    behavior: supportsSmoothScroll ? "smooth" : "auto",
  });
};