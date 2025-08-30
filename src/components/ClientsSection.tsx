"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type ClientSlide = {
  photo: string;
  quote: string;
  name: string;
  role?: string;
};

const ClientsSection = () => {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const title = t("clients.title");
  const subtitle = t("clients.subtitle");
  const slides = t.raw("clients.slides") as ClientSlide[];

  const [index, setIndex] = useState(0);
  const canPrev = index > 0;
  const canNext = index < slides.length - 1;

  const next = () => canNext && setIndex((i) => i + 1);
  const prev = () => canPrev && setIndex((i) => i - 1);

  // سحب بالموبايل + قلب الاتجاه في RTL
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let startX = 0,
      delta = 0;
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      delta = 0;
    };
    const onMove = (e: TouchEvent) => {
      delta = e.touches[0].clientX - startX;
    };
    const onEnd = () => {
      if (Math.abs(delta) > 50) {
        if (isRTL) delta > 0 ? next() : prev();
        else delta < 0 ? next() : prev();
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [isRTL, canNext, canPrev]);

  // أنيميشن خفيف على التبديل
  const animKey = useMemo(() => `slide-${index}`, [index]);

  return (
    <section className="bg-brand-dark text-white" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>
          <p className="mt-3 text-sm md:text-base text-white/80">{subtitle}</p>
        </div>

        {/* Content */}
        <div
          ref={wrapRef}
          className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center"
        >
          {/* صورة العميل */}
          <div className="relative w-full aspect-[4/3] md:aspect-[4/3] bg-brand-medium rounded">
            <Image
              key={animKey + "-img"}
              src={slides[index].photo}
              alt={slides[index].name}
              fill
              className="object-cover rounded animate-[fadeIn_.5s_ease-out]"
            />
          </div>

          {/* النص */}
          <div
            key={animKey + "-text"}
            className="animate-[fadeIn_.5s_ease-out]"
          >
            <blockquote className="text-white/90 leading-relaxed">
              “{slides[index].quote}”
            </blockquote>

            <div className="mt-6">
              <div className="font-semibold">{slides[index].name}</div>
              {slides[index].role && (
                <div className="text-white/70 text-sm">
                  {slides[index].role}
                </div>
              )}
            </div>

            {/* أزرار */}
            <div
              className={`mt-8 flex items-center gap-3 ${
                isRTL ? "flex-row-reverse" : ""
              }`}
            >
              <button
                onClick={isRTL ? next : prev}
                disabled={isRTL ? !canNext : !canPrev}
                aria-label="Previous"
                className={`h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 transition inline-flex items-center justify-center ${
                  (isRTL ? !canNext : !canPrev)
                    ? "opacity-40 pointer-events-none"
                    : ""
                }`}
              >
                <ChevronLeft className="text-white" />
              </button>
              <button
                onClick={isRTL ? prev : next}
                disabled={isRTL ? !canPrev : !canNext}
                aria-label="Next"
                className={`h-10 w-10 rounded-full bg-white text-brand-dark hover:opacity-90 transition inline-flex items-center justify-center ${
                  (isRTL ? !canPrev : !canNext)
                    ? "opacity-60 pointer-events-none"
                    : ""
                }`}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
