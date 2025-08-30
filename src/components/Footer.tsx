"use client";

import Link from "next/link";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  const t = useTranslations("footer");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const links = t.raw("links") as string[];
  const [email, setEmail] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: اربط الطلب بـ API عندك
    // reset/feedback بسيط
    setEmail("");
  }

  return (
    <footer className="bg-brand-dark text-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-12">
        {/* الشريط العلوي: فورم الاشتراك + تواصل */}
        <div
          className={`flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between`}
        >
          {/* Spacer لترك فراغ يسار/يمين إذا بدك */}
          <div className="flex-1" />

          {/* فورم الاشتراك */}
          <form
            onSubmit={onSubmit}
            className={`flex items-center gap-2 rounded border border-white/40 bg-white/5 px-1 py-1`}
            aria-label="newsletter"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-44 sm:w-60 bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-white/70 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded bg-white px-3 py-1.5 text-xs font-medium text-brand-dark hover:opacity-90 transition"
            >
              {t("subscribe")}
            </button>
          </form>

          {/* تواصل + سوشيال */}
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-white/80 text-sm">{t("contacts")}</span>
            <div
              className={`flex items-center ${
                isRTL ? "flex-row-reverse" : ""
              } gap-3`}
            >
              <Link
                href="#"
                aria-label="Twitter"
                className="text-white/80 hover:text-white transition"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="text-white/80 hover:text-white transition"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="text-white/80 hover:text-white transition"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* خط فاصل */}
        <hr className="my-6 border-white/20" />

        {/* الروابط السفلية + الحقوق */}
        <div
          className={`flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}
        >
          {/* روابط */}
          <nav className={`-mx-2 flex flex-wrap items-center gap-x-4 gap-y-2`}>
            {links.map((label, i) => (
              <Link
                key={`${label}-${i}`}
                href="#"
                className="px-2 text-sm text-white/80 hover:text-white transition"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* حقوق */}
          <div className="text-xs text-white/70">
            © {new Date().getFullYear()}. {t("rights")}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
