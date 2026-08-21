import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANIM, fadeUpVars } from "../../lib/animations";
import { journeyIntro, journeyList } from "../../data/journey";

gsap.registerPlugin(ScrollTrigger);

// Percentage coordinates (0-100) shared by both the SVG path and the dot
// markers, so they always line up on resize without needing JS measurement.
const NODE_POSITIONS = [
    { x: 8, y: 78 },
    { x: 50, y: 42 },
    { x: 88, y: 10 },
];

const CURVE_PATH =
    "M -4,86 C 6,86 6,78 8,78 " +
    "C 24,78 24,42 50,42 " +
    "C 66,42 66,10 88,10 " +
    "C 96,10 100,4 104,-2";

function Journey() {
    const sectionRef = useRef(null);
    const pathRef = useRef(null);
    const dotRefs = useRef([]);
    const cardRefs = useRef([]);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Mobile / tablet vertical list still uses the shared fade-up hook
            gsap.from(`.${ANIM.fadeUp}`, {
                ...fadeUpVars,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            // Desktop zigzag: draw the connecting curve as the section scrolls.
            // strokeDasharray/dashoffset are set BEFORE paint (useLayoutEffect)
            // so the path starts fully hidden instead of flashing visible first.
            const path = pathRef.current;
            if (path) {
                const length = path.getTotalLength();
                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });

                gsap.to(path, {
                    strokeDashoffset: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 70%",
                        end: "bottom 60%",
                        scrub: 0.6,
                    },
                });
            }

            // Reveal each dot + card as the scroll position reaches it
            dotRefs.current.forEach((dot, i) => {
                const card = cardRefs.current[i];
                if (!dot || !card) return;

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: dot,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                });

                tl.fromTo(
                    dot,
                    { scale: 0, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }
                ).fromTo(
                    card,
                    { y: 32, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
                    "-=0.15"
                );
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="bg-white py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
                <div className="mb-14 max-w-2xl sm:mb-20">
                    <span
                        className={`${ANIM.fadeUp} mb-3 block text-sm font-bold uppercase tracking-wide text-[#FC3314] sm:text-[16px]`}
                    >
                        {journeyIntro.eyebrow}
                    </span>

                    <h2
                        className={`${ANIM.fadeUp} mb-4 text-[28px] font-extrabold leading-[130%] text-[#1F1F1F] sm:text-[32px] md:text-[36px]`}
                    >
                        {journeyIntro.heading}
                    </h2>

                    <p
                        className={`${ANIM.fadeUp} text-base leading-[150%] text-gray-600 sm:text-[18px]`}
                    >
                        {journeyIntro.description}
                    </p>
                </div>

                {/* ===== Desktop / large screens: zigzag layout with animated curve ===== */}
                <div className="relative hidden lg:block">
                    <svg
                        className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            ref={pathRef}
                            d={CURVE_PATH}
                            fill="none"
                            stroke="#FC3314"
                            strokeWidth={4}
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    </svg>

                    <div className="relative grid grid-cols-3 gap-10">
                        {journeyList.map((item, i) => {
                            const pos = NODE_POSITIONS[i];
                            // Alternate vertical offset so cards sit near their dot
                            const marginTop = [
                                "lg:mt-[62%]",
                                "lg:mt-[30%]",
                                "lg:mt-[2%]",
                            ][i];

                            return (
                                <div key={item.company} className={`relative ${marginTop}`}>
                                    {/* dot marker, positioned to match the path coordinate, above the text */}
                                    <span
                                        ref={(el) => (dotRefs.current[i] = el)}
                                        className="absolute z-20 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#FC3314] opacity-0 shadow"
                                        style={{
                                            left: `${pos.x}%`,
                                            top: `${pos.y}%`,
                                        }}
                                    />

                                    <div
                                        ref={(el) => (cardRefs.current[i] = el)}
                                        className="relative z-0 pt-10 opacity-0"
                                    >
                                        <span className="pointer-events-none absolute -top-4 right-0 select-none text-[100px] font-extrabold leading-none text-gray-100">
                                            {item.number}
                                        </span>

                                        <div className="relative">
                                            <h3 className="text-[18px] font-extrabold uppercase leading-[130%] text-[#1F1F1F]">
                                                {item.company}
                                            </h3>

                                            <p className="mb-4 text-sm italic leading-[150%] text-gray-500">
                                                {item.role} | {item.period}
                                            </p>

                                            <ul className="space-y-2 text-sm leading-[150%] text-gray-600">
                                                {item.bullets.map((bullet, j) => (
                                                    <li key={j} className="flex gap-2">
                                                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC3314]" />
                                                        <span>{bullet}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== Mobile / tablet: straight vertical timeline ===== */}
                <div className="relative lg:hidden">
                    <div className="absolute bottom-2 left-[7px] top-2 z-20 w-[3px] rounded-full bg-[#FC3314] sm:left-[9px]" />

                    <div className="space-y-14 sm:space-y-16">
                        {journeyList.map((item) => (
                            <div
                                key={item.company}
                                className={`${ANIM.fadeUp} relative pl-8 sm:pl-10`}
                            >
                                <span className="absolute left-0 top-1.5 z-20 h-4 w-4 rounded-full border-4 border-white bg-[#FC3314] shadow sm:h-5 sm:w-5" />

                                <span className="pointer-events-none absolute -top-2 right-0 hidden select-none text-[80px] font-extrabold leading-none text-gray-100 sm:block sm:text-[100px]">
                                    {item.number}
                                </span>

                                <div className="relative z-0">
                                    <h3 className="text-[18px] font-extrabold uppercase leading-[130%] text-[#1F1F1F] sm:text-[20px]">
                                        {item.company}
                                    </h3>

                                    <p className="mb-4 text-sm italic leading-[150%] text-gray-500 sm:text-[16px]">
                                        {item.role} | {item.period}
                                    </p>

                                    <ul className="max-w-3xl space-y-2 text-sm leading-[150%] text-gray-600 sm:text-[16px]">
                                        {item.bullets.map((bullet, j) => (
                                            <li key={j} className="flex gap-2">
                                                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC3314]" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Journey;