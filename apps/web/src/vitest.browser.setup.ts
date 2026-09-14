import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

import "@/app/app.css";

afterEach(() => {
  cleanup();
});
