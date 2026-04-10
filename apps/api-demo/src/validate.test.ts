import { describe, expect, it } from "vitest";

import { parseLeadBody } from "./validate.js";

describe("parseLeadBody", () => {
  it("acepta un lead válido", () => {
    const r = parseLeadBody({ name: "Ana", email: "ana@example.com" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.name).toBe("Ana");
      expect(r.value.email).toBe("ana@example.com");
    }
  });

  it("rechaza email inválido", () => {
    const r = parseLeadBody({ name: "Ana", email: "no-email" });
    expect(r.ok).toBe(false);
  });
});
