import { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import {
  ANIM,
  fadeUpVars,
  scaleInVars,
  scrollToY,
} from "../../lib/animations";

function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  // Hero entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(`.${ANIM.fadeUp}`, fadeUpVars).from(
        `.${ANIM.scaleIn}`,
        scaleInVars,
        "-=0.5"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll to Contact section
  // Falls back to native scroll if ScrollSmoother is not ready
  const handleHireMe = useCallback((e) => {
    e.preventDefault();

    const target = document.getElementById("contact");

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
    <section
      ref={sectionRef}
      className="flex min-h-[calc(100vh-var(--header-h,80px))] items-center bg-[#FFD4D0]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 md:grid-cols-2 md:gap-12 md:py-20 lg:py-24">
        {/* Right / Top: Photo */}
        <div className="order-1 mx-auto flex w-full max-w-[280px] justify-center sm:max-w-[340px] md:order-2 md:max-w-none">
          <img
            src="/hero-photo.jpg"
            alt="Yen Hong"
            className={`${ANIM.scaleIn} h-auto w-full max-w-[420px] object-contain`}
          />
        </div>

        {/* Left / Bottom: Text content */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <h1
            className={`${ANIM.fadeUp} mb-6 text-[32px] font-bold leading-[150%] text-[#1F1F1F] sm:text-[40px] md:text-[48px]`}
          >
            <span className="block">
              {t("hero.greeting")}
            </span>

            <span className="block text-[#FC3314]">
              {t("hero.name")}
            </span>
          </h1>

          <p
            className={`${ANIM.fadeUp} mb-8 text-base font-normal leading-[150%] text-[#1F1F1F] sm:text-[20px]`}
          >
            {t("hero.paragraph1")}
          </p>

          {/* CTA Buttons */}
          <div
            className={`${ANIM.fadeUp} flex flex-wrap justify-center gap-4 md:justify-start`}
          >
            {/* Hire Me */}
            <a
              href="#contact"
              onClick={handleHireMe}
              style={{ touchAction: "manipulation" }}
              className="rounded-[4px] bg-gray-900 px-6 py-3 text-[18px] font-bold leading-[150%] text-white transition-colors hover:bg-gray-800"
            >
              {t("hero.hireMe")}
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/h%E1%BB%93ng-tr%E1%BA%A7n-7317a3148/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[4px] border border-gray-900 bg-white px-6 py-3 text-[18px] font-bold leading-[150%] text-gray-900 transition-colors hover:bg-gray-100"
            >
              {t("hero.linkedin")}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;