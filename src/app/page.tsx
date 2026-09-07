import { cookies } from "next/headers";
import { CursorMount } from "@/components/cursor-mount";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Experience } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navigation } from "@/components/sections/navigation";
import { Projects } from "@/components/sections/projects";
import { Stack } from "@/components/sections/stack";
import { SmoothScroll } from "@/components/smooth-scroll";
import type { Locale } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n";

export default async function Home() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale")?.value;
  const initialLocale: Locale =
    localeCookie === "en" || localeCookie === "ru" ? localeCookie : "ru";

  return (
    <I18nProvider initialLocale={initialLocale}>
      <CursorMount />
      <SmoothScroll>
        <Navigation />
        <main>
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Stack />
          <CtaBanner />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </I18nProvider>
  );
}
