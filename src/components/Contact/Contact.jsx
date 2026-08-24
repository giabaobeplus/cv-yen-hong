import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { ANIM, fadeUpVars } from "../../lib/animations";

/* Brand icons — lucide-react v1 removed official brand logos */
const LinkedinIcon = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const FacebookIcon = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const socials = [
  {
    icon: FacebookIcon,
    href: "https://www.facebook.com/yenhong.tran.1",
    label: "Facebook",
  },
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/h%E1%BB%93ng-tr%E1%BA%A7n-7317a3148/",
    label: "LinkedIn",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;

function Contact() {
  const sectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    botcheck: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const next = {};

    if (!formData.name.trim()) {
      next.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      next.phone = "Please enter a valid phone number.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.botcheck) return;
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        subject: "New contact from Yen Hong portfolio",
        from_name: formData.name.trim(),
      };

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Thank you! Your message has been sent successfully.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          botcheck: "",
        });
        setErrors({});
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 16px on mobile to prevent iOS auto-zoom; keep 15px from sm up if preferred
  const inputBase =
    "w-full rounded-[4px] border-0 bg-white px-4 py-3.5 text-base text-[#1F1F1F] placeholder:text-gray-400 outline-none ring-0 transition focus:ring-2 disabled:opacity-70 sm:text-[15px]";
  const inputOk = "focus:ring-[#FC3314]/40";
  const inputErr = "ring-2 ring-red-500 focus:ring-red-500";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FFD4D0] py-16 sm:py-20 lg:py-24"
    >
      {/* Red circle — hidden on mobile */}
      <div
        className="pointer-events-none absolute -left-24 top-1/2 hidden h-64 w-64 -translate-y-1/2 rounded-full bg-[#FC3314] opacity-90 sm:block sm:-left-32 sm:h-80 sm:w-80 lg:-left-40 lg:h-96 lg:w-96"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:items-center">
        {/* Left */}
        <div className={ANIM.fadeUp}>
          <h2 className="mb-5 text-[28px] font-extrabold leading-[130%] text-[#1F1F1F] sm:text-[32px] md:text-[36px]">
            Let&apos;s Collaborate
          </h2>

          <p className="mb-8 max-w-md text-base leading-[160%] text-[#1F1F1F]/90 sm:text-[17px] md:text-[18px]">
            If you are looking for a partner in corporate accounting and
            finance, I am always ready to connect and build effective, lasting
            solutions together.
          </p>

          <ul className="mb-10 space-y-4">
            <li className="flex items-center gap-3 text-[#1F1F1F]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70">
                <Phone className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-[15px] font-medium sm:text-base">
                0703 495 205
              </span>
            </li>
            <li className="flex items-center gap-3 text-[#1F1F1F]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70">
                <Mail className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-[15px] font-medium sm:text-base">
                yenhong178@gmail.com
              </span>
            </li>
            <li className="flex items-center gap-3 text-[#1F1F1F]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/70">
                <MapPin className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="text-[15px] font-medium sm:text-base">
                Ho Chi Minh City
              </span>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1F1F1F] shadow-sm transition-all hover:bg-[#1F1F1F] hover:text-white"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={`${ANIM.fadeUp} flex flex-col gap-4`}
          noValidate
        >
          <input
            type="text"
            name="botcheck"
            value={formData.botcheck}
            onChange={handleChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "err-name" : undefined}
              className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
            />
            {errors.name && (
              <p id="err-name" className="mt-1.5 text-sm font-medium text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "err-email" : undefined}
              className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            />
            {errors.email && (
              <p id="err-email" className="mt-1.5 text-sm font-medium text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone number"
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "err-phone" : undefined}
              className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
            />
            {errors.phone && (
              <p id="err-phone" className="mt-1.5 text-sm font-medium text-red-600">
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your message"
              disabled={isSubmitting}
              className={`${inputBase} resize-none ${inputOk}`}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="relative mt-1 flex h-12 w-full cursor-pointer items-center justify-center rounded-[4px] bg-gray-900 text-[16px] font-medium text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-90 sm:h-[52px] sm:w-auto sm:min-w-[180px] sm:self-start"
          >
            {isSubmitting ? (
              <Loader2
                className="h-5 w-5 animate-spin"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;