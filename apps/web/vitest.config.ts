import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    name: "unit",
    environment: "jsdom",
    setupFiles: ["./src/vitest.setup.ts"],
    exclude: ["**/node_modules/**", "**/*.browser.test.{ts,tsx}"],
  },
});