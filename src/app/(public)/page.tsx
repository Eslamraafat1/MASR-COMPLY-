import { Hero } from "@/components/home/Hero";
import { LearnSection, WhySection } from "@/components/home/MoreSections";
import { PageFeedback } from "@/components/home/PageFeedback";
import { AnnouncementsSection, FaqSection, JourneySection, SectorsSection, ServicesSection, StatsSection } from "@/components/home/Sections";

/** Order mirrors the reference portal: hero → notices → sectors → why → services → learn → how it works → numbers → FAQ → feedback. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementsSection />
      <SectorsSection />
      <WhySection />
      <ServicesSection />
      <LearnSection />
      <JourneySection />
      <StatsSection />
      <FaqSection />
      <PageFeedback />
    </>
  );
}
