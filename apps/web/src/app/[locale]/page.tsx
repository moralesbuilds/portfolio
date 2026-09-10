import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <>
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p>{t("content")}</p>
    </>
  );
}
