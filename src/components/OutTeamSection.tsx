"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

type Member = {
  name: string;
  position: string;
  photo: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
};

const OutTeamSection = () => {
  const t = useTranslations("home");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const title = t("team.title");
  const description = t("team.description");
  const members = t.raw("team.members") as Member[];

  const [index, setIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const trackRef = useRef<HTMLDivElement>(null);

  // responsive per view
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 640) setItemsPerView(1);
      else if (w < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  // clamp index
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, members.length - itemsPerView)));
  }, [itemsPerView, members.length]);

  const canPrev = index > 0;
  const canNext = index < members.length - itemsPerView;

  const next = () => canNext && setIndex((i) => i + 1);
  const prev = () => canPrev && setIndex((i) => i - 1);

  // swipe (mobile) — نحسّن الإحساس في RTL (نقلب الاتجاه)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let startX = 0;
    let delta = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      delta = 0;
    };
    const onMove = (e: TouchEvent) => {
      delta = e.touches[0].clientX - startX;
    };
    const onEnd = () => {
      if (Math.abs(delta) > 50) {
        if (isRTL) {
          // في RTL: سحب لليمين يعني "التالي" بصريًا
          delta > 0 ? next() : prev();
        } else {
          delta < 0 ? next() : prev();
        }
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
  }, [canNext, canPrev, isRTL]);

  // width + transform
  const itemBasis = useMemo(() => {
    if (itemsPerView === 1) return "100%";
    if (itemsPerView === 2) return "50%";
    return "33.3333%";
  }, [itemsPerView]);

  const translatePercent = (index * 100) / itemsPerView;
  const transform = isRTL
    ? `translateX(${translatePercent}%)` // RTL: نمشي بالعكس
    : `translateX(-${translatePercent}%)`;

  return (
    <section className="bg-brand-lighter/40" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-brand-dark">
            {title}
          </h2>
          <p className="mt-3 text-sm md:text-base text-foreground/70">
            {description}
          </p>
        </div>

        {/* Slider */}
        <div className="relative mt-8 md:mt-10">
          {/* Prev / Next – نعكس أماكن الأزرار في RTL */}
          <button
            onClick={isRTL ? next : prev}
            disabled={isRTL ? !canNext : !canPrev}
            aria-label="Previous"
            className={`z-10 absolute ${
              isRTL ? "right-0" : "left-0"
            } top-1/2 -translate-y-1/2 rounded-full p-2 ring-1 ring-black/10 bg-white/80 text-black hover:bg-white transition hidden sm:inline-flex ${
              (isRTL ? !canNext : !canPrev)
                ? "opacity-40 pointer-events-none"
                : ""
            }`}
          >
            <ChevronLeft />
          </button>

          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex transition-transform duration-300"
              style={{ transform }}
            >
              {members.map((m, idx) => (
                <div
                  key={`${m.name}-${idx}`}
                  className="px-3 sm:px-4"
                  style={{ flex: `0 0 ${itemBasis}` }}
                >
                  <TeamCard member={m} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={isRTL ? prev : next}
            disabled={isRTL ? !canPrev : !canNext}
            aria-label="Next"
            className={`z-10 absolute ${
              isRTL ? "left-0" : "right-0"
            } top-1/2 -translate-y-1/2 rounded-full p-2 ring-1 ring-black/10 bg-white/80 text-black hover:bg-white transition hidden sm:inline-flex ${
              (isRTL ? !canPrev : !canNext)
                ? "opacity-40 pointer-events-none"
                : ""
            }`}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default OutTeamSection;

/* ============== Card ============== */
function TeamCard({ member }: { member: Member }) {
  return (
    <article className="rounded-lg bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
      <div className="relative aspect-[4/3] bg-brand-medium">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="px-4 py-4">
        <h3 className="text-center text-[15px] font-medium text-foreground">
          {member.name}
        </h3>
        <p className="mt-1 text-center text-xs tracking-widest text-foreground/60 uppercase ltr:uppercase rtl:normal-case">
          {member.position}
        </p>

        <div className="mt-3 flex items-center justify-center gap-4 text-foreground/70">
          {member.whatsapp && (
            <a
              href={member.whatsapp}
              aria-label="WhatsApp"
              className="hover:text-foreground transition"
            >
              <MessageCircle size={16} />
            </a>
          )}
          {member.phone && (
            <a
              href={member.phone}
              aria-label="Phone"
              className="hover:text-foreground transition"
            >
              <Phone size={16} />
            </a>
          )}
          {member.email && (
            <a
              href={member.email}
              aria-label="Email"
              className="hover:text-foreground transition"
            >
              <Mail size={16} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
