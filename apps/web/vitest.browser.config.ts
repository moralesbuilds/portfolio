import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify("test"),
  },
  optimizeDeps: {
    include: [
      "next-intl",
      "next/dist/client/components/http-access-fallback/http-access-fallback.js",
      "next/dist/client/components/redirect-error.js",
      "next/dist/client/components/redirect-status-code.js",
      "next/dist/client/components/redirect.js",
    ],
  },
  test: {
    name: "browser",
    include: ["**/*.browser.test.{ts,tsx}"],
    setupFiles: ["./src/vitest.browser.setup.ts"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }]
    },
  },
});
