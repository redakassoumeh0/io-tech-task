// src/components/Hero.tsx
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Slide = {
  id: string | number;
  portraitUrl: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type Props = {
  backgroundUrl: string;
  slides: Slide[];
  intervalMs?: number;
  heightClass?: string;
};

export default function Hero({
  backgroundUrl,
  slides,
  intervalMs = 6000,
  heightClass = "h-[72vh] md:h-[78vh]",
}: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs]);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  const current = slides[index];

  return (
    <section className={`relative w-full ${heightClass} overflow-hidden`}>
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        <div
          key={`text-${index}`}
          className="max-w-xl text-white animate-[fadeIn_.5s_ease-out]"
        >
          {current.title && (
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight drop-shadow">
              {current.title}
            </h1>
          )}
          {current.description && (
            <p className="mt-4 text-sm md:text-base text-white/85">
              {current.description}
            </p>
          )}
          {current.ctaLabel && current.ctaHref && (
            <a
              href={current.ctaHref}
              className="mt-6 inline-block rounded bg-white px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-lighter transition"
            >
              {current.ctaLabel}
            </a>
          )}
        </div>

        {current.portraitUrl && (
          <div
            key={`portrait-${index}`}
            className="hidden md:block animate-[fadeIn_.5s_ease-out]"
          >
            <div className="relative">
              <img
                src={current.portraitUrl}
                alt=""
                className="h-64 w-64 object-cover rounded shadow-2xl ring-1 ring-black/10"
              />
              <div className="absolute -inset-4 -z-10 rounded bg-brand-medium" />
            </div>
          </div>
        )}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="z-50 absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/45 transition"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={next}
            className="z-50 absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/45 transition"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="z-50 absolute left-4 top-4/5 -translate-y-1/2 flex flex-col gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/60 transition ${
                i === index ? "bg-white" : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
