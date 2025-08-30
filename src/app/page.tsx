// src/app/page.tsx
import { getTranslations } from "next-intl/server";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import OutTeamSection from "@/components/OutTeamSection";
import ClientsSection from "@/components/ClientsSection";

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
      <Hero backgroundUrl={"/hero-image.jpg"} slides={slides} />
      <OutTeamSection />
      <ClientsSection/>
    </main>
  );
}
