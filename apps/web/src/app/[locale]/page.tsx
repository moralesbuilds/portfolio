import {
  HeroSection,
  AboutMeAndServicesSection,
  FeaturedProjectsSection,
  LatestBlogPostsSection
} from "@/features/landing";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <AboutMeAndServicesSection />
      <FeaturedProjectsSection />
      <LatestBlogPostsSection />
    </>
  );
}
