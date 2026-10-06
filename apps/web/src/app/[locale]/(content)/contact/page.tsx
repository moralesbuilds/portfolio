import { ExternalLink, PageHeader } from "@/components";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { ContactForm } from "@/features/contact";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTranslations } from "next-intl/server";

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const b = await getTranslations("brands");
  const f = await getTranslations("footer");
  const { env } = await getCloudflareContext({ async: true });

  const githubUrl = env.GITHUB_PORTFOLIO_URL;
  const linkedinUrl = env.LINKED_IN_URL;
  const xUrl = env.X_URL;
  const contactEmail = env.CONTACT_EMAIL;

  return (
    <>
      {/* Page Title & description (centered) */}
      <PageHeader>
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            {t("title")}
          </h1>
          <p className="sm:text-lg text-gray-600 leading-relaxed">
            {t("brief")}
          </p>
        </div>
      </PageHeader>

      {/* Contents section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left column: Contact Form */}
        <div className="md:col-span-7 bg-base p-4 sm:p-6 border border-gray-200 rounded-md shadow-sm">
          <ContactForm />
        </div>

        {/* Right column: Info sidebar */}
        <aside className="md:col-span-5 flex flex-col gap-6">
          {/* Section 1: Email */}
          <div className="p-6 bg-base border border-gray-200 rounded-md shadow-sm space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {t("fields.email.label")}
            </h2>
            <div>
              <a href={`mailto:${contactEmail}`} className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                {contactEmail}
              </a>
            </div>
          </div>

          {/* Section 2: Response Time */}
          <div className="p-6 bg-base border border-gray-200 rounded-md shadow-sm space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {t("response_time.title")}
            </h2>
            <p className="font-medium text-gray-800">
              {t("response_time.delay")}
            </p>
            <p className="text-xs text-gray-500">
              {t("response_time.availability")}
            </p>
          </div>

          {/* Section 3: External Links */}
          <div className="p-6 bg-base border border-gray-200 rounded-md shadow-sm space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              {f("external_links")}
            </h2>

            <div className="flex flex-row items-center gap-4">
              <ExternalLink href={githubUrl} label={b("github")} icon={<GitHubIcon />} />
              <ExternalLink href={linkedinUrl} label={b("linkedin")} icon={<LinkedInIcon />} />
              <ExternalLink href={xUrl} label={b("x")} icon={<XIcon />} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
