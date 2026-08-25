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
export const scrollToY = (y, animate = true) => {
  const smoother = ScrollSmoother.get();

  if (smoother) {
    smoother.scrollTo(y, animate);
    return;
  }

  const supportsSmoothScroll =
    "scrollBehavior" in document.documentElement.style;

  window.scrollTo({
    top: y,
    left: 0,
    behavior: animate && supportsSmoothScroll ? "smooth" : "auto",
  });
};

// ---------------------------------------------------------------------------
// Đổi ngôn ngữ mượt: tránh layout jump khi text VI/EN khác chiều dài
//
// 1. Lưu progress scroll hiện tại (0 → 1)
// 2. Fade out #smooth-content
// 3. changeLanguage → React re-render text mới
// 4. Đợi DOM settle + ScrollTrigger.refresh()
// 5. Khôi phục đúng progress scroll tương đối
// 6. Fade in lại
// ---------------------------------------------------------------------------
let isLanguageSwitching = false;

/**
 * @param {import("i18next").i18n} i18nInstance
 * @param {string} nextLang
 */
export async function switchLanguageSmooth(i18nInstance, nextLang) {
  if (isLanguageSwitching) return;
  if (!nextLang || i18nInstance.language === nextLang) return;

  isLanguageSwitching = true;

  const content = document.querySelector("#smooth-content");
  const smoother = ScrollSmoother.get();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Progress tương đối (0–1) để sau khi chiều cao trang đổi vẫn đứng gần
  // cùng "vùng" nội dung, không bị nhảy về đầu hoặc cuối trang.
  let progress = 0;
  if (smoother) {
    progress = smoother.progress;
  } else {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  }

  try {
    if (content && !prefersReducedMotion) {
      await gsap.to(content, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.inOut",
      });
    }

    await i18nInstance.changeLanguage(nextLang);

    // Đợi React commit + browser layout (2 rAF + micro delay)
    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
    await new Promise((r) => setTimeout(r, 40));

    // Cập nhật lại toàn bộ ScrollTrigger / ScrollSmoother theo chiều cao mới
    ScrollTrigger.refresh();

    // Khôi phục vị trí scroll theo progress cũ
    if (smoother) {
      const max =
        typeof smoother.scrollMax === "number"
          ? smoother.scrollMax
          : document.documentElement.scrollHeight - window.innerHeight;
      smoother.scrollTo(Math.max(0, progress * max), false);
    } else {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({
        top: Math.max(0, progress * Math.max(max, 0)),
        left: 0,
        behavior: "auto",
      });
    }

    if (content && !prefersReducedMotion) {
      await gsap.to(content, {
        opacity: 1,
        duration: 0.22,
        ease: "power2.out",
      });
    } else if (content) {
      gsap.set(content, { opacity: 1 });
    }
  } catch (err) {
    // Đảm bảo content không bị kẹt opacity: 0 nếu có lỗi
    if (content) gsap.set(content, { opacity: 1 });
    console.error("[switchLanguageSmooth]", err);
  } finally {
    isLanguageSwitching = false;
  }
}