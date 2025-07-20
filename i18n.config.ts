import { ArmenianLanguageOptions, EnglishLanguageOptions, TurkishLanguageOptions } from "./LanguageOptionsModels";

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'tr',
    messages: {
      en: EnglishLanguageOptions,
      tr: TurkishLanguageOptions,
      am: ArmenianLanguageOptions
    }
  }))