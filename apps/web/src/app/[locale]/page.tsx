import { Container, JsonLd } from "@/components";
import {
  HeroSection,
  AboutMeAndServicesSection,
  FeaturedProjectsSection,
  LatestBlogPostsSection,
  ContactSection
} from "@/features/landing";
import { alternates, personSchema, websiteSchema } from "@/lib/seo";
import { type Locale } from "@moralesbuilds/contents-db";
import { type Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale() as Locale;

  return {
    alternates: alternates(locale, { en: "/" })
  };
}

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
