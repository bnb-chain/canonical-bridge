export const NON_BREAKING_SPACE = '\u00A0';
// English first, then sorted by name alphabetically.
export const SUPPORTED_LOCALES: { [key: string]: string } = {
  en: 'English',
  'id-ID': 'Bahasa Indonesia',
  'es-LA': 'Español (Latinoamérica)',
  'fr-FR': 'Français',
  'pt-BR': 'Português (Brasil)',
  'vi-VN': 'Tiếng Việt',
  'tr-TR': 'Türkçe',
  'ru-RU': 'Русский',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
} as const;

export const getTextByLocale = (locale: string) =>
  SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES.en;
