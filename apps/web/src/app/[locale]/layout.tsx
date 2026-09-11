import "../app.css";
import { routing } from "@/i18n/routing";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import Header from "@/components/header";
import { NextIntlClientProvider } from "next-intl";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import Container from "@/components/container";

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

  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body>
        <NextIntlClientProvider>
          <Header
            brandLabel={t("brand")}
            blogLabel={t("blog")}
            contactLabel={t("contact")}
            openMenuLabel={t("open_menu")}
            githubLabel={b("github")}
            githubUrl={githubUrl}
          />

          <Container>{children}</Container>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
