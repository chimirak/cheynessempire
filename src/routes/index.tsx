import { createFileRoute } from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import heroDesktop from "@/assets/hero-spa.jpg";
import heroPortrait from "@/assets/hero-spa-portrait.jpg";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { Cursor } from "@/components/global/Cursor";
import { Entrance } from "@/components/global/Entrance";
import { MobileBar } from "@/components/global/MobileBar";
import { Nav } from "@/components/global/Nav";
import { ScrollProgress } from "@/components/global/ScrollProgress";
import { ProductSheet } from "@/components/ui/ProductSheet";
import { RitualDrawer } from "@/components/ui/RitualDrawer";
import { Hero } from "@/components/sections/Hero";
import { SelfLove } from "@/components/sections/SelfLove";
import { Experience } from "@/components/sections/Experience";
import { Edit } from "@/components/sections/Edit";
import { Ritual } from "@/components/sections/Ritual";
import { Consultation } from "@/components/sections/Consultation";
import { Difference } from "@/components/sections/Difference";
import { CustomerLove } from "@/components/sections/CustomerLove";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

const TITLE = "Cheyness Empire · Skincare & body care rituals, Port Harcourt";
const DESCRIPTION =
  "Beauty begins with how you treat yourself. Discover Cheyness Empire's skincare and body care rituals from Port Harcourt, Nigeria.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "preload", as: "image", href: heroDesktop, media: "(min-width: 768px)", fetchPriority: "high" },
      { rel: "preload", as: "image", href: heroPortrait, media: "(max-width: 767px)", fetchPriority: "high" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <MotionConfig reducedMotion="user">
      <SiteProvider>
        <a
          href="#main"
          className="sr-only z-[300] bg-espresso px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Entrance />
        <ScrollProgress />
        <Nav />
        <main id="main">
          <Hero />
          <SelfLove />
          <Experience />
          <Edit />
          <Ritual />
          <Consultation />
          <Difference />
          <CustomerLove />
          <FinalCta />
        </main>
        <Footer />
        <MobileBar />
        <ProductSheet />
        <RitualDrawer />
        <Cursor />
        <div aria-hidden className="cx-grain" />
      </SiteProvider>
    </MotionConfig>
  );
}
