import "../app.css";
import { routing } from "../../i18n/routing";
import { Inter, JetBrains_Mono } from "next/font/google";
import { getTranslations } from "next-intl/server";
import Header from "../../components/header";
import { NextIntlClientProvider } from "next-intl";

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
          />

          <main id="content" className="shrink-0">
            <div className="max-w-340 min-h-160 mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-base">
              {children}
            </div>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
