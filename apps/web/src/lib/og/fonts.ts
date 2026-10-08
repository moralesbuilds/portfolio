import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join(process.cwd(), "assets/fonts");

export async function ogFonts() {
  const [mono, inter] = await Promise.all([
    readFile(join(dir, "JetBrainsMono-Bold.ttf")),
    readFile(join(dir, "Inter-Regular.ttf")),
  ]);
  return [
    { name: "JetBrains Mono", data: mono, weight: 700 as const },
    { name: "Inter", data: inter, weight: 400 as const },
  ];
}

export const ogSize = { width: 1200, height: 630 };
