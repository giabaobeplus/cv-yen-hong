import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../../lib/animations"; // đảm bảo ScrollTrigger đã register

function Counter({ value, suffix = "", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const counter = { val: 0 };

    const tween = gsap.to(counter, {
      val: value,
      duration: 1.6,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => {
        el.textContent = Math.floor(counter.val) + suffix;
      },
    });

    return () => tween.scrollTrigger?.kill();
  }, [value, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

export default Counter;