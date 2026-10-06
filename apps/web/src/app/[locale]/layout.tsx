import "../app.css";
import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Header, Footer } from "@/components";

// Title font
const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap'
});

// Body font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("root");
  const b = await getTranslations("brands");
  const { env } = await getCloudflareContext({ async: true });

  const githubUrl = env.GITHUB_PORTFOLIO_URL;
  const githubLabel = b("github");
  const brandLabel = b("own");
  const linkedinUrl = env.LINKED_IN_URL;
  const xUrl = env.X_URL;

  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="flex flex-col min-h-screen w-full bg-base">
        <NextIntlClientProvider>
          <Header
            brandLabel={brandLabel}
            projectLabel={t("project")}
            blogLabel={t("blog")}
            contactLabel={t("contact")}
            openMenuLabel={t("open_menu")}
            githubLabel={githubLabel}
            githubUrl={githubUrl}
          />

          <main className="grow w-full">{children}</main>

          <Footer
            brandLabel={brandLabel}
            githubLabel={githubLabel}
            githubUrl={githubUrl}
            linkedinUrl={linkedinUrl}
            linkedinLabel={b("linkedin")}
            xUrl={xUrl}
            xLabel={b("x")}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
