import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
  ANIM,
  fadeUpVars,
  scaleInVars,
} from "../../lib/animations";

function Hero() {
  const sectionRef = useRef(null);

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

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[calc(100vh-var(--header-h,80px))] items-center bg-[#FFD4D0]"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-6 md:grid-cols-2 md:gap-12 md:py-20 lg:py-24">
        {/* Right/top: photo */}
        <div className="order-1 mx-auto flex w-full max-w-[280px] justify-center sm:max-w-[340px] md:order-2 md:max-w-none">
          <img
            src="/hero-photo.jpg"
            alt="Yen Hong"
            className={`${ANIM.scaleIn} h-auto w-full max-w-[420px] object-contain`}
          />
        </div>

        {/* Left/bottom: text content */}
        <div className="order-2 text-center md:order-1 md:text-left">
          <h1
            className={`${ANIM.fadeUp} mb-6 text-[32px] font-bold leading-[150%] text-[#1F1F1F] sm:text-[40px] md:text-[48px]`}
          >
            <span className="block">👋 Hello, I’m</span>
            <span className="block text-[#FC3314]">
              Tran Thi Yen Hong
            </span>
          </h1>

          <p
            className={`${ANIM.fadeUp} mb-4 text-base font-normal leading-[150%] text-[#1F1F1F] sm:text-[20px]`}
          >
            A Bachelor of Accounting graduate from the University of
            Economics Ho Chi Minh City (UEH), with over 5 years of
            experience in accounting, taxation, and corporate financial
            management.
          </p>

          <p
            className={`${ANIM.fadeUp} mb-8 text-base font-normal leading-[150%] text-[#1F1F1F] sm:text-[20px]`}
          >
            Aspiring to advance my career as a Chief Accountant or
            Finance Manager, with a strong focus on financial control,
            operational optimization, and sustainable business growth.
          </p>

          {/* CTA buttons */}
          <div
            className={`${ANIM.fadeUp} flex flex-wrap justify-center gap-4 md:justify-start`}
          >
            <a
              href="#contact"
              className="rounded-[4px] bg-gray-900 px-6 py-3 text-[18px] font-bold leading-[150%] text-white transition-colors hover:bg-gray-800"
            >
              Hire Me
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[4px] border border-gray-900 bg-white px-6 py-3 text-[18px] font-bold leading-[150%] text-gray-900 transition-colors hover:bg-gray-100"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;