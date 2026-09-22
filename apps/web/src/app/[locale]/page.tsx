import {
  HeroSection,
  AboutMeAndServicesSection,
  FeaturedProjectsSection,
  LatestBlogPostsSection,
  ContactSection
} from "@/features/landing";

export const dynamic = "force-dynamic";

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
