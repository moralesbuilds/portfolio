import { routing } from "@/i18n/routing";
import { ogFonts, ogSize } from "@/lib/og";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "MoralesBuilds — Luis Morales";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.person" });

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "space-between", padding: 72,
        background: "#0B0F14", color: "#E6EDF3", fontFamily: "Inter",
      }}>
        <div style={{ display: "flex", fontFamily: "JetBrains Mono", fontSize: 32, color: "#22D3EE" }}>
          ~/moralesbuilds
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontFamily: "JetBrains Mono", fontSize: 72 }}>Luis Morales</div>
          <div style={{ fontSize: 36, color: "#9AA7B2" }}>{t("job_title")}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#9AA7B2", borderTop: "2px solid #23303B", paddingTop: 24 }}>
          moralesbuilds.dev
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: await ogFonts()
    }
  );
}
