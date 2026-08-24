import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANIM, fadeUpVars } from "../../lib/animations";
import { journeyIntro, journeyList } from "../../data/journey";

gsap.registerPlugin(ScrollTrigger);

const JOURNEY_PATH =
    "M1350 2.50223 " +
    "C1340 2.27259 1331 19.7196 1327 85.4245 " +
    "C1320 227.511 1145 207.615 1072 136.864 " +
    "C999.06 66.1117 938.076 158.337 896.639 232.425 " +
    "C872.72 274.032 880.5 262.425 840 349.429 " +
    "C799.5 436.433 656 386.429 534 410.429 " +
    "C412 434.429 392.5 537.428 313.5 557.428 " +
    "C250.3 573.428 74.5001 497.924 26.5001 462.924";

const DOT_TARGETS = [
    { targetX: 200, windowStart: 0.6, windowEnd: 0.92 },
    { targetX: 656, windowStart: 0.35, windowEnd: 0.65 },
    { targetX: 1145, windowStart: 0.02, windowEnd: 0.28 },
];

// Same values as before — used as marginTop offset for each card AND now
// also reused to calculate how tall the wrapping container needs to be.
const CARD_TOPS = [250, 180, 50];

// Extra breathing room below the tallest card so content never touches
// the next section's padding, regardless of how long the bullet list gets.
const CONTAINER_HEIGHT_BUFFER = 64;

// Fallback height used for the very first paint (before we've measured
// anything), matches the previous hardcoded value so there's no visual
// jump on initial load.
const DEFAULT_CONTAINER_HEIGHT = 580;

