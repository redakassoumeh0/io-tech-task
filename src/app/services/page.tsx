// src/app/services/page.tsx
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default async function ServicesPage() {
  const locale = await getLocale();
  const t = await getTranslations("services");
  const isRTL = locale === "ar";

  const heroImage = t("heroImage");
  const backLabel = t("back");
  const title = t("title");
  const intro = t("intro");

  const general = {
    title: t("sections.general.title"),
    bullets: t.raw("sections.general.bullets") as string[],
  };
  const corporate = {
    title: t("sections.corporate.title"),
    intro: t("sections.corporate.intro"),
    bullets: t.raw("sections.corporate.bullets") as string[],
  };
  const individual = {
    title: t("sections.individual.title"),
    intro: t("sections.individual.intro"),
    bullets: t.raw("sections.individual.bullets") as string[],
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"}>
      <section className="relative h-[36vh] md:h-[42vh]">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-brand-dark/35 to-brand-dark/55" />
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          <div className="mb-6">
            <Link
              href="/"
              className={clsx(
                "inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition",
                isRTL && "flex-row-reverse"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{backLabel}</span>
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">
            {title}
          </h1>
          <p className="mt-4 text-foreground/70 leading-relaxed">{intro}</p>

          <div className="mt-8 space-y-8">
            <ServiceBlock title={general.title} bullets={general.bullets} />

            <ServiceBlock
              title={corporate.title}
              intro={corporate.intro}
              bullets={corporate.bullets}
            />

            <ServiceBlock
              title={individual.title}
              intro={individual.intro}
              bullets={individual.bullets}
            />
          </div>

          <p className="mt-10 text-sm text-foreground/60">{t("footerNote")}</p>
        </div>
      </section>
    </main>
  );
}

function ServiceBlock({
  title,
  intro,
  bullets,
}: {
  title: string;
  intro?: string;
  bullets: string[];
}) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-semibold text-brand-dark">
        {title}
      </h2>
      {intro && (
        <p className="mt-2 text-sm md:text-base text-foreground/70">{intro}</p>
      )}
      <ul className="mt-4 space-y-3">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-foreground/80">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark/90" />
            <span className="leading-relaxed">{b}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
