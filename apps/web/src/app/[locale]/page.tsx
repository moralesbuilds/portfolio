import { HeroSection, AboutMeAndServicesSection, FeaturedProjectsSection } from "@/features/landing";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <AboutMeAndServicesSection />
      <FeaturedProjectsSection />
    </>
  );
}