function Journey() {
    const sectionRef = useRef(null);

    const pathRef = useRef(null);
    const dotRefs = useRef([]);
    const cardRefs = useRef([]);
    const contentRefs = useRef([]);
    const revealTimelines = useRef([]);
    const dotFracs = useRef([]);
    const dotStates = useRef([]);

    const desktopWrapRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(
        DEFAULT_CONTAINER_HEIGHT
    );

    // Measures the real rendered height of each card (title + role + bullets)
    // and grows the container to fit the tallest one, so content can never
    // overflow into the next section — no matter how long the copy gets.
    useLayoutEffect(() => {
        const measure = () => {
            if (window.innerWidth < 1024) return;

            let tallestBottom = 0;

            contentRefs.current.forEach((content, index) => {
                if (!content) return;

                const cardTop = CARD_TOPS[index] ?? 0;
                const bottom = cardTop + content.offsetHeight;

                if (bottom > tallestBottom) {
                    tallestBottom = bottom;
                }
            });

            if (tallestBottom > 0) {
                setContainerHeight(tallestBottom + CONTAINER_HEIGHT_BUFFER);
            }
        };

        measure();

        const resizeObserver = new ResizeObserver(measure);
        contentRefs.current.forEach((content) => {
            if (content) resizeObserver.observe(content);
        });

        window.addEventListener("resize", measure);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(`.${ANIM.fadeUp}`, {
                ...fadeUpVars,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            const path = pathRef.current;
            let pathSamples = [];

            dotRefs.current.forEach((dot, index) => {
                const card = cardRefs.current[index];
                const content = contentRefs.current[index];

                if (!dot || !card || !content) return;

                const title = content.querySelector("[data-title]");
                const role = content.querySelector("[data-role]");
                const bullets = content.querySelectorAll("[data-bullet]");

                gsap.set(dot, {
                    scale: 0,
                    opacity: 0,
                });

                gsap.set(card, {
                    opacity: 0,
                    y: 28,
                });

                const revealTl = gsap.timeline({
                    paused: true,
                });

                revealTl.to(dot, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.35,
                    ease: "back.out(2)",
                });

                revealTl.to(
                    card,
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.35,
                        ease: "power2.out",
                    },
                    "-=0.15"
                );

                revealTl.fromTo(
                    title,
                    {
                        opacity: 0,
                        x: -24,
                        clipPath: "inset(0 100% 0 0)",
                    },
                    {
                        opacity: 1,
                        x: 0,
                        clipPath: "inset(0 0% 0 0)",
                        duration: 0.45,
                        ease: "power3.out",
                    },
                    "-=0.05"
                );

                revealTl.fromTo(
                    role,
                    {
                        opacity: 0,
                        x: -20,
                        clipPath: "inset(0 100% 0 0)",
                    },
                    {
                        opacity: 1,
                        x: 0,
                        clipPath: "inset(0 0% 0 0)",
                        duration: 0.4,
                        ease: "power3.out",
                    },
                    "-=0.18"
                );

                bullets.forEach((bullet, bulletIndex) => {
                    revealTl.fromTo(
                        bullet,
                        {
                            opacity: 0,
                            x: -18,
                            clipPath: "inset(0 100% 0 0)",
                        },
                        {
                            opacity: 1,
                            x: 0,
                            clipPath: "inset(0 0% 0 0)",
                            duration: 0.35,
                            ease: "power3.out",
                        },
                        bulletIndex === 0 ? "-=0.08" : "-=0.18"
                    );
                });

                revealTimelines.current[index] = revealTl;
                dotStates.current[index] = false;
            });

            if (path) {
                const length = path.getTotalLength();

                gsap.set(path, {
                    strokeDasharray: length,
                    strokeDashoffset: length,
                });

                const SAMPLE_COUNT = 1000;

                for (let i = 0; i <= SAMPLE_COUNT; i++) {
                    const frac = i / SAMPLE_COUNT;
                    const point = path.getPointAtLength(frac * length);

                    pathSamples.push({
                        frac,
                        x: point.x,
                        y: point.y,
                    });
                }

                DOT_TARGETS.forEach((target, index) => {
                    const dot = dotRefs.current[index];
                    if (!dot) return;

                    const windowSamples = pathSamples.filter(
                        (sample) =>
                            sample.frac >= target.windowStart &&
                            sample.frac <= target.windowEnd
                    );

                    let bestPoint = windowSamples[0];
                    let bestDiff = Infinity;

                    windowSamples.forEach((sample) => {
                        const diff = Math.abs(sample.x - target.targetX);
                        if (diff < bestDiff) {
                            bestDiff = diff;
                            bestPoint = sample;
                        }
                    });

                    if (bestPoint) {
                        dot.style.left = `${(bestPoint.x / 1350) * 100}%`;
                        dot.style.top = `${(bestPoint.y / 611) * 350 - 100}px`;
                        dotFracs.current[index] = bestPoint.frac;
                    }
                });

             gsap.to(path, {
    strokeDashoffset: 0,
    ease: "none",
    scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 62%",
        end: "+=500",
        scrub: 0.5,
        onUpdate: (self) => {
            const progress = self.progress;

            dotFracs.current.forEach((frac, index) => {
                const revealTl = revealTimelines.current[index];
                if (!revealTl || frac === undefined) return;

                const shouldReveal = progress >= frac;

                if (shouldReveal && !dotStates.current[index]) {
                    dotStates.current[index] = true;
                    revealTl.play();
                } else if (
                    !shouldReveal &&
                    dotStates.current[index]
                ) {
                    dotStates.current[index] = false;
                    revealTl.reverse();
                }
            });
        },
    },
});
            }
        }, sectionRef);

        return () => {
            ctx.revert();
        };
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="bg-white py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
                <div className="mb-10 max-w-2xl sm:mb-12 lg:mb-16">
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

                <div ref={desktopWrapRef} className="relative hidden lg:block">
                    <div
                        className="relative"
                        style={{ height: `${containerHeight}px` }}
                    >
                        <svg
                            className="
                                pointer-events-none
                                absolute
                                left-0
                                top-[-100px]
                                z-20
                                h-[350px]
                                w-full
                                overflow-visible
                            "
                            viewBox="0 0 1350 611"
                            preserveAspectRatio="none"
                            fill="none"
                        >
                            <path
                                ref={pathRef}
                                d={JOURNEY_PATH}
                                fill="none"
                                stroke="#FC3314"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>

                        {journeyList.map((item, index) => (
                            <span
                                key={`dot-${item.company}`}
                                ref={(element) => {
                                    dotRefs.current[index] = element;
                                }}
                                className="
                                    absolute
                                    z-30
                                    h-5
                                    w-5
                                    -translate-x-1/2
                                    -translate-y-1/2
                                    rounded-full
                                    border-2
                                    border-white
                                    bg-[#FC3314]
                                "
                            />
                        ))}

                        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-8">
                            {journeyList.map((item, index) => {
                                const cardTop = CARD_TOPS[index];

                                return (
                                    <div
                                        key={item.company}
                                        className="w-[30%]"
                                        style={{
                                            marginTop: `${cardTop}px`,
                                        }}
                                    >
                                        <div
                                            ref={(element) => {
                                                cardRefs.current[index] =
                                                    element;
                                            }}
                                            className="relative"
                                        >
                                            <span
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    -top-4
                                                    right-0
                                                    select-none
                                                    text-[100px]
                                                    font-extrabold
                                                    leading-none
                                                    text-gray-100
                                                "
                                            >
                                                {item.number}
                                            </span>

                                            <div
                                                ref={(element) => {
                                                    contentRefs.current[index] =
                                                        element;
                                                }}
                                                className="relative"
                                            >
                                                <h3
                                                    data-title
                                                    className="
                                                        relative
                                                        text-[18px]
                                                        font-extrabold
                                                        uppercase
                                                        leading-[130%]
                                                        text-[#1F1F1F]
                                                    "
                                                >
                                                    {item.company}
                                                </h3>

                                                <p
                                                    data-role
                                                    className="
                                                        mb-4
                                                        text-sm
                                                        italic
                                                        leading-[150%]
                                                        text-gray-500
                                                    "
                                                >
                                                    {item.role} | {item.period}
                                                </p>

                                                <ul
                                                    className="
                                                        space-y-2
                                                        text-sm
                                                        leading-[150%]
                                                        text-gray-600
                                                    "
                                                >
                                                    {item.bullets.map(
                                                        (
                                                            bullet,
                                                            bulletIndex
                                                        ) => (
                                                            <li
                                                                key={
                                                                    bulletIndex
                                                                }
                                                                data-bullet
                                                                className="flex gap-2"
                                                            >
                                                                <span
                                                                    className="
                                                                        mt-[9px]
                                                                        h-1.5
                                                                        w-1.5
                                                                        shrink-0
                                                                        rounded-full
                                                                        bg-[#FC3314]
                                                                    "
                                                                />

                                                                <span>
                                                                    {bullet}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="relative lg:hidden">
                    <div
                        className="
                            absolute
                            bottom-2
                            left-[7px]
                            top-2
                            z-20
                            w-[3px]
                            rounded-full
                            bg-[#FC3314]
                            sm:left-[9px]
                        "
                    />

                    <div className="space-y-14 sm:space-y-16">
                        {journeyList.map((item) => (
                            <div
                                key={item.company}
                                className={`${ANIM.fadeUp} relative pl-8 sm:pl-10`}
                            >
                                <span
                                    className="
                                        absolute
                                        left-0
                                        top-1.5
                                        z-20
                                        h-4
                                        w-4
                                        rounded-full
                                        border
                                        border-white
                                        bg-[#FC3314]
                                        sm:h-5
                                        sm:w-5
                                    "
                                />

                                <span
                                    className="
                                        pointer-events-none
                                        absolute
                                        -top-2
                                        right-0
                                        hidden
                                        select-none
                                        text-[80px]
                                        font-extrabold
                                        leading-none
                                        text-gray-100
                                        sm:block
                                        sm:text-[100px]
                                    "
                                >
                                    {item.number}
                                </span>

                                <div className="relative z-0">
                                    <h3
                                        className="
                                            text-[18px]
                                            font-extrabold
                                            uppercase
                                            leading-[130%]
                                            text-[#1F1F1F]
                                            sm:text-[20px]
                                        "
                                    >
                                        {item.company}
                                    </h3>

                                    <p
                                        className="
                                            mb-4
                                            text-sm
                                            italic
                                            leading-[150%]
                                            text-gray-500
                                            sm:text-[16px]
                                        "
                                    >
                                        {item.role} | {item.period}
                                    </p>

                                    <ul
                                        className="
                                            max-w-3xl
                                            space-y-2
                                            text-sm
                                            leading-[150%]
                                            text-gray-600
                                            sm:text-[16px]
                                        "
                                    >
                                        {item.bullets.map(
                                            (bullet, bulletIndex) => (
                                                <li
                                                    key={bulletIndex}
                                                    className="flex gap-2"
                                                >
                                                    <span
                                                        className="
                                                            mt-[9px]
                                                            h-1.5
                                                            w-1.5
                                                            shrink-0
                                                            rounded-full
                                                            bg-[#FC3314]
                                                        "
                                                    />

                                                    <span>{bullet}</span>
                                                </li>
                                            )
                                        )}
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