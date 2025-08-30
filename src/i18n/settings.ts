// src/i18n/settings.ts
export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const NAMESPACES = ["navbar", "home", "footer"] as const;
export type AppNamespace = (typeof NAMESPACES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";
