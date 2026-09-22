import {
  HeroSection,
  AboutMeAndServicesSection,
  FeaturedProjectsSection,
  LatestBlogPostsSection,
  ContactSection
} from "@/features/landing";

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutMeAndServicesSection />
      <FeaturedProjectsSection />
      <LatestBlogPostsSection />
      <ContactSection />
    </>
  );
}
