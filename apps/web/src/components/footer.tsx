import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import ExternalLink from "./external_link";
import { CodeIcon, GitHubIcon, LinkedInIcon, XIcon } from "./icons";

type FooterProps = {
  brandLabel: string;

  githubUrl: string;
  githubLabel: string;

  linkedinUrl: string;
  linkedinLabel: string;

  xUrl: string;
  xLabel: string;
};

export async function Footer({ brandLabel, githubUrl, githubLabel, linkedinUrl, linkedinLabel, xUrl, xLabel }: FooterProps) {
  const t = await getTranslations("footer");

  return (
    <footer className="w-full border-t border-slate-200 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Description (Col 1-5 on Desktop) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex flex-col items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                {/* Logo image or SVG goes here */}
                <CodeIcon />
              </div>
              <Link href="#" className="text-xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors">
                {brandLabel}<span className="text-indigo-600">.</span>
              </Link>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
                {t("description")}
              </p>
            </div>
          </div>

          {/* Quick navigation links (Cols 6-8 on Desktop) */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              {t("navigation")}
            </h3>
            <ul className="space-y-3 text-sm font-medium text-slate-600">
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  {t("links.start")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  {t("links.blog")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-indigo-600 transition-colors">
                  {t("links.contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* External Links & Socials (Cols 9-12 On Desktop) */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-4">
              {t("external_links")}
            </h3>
            <div className="flex flex-row items-center gap-4">
              <ExternalLink href={githubUrl} label={githubLabel} icon={<GitHubIcon />} />
              <ExternalLink href={linkedinUrl} label={linkedinLabel} icon={<LinkedInIcon />} />
              <ExternalLink href={xUrl} label={xLabel} icon={<XIcon />} />
            </div>
          </div>
        </div>

        {/* Copyright / Bottom row */}
        <div className="mt-1 pt-8 border-t border-slate-100 flex flex-col items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {t("copyright", { brand: brandLabel })}</p>
        </div>
      </div>
    </footer>
  );
}
