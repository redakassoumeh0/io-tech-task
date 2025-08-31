// src/components/LocaleSwitcher.tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { setLocaleAction } from "@/i18n/actions";
import { Languages } from "lucide-react";

type Props = {
  className?: string;
};

export default function LocaleSwitcher({ className = "" }: Props) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  async function switchLocale() {
    const next = locale === "ar" ? "en" : "ar";
    await setLocaleAction(next, pathname);
    router.refresh();
  }

  return (
    <button
      onClick={switchLocale}
      className={[
        "inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs",
        "text-white/80 hover:text-white hover:bg-white/10",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        "transition-colors",
        className,
      ].join(" ")}
    >
      <Languages size={16} className="shrink-0" />
      <span className="rounded bg-white/10 px-1 py-0.5 text-[10px] leading-none uppercase">
        {locale}
      </span>
    </button>
  );
}
