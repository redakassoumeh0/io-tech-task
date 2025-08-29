// src/i18n/actions.ts
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  type AppLocale,
} from "./settings";

export async function setLocaleAction(locale: string, path: string) {
  const next = (
    SUPPORTED_LOCALES.includes(locale as AppLocale) ? locale : DEFAULT_LOCALE
  ) as AppLocale;

  const c = await cookies();
  c.set(LOCALE_COOKIE, next, { path: "/", maxAge: 60 * 60 * 24 * 365 });

  revalidatePath(path);
}
