import { describe, it, expect } from "vitest";
import { sampleLines, total, parsePrice } from "../src/domain";
describe("sample order money", () => {
  it("computes the specified $48 sample without mutating stock", () => {
    const before = structuredClone(sampleLines);
    expect(total(sampleLines)).toBe(4800);
    expect(sampleLines).toEqual(before);
  });
  it("parses exact cents and rejects malformed/negative prices", () => {
    expect(parsePrice("0.10")).toBe(10);
    expect(parsePrice("12.5")).toBe(1250);
    for (const p of ["-1", "1e2", "12.345", "NaN", ""])
      expect(() => parsePrice(p)).toThrow();
  });
  it("overrides only the draft price", () => {
    const draft = structuredClone(sampleLines);
    draft[0].price = 1000;
    expect(total(draft)).toBe(4400);
    expect(sampleLines[0].price).toBe(1200);
  });
  it("rejects invalid quantities", () => {
    expect(() => total([{ ...sampleLines[0], quantity: 0 }])).toThrow();
  });
});
