import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ANIM, fadeUpVars } from "../../lib/animations";
import { trustedByIntro, partnersList } from "../../data/partners";

function PartnerLogo({ image, name }) {
    const [failed, setFailed] = useState(false);

    return (
        <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl border border-gray-100 bg-[#FAFAFA] p-3 sm:h-28 sm:w-52 sm:p-4 lg:h-32 lg:w-60 lg:p-5">
            {failed ? (
                <span className="text-sm font-bold uppercase tracking-wide text-[#1F1F1F]/30 sm:text-base">
                    {name}
                </span>
            ) : (
                <img
                    src={image}
                    alt={name}
                    onError={() => setFailed(true)}
                    className="max-h-full max-w-full object-contain"
                    draggable={false}
                />
            )}
        </div>
    );
}

function TrustedBy() {
    const sectionRef = useRef(null);
    const trackRef = useRef(null);
    const setARef = useRef(null);
    const setBRef = useRef(null);
    const tweenRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(`.${ANIM.fadeUp}`, {
                ...fadeUpVars,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 75%",
                },
            });

            const SPEED_PX_PER_SEC = 60;

            const buildLoop = () => {
                if (!trackRef.current || !setARef.current || !setBRef.current) return;

                const distance =
                    setBRef.current.getBoundingClientRect().left -
                    setARef.current.getBoundingClientRect().left;

                if (!distance) return;

                tweenRef.current?.kill();
                gsap.set(trackRef.current, { x: 0 });

                tweenRef.current = gsap.to(trackRef.current, {
                    x: -distance,
                    duration: distance / SPEED_PX_PER_SEC,
                    ease: "none",
                    repeat: -1,
                });
            };

            buildLoop();

            // Kích thước card cố định (không phụ thuộc ảnh gốc) nên load ảnh
            // không làm lệch layout, chỉ cần đo lại khi viewport đổi breakpoint
            // (đổi CHIỀU RỘNG thật sự, ví dụ xoay ngang/dọc hoặc resize cửa sổ
            // trên desktop).
            //
            // BUG đã fix: trên mobile thật, mỗi lần scroll thì thanh địa chỉ
            // của trình duyệt tự ẩn/hiện, khiến chiều CAO viewport thay đổi
            // và bắn ra sự kiện "resize" — dù chiều rộng không đổi. Trước đây
            // handleResize gọi buildLoop() vô điều kiện mỗi lần "resize" nên
            // cứ scroll là animation bị kill + gsap.set(x: 0) reset về đầu,
            // gây cảm giác "chạy lại từ đầu" liên tục. Giờ chỉ rebuild khi
            // chiều RỘNG thật sự thay đổi, bỏ qua các resize chỉ đổi chiều cao.
            let previousWidth = window.innerWidth;
            const handleResize = () => {
                const currentWidth = window.innerWidth;
                if (currentWidth === previousWidth) return;
                previousWidth = currentWidth;
                buildLoop();
            };
            window.addEventListener("resize", handleResize);

            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Trên thiết bị cảm ứng (mobile/tablet) không có khái niệm "hover" thật —
    // trình duyệt vẫn có thể bắn mouseenter khi chạm và không bắn mouseleave
    // tương ứng cho tới lần chạm tiếp theo, khiến marquee bị "kẹt" tạm dừng
    // sau khi lướt qua. Chỉ bật pause-on-hover cho thiết bị thật sự hỗ trợ
    // hover bằng con trỏ (chuột/trackpad) — trên mobile thì bỏ qua, để
    // marquee luôn chạy liên tục như bình thường.
    const supportsHover =
        typeof window !== "undefined" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const handleMouseEnter = () => {
        if (!supportsHover) return;
        tweenRef.current?.pause();
    };
    const handleMouseLeave = () => {
        if (!supportsHover) return;
        tweenRef.current?.play();
    };

    return (
        <section
            id="trusted-by"
            ref={sectionRef}
            className="relative overflow-hidden bg-white py-16 sm:py-20 lg:py-24"
        >
            <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
                <h2
                    className={`${ANIM.fadeUp} mb-4 text-[28px] font-extrabold leading-[130%] text-[#1F1F1F] sm:text-[32px] md:text-[36px]`}
                >
                    {trustedByIntro.heading}
                </h2>

                <p
                    className={`${ANIM.fadeUp} mb-12 text-base leading-[150%] text-gray-500 sm:mb-16 sm:text-[18px] md:text-[20px]`}
                >
                    {trustedByIntro.description}
                </p>
            </div>

            <div
                className={`${ANIM.fadeUp} trusted-marquee relative`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28 lg:w-40" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28 lg:w-40" />

                <div
                    ref={trackRef}
                    className="flex w-max items-center gap-5 sm:gap-6 lg:gap-8"
                >
                    <div
                        ref={setARef}
                        className="flex items-center gap-5 sm:gap-6 lg:gap-8"
                    >
                        {partnersList.map((partner) => (
                            <PartnerLogo
                                key={`a-${partner.id}`}
                                image={partner.image}
                                name={partner.name}
                            />
                        ))}
                    </div>
                    <div
                        ref={setBRef}
                        className="flex items-center gap-5 sm:gap-6 lg:gap-8"
                        aria-hidden="true"
                    >
                        {partnersList.map((partner) => (
                            <PartnerLogo
                                key={`b-${partner.id}`}
                                image={partner.image}
                                name={partner.name}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TrustedBy;