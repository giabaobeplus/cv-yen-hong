import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import vi from "./locales/vi.json";

// Đổi key storage sang v2 để reset cache "en" cũ trên trình duyệt
export const LANGUAGE_STORAGE_KEY = "cv-yen-hong-lang-v2";

export const SUPPORTED_LANGUAGES = ["vi", "en"];
export const DEFAULT_LANGUAGE = "vi";

function getInitialLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) return saved;
  } catch {
    // localStorage có thể bị chặn (private mode/…) — bỏ qua, dùng mặc định.
  }

  // Mặc định luôn ưu tiên tiếng Việt, không tự nhảy sang tiếng Anh theo trình duyệt
  return DEFAULT_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false, // React đã tự escape XSS rồi
  },
  react: {
    useSuspense: false,
  },
});

// Mỗi lần đổi ngôn ngữ đều lưu lại vào localStorage để giữ lựa chọn khi reload
i18n.on("languageChanged", (lng) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  } catch {
    // Bỏ qua nếu không ghi được localStorage.
  }

  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
});

// Set thuộc tính lang cho <html> ngay từ đầu (trước khi React render)
if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
}

export default i18n;