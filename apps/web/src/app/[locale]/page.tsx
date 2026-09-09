import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p>{t("content")}</p>
    </main>
  );
}
