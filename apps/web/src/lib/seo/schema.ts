import type { Person, WebSite } from "schema-dts";

export const SITE_URL = process.env.BASE_URL;
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function personSchema(t: { jobTitle: string; description: string; }, locale: string): Person {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Luis Morales",
    url: `${SITE_URL}/${locale}`,
    // No image yet
    jobTitle: t.jobTitle,
    description: t.description,
    knowsAbout: ["Next.js", "TypeScript", "React", "Cloudflare Workers"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CO"
    },
    sameAs: [
      "https://github.com/moralesbuilds",
      "https://www.linkedin.com/in/moralesbuilds"
    ]
  };
}

export function websiteSchema(locale: string): WebSite {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: "MoralesBuilds",
    inLanguage: locale,
    publisher: {
      "@id": PERSON_ID
    }
  };
}
