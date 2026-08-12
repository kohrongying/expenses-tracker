import { describe, expect, it } from "vitest";
import {
  cn,
  formatCentsToString,
  getMonth,
  getMonthName,
  getMonthYear,
  getTotalFromItems,
  monthKey,
  shortMonthLabel,
  startOfMonth,
  startOfMonthsAgo,
} from "./utils";

describe("cn", () => {
  it("merges class names and drops falsy values", () => {
    expect(cn("a", false, undefined, "b")).toBe("a b");
  });

  it("resolves conflicting tailwind classes to the last one", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("shortMonthLabel", () => {
  it("returns the short label for a date's month", () => {
    expect(shortMonthLabel(new Date(2026, 0, 1))).toBe("Jan");
    expect(shortMonthLabel(new Date(2026, 11, 1))).toBe("Dec");
  });
});

describe("getMonthName / getMonth / getMonthYear", () => {
  it("derive from the current date", () => {
    const now = new Date();
    expect(getMonth()).toBe(now.getMonth());
    expect(getMonthName()).toBe(
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ][now.getMonth()]
    );
    expect(getMonthYear()).toBe(`${getMonthName()} ${now.getFullYear()}`);
  });
});

describe("formatCentsToString", () => {
  it("formats cents as a 2-decimal dollar string", () => {
    expect(formatCentsToString(1000)).toBe("10.00");
    expect(formatCentsToString(1)).toBe("0.01");
  });

  it("returns 0.00 for null", () => {
    expect(formatCentsToString(null)).toBe("0.00");
  });
});

describe("startOfMonth", () => {
  it("returns midnight on the 1st of the given date's month", () => {
    const result = startOfMonth(new Date(2026, 5, 23, 14, 30));
    expect(result).toEqual(new Date(2026, 5, 1));
  });
});

describe("startOfMonthsAgo", () => {
  it("returns the 1st of the month N months before the given date", () => {
    const result = startOfMonthsAgo(2, new Date(2026, 5, 23));
    expect(result).toEqual(new Date(2026, 3, 1));
  });

  it("rolls back across a year boundary", () => {
    const result = startOfMonthsAgo(3, new Date(2026, 1, 10));
    expect(result).toEqual(new Date(2025, 10, 1));
  });
});

describe("monthKey", () => {
  it("formats as YYYY-MM with zero-padded month", () => {
    expect(monthKey(new Date(2026, 0, 5))).toBe("2026-01");
    expect(monthKey(new Date(2026, 10, 5))).toBe("2026-11");
  });
});

describe("getTotalFromItems", () => {
  it("sums the amount field across all items", () => {
    expect(
      getTotalFromItems({
        a: { amount: 100 },
        b: { amount: 250 },
      })
    ).toBe(350);
  });

  it("returns 0 for an empty object", () => {
    expect(getTotalFromItems({})).toBe(0);
  });
});
