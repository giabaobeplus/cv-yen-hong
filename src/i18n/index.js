import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import vi from "./locales/vi.json";

// Key dùng để lưu ngôn ngữ đã chọn vào localStorage, để reload trang vẫn
// giữ đúng ngôn ngữ người dùng đã chọn trước đó.
export const LANGUAGE_STORAGE_KEY = "cv-yen-hong-lang";

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

  // Không có gì lưu trước đó: đoán theo ngôn ngữ trình duyệt, ưu tiên vi.
  const browserLang = window.navigator?.language?.toLowerCase() ?? "";
  if (browserLang.startsWith("vi")) return "vi";
  if (browserLang.startsWith("en")) return "en";

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

// Mỗi lần đổi ngôn ngữ (kể cả gọi trực tiếp i18n.changeLanguage ở nơi khác)
// đều lưu lại vào localStorage để lần sau reload vẫn giữ nguyên.
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

// Set thuộc tính lang cho <html> ngay từ đầu (trước khi React render).
if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language;
}

export default i18n;