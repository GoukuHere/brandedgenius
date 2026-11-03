import { BridgeStatement } from "@/components/site/bridge-statement";
import { CaseStack } from "@/components/site/case-stack";
import { ContactFab } from "@/components/site/contact-fab";
import { CtaBand } from "@/components/site/cta-band";
import { HeroCinema } from "@/components/site/hero-cinema";
import { ProblemArena } from "@/components/site/problem-arena";
import { ProcessTrack } from "@/components/site/process-track";
import { ServicesStack } from "@/components/site/services-stack";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { StatsBand } from "@/components/site/stats-band";
import { VelocityBand } from "@/components/site/velocity-band";
import { Voices } from "@/components/site/voices";
import { WorkshopRoman } from "@/components/site/workshop-roman";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip bg-black">
        <HeroCinema />
        <ProblemArena />
        <BridgeStatement />
        <ServicesStack />
        <CaseStack />
        <VelocityBand />
        <StatsBand />
        <ProcessTrack />
        <WorkshopRoman />
        <Voices />
        <CtaBand />
      </main>
      <SiteFooter />
      <ContactFab />
    </>
  );
}
