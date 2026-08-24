import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { Award, X } from "lucide-react";
import { ANIM, fadeUpVars } from "../../lib/animations";
import { certificatesIntro, certificatesList } from "../../data/certificates";

import "swiper/css";
import "swiper/css/pagination";

function CertificateImage({ image, title, onClick }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-lg bg-[#F5F1E8] px-6 text-center shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <Award
                    className="h-10 w-10 text-[#1F1F1F]/25"
                    strokeWidth={1.5}
                />
                <span className="text-xs font-semibold leading-[140%] text-[#1F1F1F]/40">
                    {title}
                </span>
            </div>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className="group block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 hover:scale-[1.02]"
        >
            <img
                src={image}
                alt={title}
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
            />
        </button>
    );
}

function CertificateLightbox({ items, activeIndex, onClose }) {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (activeIndex === null) return;

        setMounted(true);
        setVisible(false);

        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(() => setVisible(true));
            return () => cancelAnimationFrame(raf2);
        });

        return () => cancelAnimationFrame(raf1);
    }, [activeIndex]);

    const handleClose = () => {
        setVisible(false);
        window.setTimeout(() => {
            setMounted(false);
            onClose();
        }, 350);
    };

    useEffect(() => {
        if (!mounted) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    if (!mounted || activeIndex === null) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 py-10 backdrop-blur-sm transition-opacity duration-350 ease-out ${
                visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
        >
            <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className={`absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-all duration-350 ease-out hover:bg-white/20 ${
                    visible
                        ? "translate-y-0 opacity-100"
                        : "-translate-y-3 opacity-0"
                }`}
            >
                <X className="h-5 w-5" />
            </button>

            <div
                className={`w-full max-w-5xl transition-all duration-350 ease-out ${
                    visible
                        ? "translate-y-0 scale-100 opacity-100"
                        : "translate-y-6 scale-90 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <Swiper
                    modules={[Pagination]}
                    initialSlide={activeIndex}
                    loop={false}
                    speed={450}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                    spaceBetween={24}
                    className="lightbox-swiper !pb-12"
                >
                    {items.map((cert) => (
                        <SwiperSlide
                            key={cert.id}
                            className="flex items-center justify-center"
                        >
                            <img
                                src={cert.image}
                                alt={cert.title}
                                className="max-h-[75vh] w-full rounded-lg object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style>{`
                .lightbox-swiper .swiper-wrapper {
                    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
                }
                .lightbox-swiper .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.4);
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                .lightbox-swiper .swiper-pagination-bullet-active {
                    width: 22px;
                    border-radius: 999px;
                    background: #FC3314;
                }
            `}</style>
        </div>
    );
}

function Certificates() {
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null);

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
            id="certificates"
            ref={sectionRef}
            className="relative overflow-hidden bg-[#1F1F1F] py-16 sm:py-20 lg:py-24"
        >
            {/* Decorative circle poking in from the top, matches the brand's accent-circle rhythm */}
            <div className="pointer-events-none absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[#FC3314] sm:-top-12 sm:h-24 sm:w-24" />

            <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
                <h2
                    className={`${ANIM.fadeUp} mb-6 text-[28px] font-extrabold leading-[130%] text-white sm:text-[32px] md:text-[36px]`}
                >
                    Certificates
                </h2>

                <div className="mb-12 space-y-5 sm:mb-16">
                    {certificatesIntro.map((paragraph, i) => (
                        <p
                            key={i}
                            className={`${ANIM.fadeUp} text-base font-normal leading-[150%] text-gray-300 sm:text-[18px] md:text-[20px]`}
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>

            <div
                className={`${ANIM.fadeUp} certs-swiper mx-auto max-w-7xl px-5 sm:px-8`}
            >
                <Swiper
                    modules={[Pagination, Autoplay]}
                    loop={false}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                    slidesPerGroup={1}
                    spaceBetween={20}
                    breakpoints={{
                        640: {
                            slidesPerView: 1.6,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 2.3,
                            spaceBetween: 32,
                        },
                        1280: {
                            slidesPerView: 3,
                            spaceBetween: 32,
                        },
                    }}
                    className="!pb-14"
                >
                    {certificatesList.map((cert, index) => (
                        <SwiperSlide key={cert.id}>
                            <CertificateImage
                                image={cert.image}
                                title={cert.title}
                                onClick={() => setActiveIndex(index)}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <CertificateLightbox
                items={certificatesList}
                activeIndex={activeIndex}
                onClose={() => setActiveIndex(null)}
            />

            {/* Scoped overrides: pill-shaped pagination, kept local to this section */}
            <style>{`
                .certs-swiper .swiper-pagination-bullet {
                    width: 22px;
                    height: 6px;
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.3);
                    opacity: 1;
                    transition: all 0.3s ease;
                }
                .certs-swiper .swiper-pagination-bullet-active {
                    width: 32px;
                    background: #FC3314;
                }
            `}</style>
        </section>
    );
}

export default Certificates;