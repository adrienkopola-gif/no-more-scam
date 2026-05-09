import type { Language } from "../contexts/LanguageContext";
import type { TranslationKey } from "./translations";
import { translations } from "./translations";

export function t(key: TranslationKey, language: Language): string {
  return translations[language]?.[key] ?? translations.fr[key] ?? key;
}

export type { Language, TranslationKey };
