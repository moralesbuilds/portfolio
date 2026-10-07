import { Container, JsonLd } from "@/components";
import {
  HeroSection,
  AboutMeAndServicesSection,
  FeaturedProjectsSection,
  LatestBlogPostsSection,
  ContactSection
} from "@/features/landing";
import { personSchema, websiteSchema } from "@/lib/seo/schema";
import { getLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("seo.person");

  return (
    <Container>
      <HeroSection />
      <AboutMeAndServicesSection />
      <FeaturedProjectsSection />
      <LatestBlogPostsSection />
      <ContactSection />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@graph": [websiteSchema(locale), personSchema({ jobTitle: t("job_title"), description: t("description") }, locale)]
      }} />
    </Container>
  );
}
