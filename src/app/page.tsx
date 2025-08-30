// src/app/page.tsx
import { getTranslations } from "next-intl/server";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import OutTeamSection from "@/components/OutTeamSection";

type Slide = {
  id: number;
  portraitUrl: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export default async function Home() {
  const t = await getTranslations("home");

  const slides = t.raw("slides") as Slide[];

  return (
    <main>
      <Navbar />
      <Hero backgroundUrl={"/hero-image.jpg"} slides={slides} />
      <OutTeamSection/>
    </main>
  );
}
