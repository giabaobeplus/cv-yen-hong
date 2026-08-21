import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

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

// scroll mượt tới 1 vị trí, y có thể là số (0 = đầu trang) hoặc selector "#id"
export const scrollToY = (y) => {
  gsap.to(window, {
    duration: 1,
    scrollTo: { y, autoKill: true },
    ease: "power2.inOut",
  });
};