import { routing } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MoralesBuilds — Luis Morales";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo.person" });

  const [mono, inter] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Inter-Regular.ttf"))
  ]);

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
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: mono, weight: 700 },
        { name: "Inter", data: inter, weight: 400 }
      ]
    }
  );
}
