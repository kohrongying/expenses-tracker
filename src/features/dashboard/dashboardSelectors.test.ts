import { Timestamp } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { makeExpense } from "@/test/factories";
import {
  buildCategoryBreakdown,
  buildMonthlyTrend,
  getAverageDailyCents,
  getPercentChange,
  getTopCategory,
  sumAmountInCents,
} from "./dashboardSelectors";

describe("sumAmountInCents", () => {
  it("sums the amountInCents across items", () => {
    const items = [
      makeExpense({ amountInCents: 100 }),
      makeExpense({ amountInCents: 250 }),
    ];
    expect(sumAmountInCents(items)).toBe(350);
  });

  it("returns 0 for an empty list", () => {
    expect(sumAmountInCents([])).toBe(0);
  });
});

describe("buildCategoryBreakdown", () => {
  it("groups amounts by category and computes each share of the total", () => {
    const items = [
      makeExpense({ category: "Food", amountInCents: 300 }),
      makeExpense({ category: "Food", amountInCents: 200 }),
      makeExpense({ category: "Transport", amountInCents: 500 }),
    ];

    const breakdown = buildCategoryBreakdown(items);

    expect(breakdown).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "Food",
          amountInCents: 500,
          percent: 50,
        }),
        expect.objectContaining({
          category: "Transport",
          amountInCents: 500,
          percent: 50,
        }),
      ])
    );
  });

  it("drops categories with zero spend", () => {
    const items = [makeExpense({ category: "Food", amountInCents: 100 })];
    const breakdown = buildCategoryBreakdown(items);
    expect(breakdown).toHaveLength(1);
    expect(breakdown[0].category).toBe("Food");
  });

  it("preserves the fixed category order", () => {
    const items = [
      makeExpense({ category: "Other", amountInCents: 100 }),
      makeExpense({ category: "Food", amountInCents: 100 }),
    ];
    const breakdown = buildCategoryBreakdown(items);
    expect(breakdown.map((entry) => entry.category)).toEqual(["Food", "Other"]);
  });

  it("returns an empty array and no division-by-zero percent for no items", () => {
    expect(buildCategoryBreakdown([])).toEqual([]);
  });
});

describe("getTopCategory", () => {
  it("returns the entry with the highest amount", () => {
    const breakdown = buildCategoryBreakdown([
      makeExpense({ category: "Food", amountInCents: 100 }),
      makeExpense({ category: "Transport", amountInCents: 900 }),
    ]);
    expect(getTopCategory(breakdown)?.category).toBe("Transport");
  });

  it("returns null for an empty breakdown", () => {
    expect(getTopCategory([])).toBeNull();
  });
});

describe("buildMonthlyTrend", () => {
  it("builds a fixed-width series ending at the reference month", () => {
    const reference = new Date(2026, 2, 15); // March 2026
    const trend = buildMonthlyTrend([], 3, reference);

    expect(trend.map((bucket) => bucket.key)).toEqual([
      "2026-01",
      "2026-02",
      "2026-03",
    ]);
    expect(trend.every((bucket) => bucket.amountInCents === 0)).toBe(true);
  });

  it("marks only the final bucket as current", () => {
    const reference = new Date(2026, 2, 15);
    const trend = buildMonthlyTrend([], 3, reference);
    expect(trend.map((bucket) => bucket.isCurrent)).toEqual([
      false,
      false,
      true,
    ]);
  });

  it("sums expenses into the bucket matching their month", () => {
    const reference = new Date(2026, 2, 15);
    const items = [
      makeExpense({ amountInCents: 100 }), // March, from factory default
      makeExpense({
        date: Timestamp.fromDate(new Date(2026, 1, 1)),
        amountInCents: 200,
      }),
    ];
    const trend = buildMonthlyTrend(items, 3, reference);

    const feb = trend.find((bucket) => bucket.key === "2026-02");
    const mar = trend.find((bucket) => bucket.key === "2026-03");
    expect(feb?.amountInCents).toBe(200);
    expect(mar?.amountInCents).toBe(100);
  });

  it("drops expenses outside the requested window", () => {
    const reference = new Date(2026, 2, 15);
    const items = [
      makeExpense({
        date: Timestamp.fromDate(new Date(2025, 0, 1)),
        amountInCents: 999,
      }),
    ];
    const trend = buildMonthlyTrend(items, 3, reference);
    expect(trend.reduce((sum, bucket) => sum + bucket.amountInCents, 0)).toBe(
      0
    );
  });
});

describe("getAverageDailyCents", () => {
  it("divides the total by the day of the month, rounded", () => {
    const reference = new Date(2026, 2, 10); // 10th of the month
    expect(getAverageDailyCents(1000, reference)).toBe(100);
  });

  it("rounds to the nearest cent", () => {
    const reference = new Date(2026, 2, 3);
    expect(getAverageDailyCents(10, reference)).toBe(3);
  });
});

describe("getPercentChange", () => {
  it("computes the percent change from previous to current", () => {
    expect(getPercentChange(150, 100)).toBe(50);
    expect(getPercentChange(50, 100)).toBe(-50);
  });

  it("returns null when there is no previous baseline", () => {
    expect(getPercentChange(100, undefined)).toBeNull();
    expect(getPercentChange(100, 0)).toBeNull();
  });
});
