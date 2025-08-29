// src/i18n/request.ts
import { getRequestConfig } from "next-intl/server";
import { cookies as nextCookies, headers as nextHeaders } from "next/headers";
import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  NAMESPACES,
  LOCALE_COOKIE,
  type AppLocale,
} from "./settings";

async function resolveLocale(): Promise<AppLocale> {
  const cookieStore = await nextCookies();
  const cookieLng = cookieStore.get(LOCALE_COOKIE)?.value as
    | AppLocale
    | undefined;
  if (cookieLng && SUPPORTED_LOCALES.includes(cookieLng)) return cookieLng;

  const hdrs = await nextHeaders();
  const accept = (hdrs.get("accept-language") || "").toLowerCase();
  const fromHeader = SUPPORTED_LOCALES.find((l) => accept.includes(l));
  return (fromHeader ?? DEFAULT_LOCALE) as AppLocale;
}

async function loadMessages(locale: AppLocale) {
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      const mod = await import(`../../locales/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    })
  );
  return Object.fromEntries(entries);
}

export default getRequestConfig(async () => {
  const locale = await resolveLocale();
  const messages = await loadMessages(locale);
  return { locale, messages };
});
