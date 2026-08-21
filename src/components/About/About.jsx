import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ANIM, fadeUpVars } from "../../lib/animations";
import { aboutParagraphs, aboutStats } from "../../data/about";
import Counter from "../Counter/Counter";

function About() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(`.${ANIM.fadeUp}`, {
                ...fadeUpVars,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative overflow-hidden bg-[#1F1F1F] py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
                <h2
                    className={`${ANIM.fadeUp} mb-8 text-[28px] font-extrabold leading-[130%] text-white sm:text-[32px] md:text-[36px]`}
                >
                    About Me
                </h2>

                <div className="mb-12 space-y-5 sm:mb-16">
                    {aboutParagraphs.map((paragraph, i) => (
                        <p
                            key={i}
                            className={`${ANIM.fadeUp} text-base leading-[150%] text-gray-300 sm:text-[18px] md:text-[20px]`}
                        >
                            {paragraph.map((seg, j) =>
                                seg.bold ? (
                                    <strong key={j} className="font-bold text-white">
                                        {seg.text}
                                    </strong>
                                ) : (
                                    <span key={j}>{seg.text}</span>
                                )
                            )}
                        </p>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
                    {aboutStats.map((stat) => (
                        <div key={stat.label} className={ANIM.fadeUp}>
                            <Counter
                                value={stat.value}
                                suffix={stat.suffix}
                                className="block text-[40px] font-extrabold leading-[100%] text-[#FFD4D0] sm:text-[48px] md:text-[56px]"
                            />

                            <p className="mt-2 text-sm font-bold leading-[130%] text-white sm:text-[16px]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decorative circle at the bottom */}
            <div className="pointer-events-none absolute -bottom-35 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#FC3314] sm:h-48 sm:w-48" />
        </section>
    );
}

export default About;