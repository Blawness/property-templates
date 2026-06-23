import { describe, it, expect } from "vitest";
import { formatPrice, slugify, cn } from "../lib/utils.js";

describe("formatPrice", () => {
  it("formats numeric string as IDR currency", () => {
    expect(formatPrice("2500000000")).toBe("Rp 2.500.000.000");
  });

  it("formats number as IDR currency", () => {
    expect(formatPrice(15000000)).toBe("Rp 15.000.000");
  });

  it("formats with custom currency", () => {
    expect(formatPrice(500000, "USD")).toBe("US$500.000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("Rp 0");
  });
});

describe("slugify", () => {
  it("converts text to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles Indonesian text", () => {
    expect(slugify("Rumah Modern di BSD City")).toBe("rumah-modern-di-bsd-city");
  });

  it("removes special characters", () => {
    expect(slugify("Hello! @World #2024")).toBe("hello-world-2024");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("  -hello-  ")).toBe("hello");
  });

  it("collapses multiple spaces and underscores", () => {
    expect(slugify("hello   world__test")).toBe("hello-world-test");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });
});

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("text-red-500", "font-bold")).toBe("text-red-500 font-bold");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4 py-2", "px-6")).toBe("py-2 px-6");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });

  it("returns empty string for no args", () => {
    expect(cn()).toBe("");
  });
});
