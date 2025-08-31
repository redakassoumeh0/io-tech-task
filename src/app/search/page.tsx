// src/app/search/page.tsx
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

type SearchPageProps = {
  searchParams: { q?: string };
};

async function fetchFromStrapi(endpoint: string, query: string) {
  const url = new URL(`http://localhost:1337/api/${endpoint}`);
  url.searchParams.set("filters[$or][0][name][$containsi]", query);
  // url.searchParams.set("filters[$or][1][company][$containsi]", query);
  url.searchParams.set("populate", "*");

  const res = await fetch(url.toString(), { cache: "no-store" });
  console.log(res);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const locale = await getLocale();
  const t = await getTranslations("search");
  const isRTL = locale === "ar";

  const q = searchParams.q || "";
  let teamMembers: any[] = [];
  let clients: any[] = [];

  if (q) {
    teamMembers = await fetchFromStrapi("team-members", q);
    clients = await fetchFromStrapi("clients", q);
  }

  console.log(teamMembers);

  const heroImage = "/hero-image.jpg"; // غيّرها لصورة مناسبة

  return (
    <main dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative h-[30vh] md:h-[36vh]">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-brand-dark/40 to-brand-dark/60" />
      </section>

      {/* محتوى */}
      <section className="bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          {/* Back */}
          <div className="mb-6">
            <Link
              href="/"
              className={clsx(
                "inline-flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition",
                isRTL && "flex-row-reverse"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{t("back")}</span>
            </Link>
          </div>

          {/* Title + search form */}
          <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark">
            {t("resultsFor", { query: q || "…" })}
          </h1>

          <form method="get" className="mt-6 flex gap-2">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder={t("placeholder")}
              className="w-full rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-dark/60"
            />
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-brand-dark px-4 py-2 text-white"
            >
              <Search className="h-4 w-4" />
              {t("searchBtn")}
            </button>
          </form>

          {/* Results */}
          <div className="mt-10 space-y-8">
            <ResultBlock
              title={t("teamMembers")}
              items={teamMembers}
              type="team"
              empty={t("noResults")}
            />
            <ResultBlock
              title={t("clients")}
              items={clients}
              type="client"
              empty={t("noResults")}
            />
          </div>

          {/* Note */}
          <p className="mt-10 text-sm text-foreground/60">{t("footerNote")}</p>
        </div>
      </section>
    </main>
  );
}

function ResultBlock({
  title,
  items,
  type,
  empty,
}: {
  title: string;
  items: any[];
  type: "client" | "team";
  empty: string;
}) {
  return (
    <section>
      <h2 className="text-lg md:text-xl font-semibold text-brand-dark mb-4">
        {title}
      </h2>
      {items.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const data = item;
            console.log(data);
            const imageUrl = data.image?.url;

            return (
              <li
                key={item.id}
                className="rounded-lg border border-foreground/10 bg-white shadow-sm overflow-hidden flex flex-col"
              >
                {imageUrl && (
                  <img
                    src={`http://localhost:1337${imageUrl}`}
                    alt={data.name}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="p-4 flex flex-col gap-2">
                  {type === "client" && (
                    <>
                      <h3 className="font-semibold text-brand-dark">
                        {data.name}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {data.company}
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {data.message}
                      </p>
                    </>
                  )}

                  {type === "team" && (
                    <>
                      <h3 className="font-semibold text-brand-dark">
                        {data.name}
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {data.position}
                      </p>
                      {data.social_links &&
                        Object.entries(data.social_links).map(([key, link]) => (
                          <a
                            key={key}
                            href={link as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-brand-dark/80 hover:underline"
                          >
                            {key}
                          </a>
                        ))}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-foreground/70">{empty}</p>
      )}
    </section>
  );
}
