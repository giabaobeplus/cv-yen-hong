import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ANIM, fadeUpVars } from "../../lib/animations";
import { experienceIntro } from "../../data/experience";

function Experience() {
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
            ref={sectionRef}
            className="relative overflow-hidden bg-[#FFD4D0] py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
                <h2
                    className={`${ANIM.fadeUp} mb-6 text-[28px] font-extrabold leading-[130%] text-[#1F1F1F] sm:text-[32px] md:text-[36px]`}
                >
                    Work Experience
                </h2>

                <p
                    className={`${ANIM.fadeUp} text-base leading-[150%] text-gray-700 sm:text-[18px] md:text-[20px]`}
                >
                    {experienceIntro}
                </p>
            </div>
        </section>
    );
}

export default Experience;