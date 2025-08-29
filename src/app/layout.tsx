// src/app/layout.tsx
import { NextIntlClientProvider } from "next-intl";
import getRequestConfig from "@/i18n/request";
import "./globals.css";
import { getLocale, getMessages } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale(); 
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
