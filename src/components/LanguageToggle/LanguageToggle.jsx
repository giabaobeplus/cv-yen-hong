import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../i18n";
import { switchLanguageSmooth } from "../../lib/animations";

/**
 * Toggle chuyển đổi ngôn ngữ VI / EN dạng pill, có khối nền trượt (thumb)
 * chạy theo ngôn ngữ đang chọn. Dùng chung được ở cả header desktop lẫn
 * mobile menu (truyền className để chỉnh margin/alignment riêng).
 *
 * @param {string} className - class bổ sung
 * @param {boolean} scrolled - header đang ở trạng thái đã scroll (nền trắng)
 */
function LanguageToggle({ className = "", scrolled = false }) {
  const { i18n } = useTranslation();

  const currentLang = SUPPORTED_LANGUAGES.includes(i18n.resolvedLanguage)
    ? i18n.resolvedLanguage
    : "vi";

  const handleSelect = (lang) => {
    if (lang === currentLang) return;
    // Fade + giữ progress scroll + refresh ScrollTrigger để không bị giật
    // khi chiều dài text VI/EN khác nhau.
    switchLanguageSmooth(i18n, lang);
  };

  return (
    <div
      role="group"
      aria-label="Language switcher"
      className={`relative inline-flex h-9 w-[84px] shrink-0 items-center rounded-full p-1 shadow-inner transition-colors duration-300 ${
        scrolled
          ? "bg-gray-100"
          : "bg-white/70"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1 h-7 w-10 rounded-full bg-gray-900 shadow-sm transition-transform duration-300 ease-out ${
          currentLang === "en" ? "translate-x-[38px]" : "translate-x-0"
        }`}
      />

      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = currentLang === lang;

        return (
          <button
            key={lang}
            type="button"
            onClick={() => handleSelect(lang)}
            aria-pressed={isActive}
            style={{ touchAction: "manipulation" }}
            className={`relative z-10 flex h-7 w-10 items-center justify-center rounded-full text-[12px] font-bold uppercase leading-none transition-colors duration-300 ${
              isActive
                ? "text-white"
                : "text-gray-700 hover:text-[#FC3314]"
            }`}
          >
            {lang}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageToggle;