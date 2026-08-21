import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import {
    FileBarChart2,
    ListChecks,
    Receipt,
    Users,
} from "lucide-react";
import { ANIM, fadeUpVars } from "../../lib/animations";
import { skillsIntro, skillsList } from "../../data/skills";

const ICONS = {
    FileBarChart2,
    ListChecks,
    Receipt,
    Users,
};

function Skills() {
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
            id="skills"
            ref={sectionRef}
            className="bg-white py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
                <h2
                    className={`${ANIM.fadeUp} mb-8 text-[28px] font-extrabold leading-[130%] text-[#1F1F1F] sm:text-[32px] md:text-[36px]`}
                >
                    Professional Skills
                </h2>

                <div className="mb-14 space-y-5 sm:mb-20">
                    {skillsIntro.map((paragraph, i) => (
                        <p
                            key={i}
                            className={`${ANIM.fadeUp} text-base leading-[150%] text-gray-600 sm:text-[18px] md:text-[20px]`}
                        >
                            {paragraph.map((seg, j) =>
                                seg.bold ? (
                                    <strong
                                        key={j}
                                        className="font-bold italic text-[#1F1F1F]"
                                    >
                                        {seg.text}
                                    </strong>
                                ) : (
                                    <span key={j}>{seg.text}</span>
                                )
                            )}
                        </p>
                    ))}
                </div>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:grid-cols-4">
                {skillsList.map((skill) => {
                    const Icon = ICONS[skill.icon];

                    return (
                        <div key={skill.title} className={ANIM.fadeUp}>
                            <Icon
                                className="mb-4 h-9 w-9 text-[#FC3314]"
                                strokeWidth={1.75}
                            />

                            <h3 className="mb-2 text-[18px] font-bold leading-[130%] text-[#1F1F1F] sm:text-[20px]">
                                {skill.title}
                            </h3>

                            <p className="text-sm leading-[150%] text-gray-500 sm:text-[16px]">
                                {skill.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Skills;