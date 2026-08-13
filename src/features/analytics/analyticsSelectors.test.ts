import { Timestamp } from "firebase/firestore";
import { describe, expect, it } from "vitest";
import { makeExpense } from "@/test/factories";
import {
  buildCategoryChange,
  buildCategoryTrend,
  buildDayOfWeekAverages,
  getBiggestExpenses,
} from "./analyticsSelectors";

describe("buildCategoryTrend", () => {
  it("builds a fixed-width series ending at the reference month, zero-filled per category", () => {
    const reference = new Date(2026, 2, 15); // March 2026
    const trend = buildCategoryTrend([], 3, reference);

    expect(trend.map((row) => row.key)).toEqual([
      "2026-01",
      "2026-02",
      "2026-03",
    ]);
    expect(trend.every((row) => row["Food"] === 0)).toBe(true);
  });

  it("sums expenses into the bucket and category matching their date", () => {
    const reference = new Date(2026, 2, 15);
    const items = [
      makeExpense({
        category: "Food",
        amountInCents: 100,
        date: Timestamp.fromDate(new Date(2026, 2, 1)),
      }),
      makeExpense({
        category: "Transport",
        amountInCents: 200,
        date: Timestamp.fromDate(new Date(2026, 1, 1)),
      }),
    ];
    const trend = buildCategoryTrend(items, 3, reference);

    const mar = trend.find((row) => row.key === "2026-03");
    const feb = trend.find((row) => row.key === "2026-02");
    expect(mar?.["Food"]).toBe(100);
    expect(feb?.["Transport"]).toBe(200);
  });

  it("drops expenses outside the requested window", () => {
    const reference = new Date(2026, 2, 15);
    const items = [
      makeExpense({
        amountInCents: 999,
        date: Timestamp.fromDate(new Date(2025, 0, 1)),
      }),
    ];
    const trend = buildCategoryTrend(items, 3, reference);
    const total = trend.reduce(
      (sum, row) =>
        sum +
        Object.values(row).reduce<number>(
          (rowSum, value) =>
            typeof value === "number" ? rowSum + value : rowSum,
          0
        ),
      0
    );
    expect(total).toBe(0);
  });
});

describe("buildDayOfWeekAverages", () => {
  it("returns 7 buckets in Sun..Sat order", () => {
    const result = buildDayOfWeekAverages(
      [],
      new Date(2026, 0, 1),
      new Date(2026, 0, 7)
    );
    expect(result.map((bucket) => bucket.label)).toEqual([
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
    ]);
  });

  it("averages spend by how many times that weekday occurred in the window", () => {
    // 2026-01-01 and 2026-01-08 are both Thursdays.
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 8);
    const items = [
      makeExpense({
        amountInCents: 100,
        date: Timestamp.fromDate(new Date(2026, 0, 1)),
      }),
      makeExpense({
        amountInCents: 300,
        date: Timestamp.fromDate(new Date(2026, 0, 8)),
      }),
    ];
    const result = buildDayOfWeekAverages(items, start, end);
    const thursday = result.find((bucket) => bucket.label === "Thu");
    expect(thursday?.averageCents).toBe(200);
  });

  it("marks Saturday and Sunday as weekend", () => {
    const result = buildDayOfWeekAverages(
      [],
      new Date(2026, 0, 1),
      new Date(2026, 0, 7)
    );
    expect(result.find((bucket) => bucket.label === "Sun")?.isWeekend).toBe(
      true
    );
    expect(result.find((bucket) => bucket.label === "Sat")?.isWeekend).toBe(
      true
    );
    expect(result.find((bucket) => bucket.label === "Wed")?.isWeekend).toBe(
      false
    );
  });
});

describe("getBiggestExpenses", () => {
  it("returns items sorted by amount descending, limited to N", () => {
    const items = [
      makeExpense({ id: "1", amountInCents: 100 }),
      makeExpense({ id: "2", amountInCents: 500 }),
      makeExpense({ id: "3", amountInCents: 300 }),
    ];
    const result = getBiggestExpenses(items, 2);
    expect(result.map((item) => item.id)).toEqual(["2", "3"]);
  });

  it("defaults to the top 10", () => {
    const items = Array.from({ length: 15 }, (_, index) =>
      makeExpense({ id: String(index), amountInCents: index })
    );
    expect(getBiggestExpenses(items)).toHaveLength(10);
  });
});

describe("buildCategoryChange", () => {
  it("computes current vs previous month totals and percent change per category", () => {
    const reference = new Date(2026, 2, 15); // March 2026
    const items = [
      makeExpense({
        category: "Food",
        amountInCents: 200,
        date: Timestamp.fromDate(new Date(2026, 2, 1)),
      }),
      makeExpense({
        category: "Food",
        amountInCents: 100,
        date: Timestamp.fromDate(new Date(2026, 1, 1)),
      }),
    ];
    const result = buildCategoryChange(items, reference);
    const food = result.find((entry) => entry.category === "Food");
    expect(food?.currentCents).toBe(200);
    expect(food?.previousCents).toBe(100);
    expect(food?.percentChange).toBe(100);
  });

  it("excludes categories with no previous-month baseline", () => {
    const reference = new Date(2026, 2, 15);
    const items = [
      makeExpense({
        category: "Movie",
        amountInCents: 500,
        date: Timestamp.fromDate(new Date(2026, 2, 1)),
      }),
    ];
    const result = buildCategoryChange(items, reference);
    expect(
      result.find((entry) => entry.category === "Movie")
    ).toBeUndefined();
  });

  it("sorts by absolute cents delta, biggest movers first", () => {
    const reference = new Date(2026, 2, 15);
    const items = [
      makeExpense({
        category: "Food",
        amountInCents: 110,
        date: Timestamp.fromDate(new Date(2026, 2, 1)),
      }),
      makeExpense({
        category: "Food",
        amountInCents: 100,
        date: Timestamp.fromDate(new Date(2026, 1, 1)),
      }),
      makeExpense({
        category: "Transport",
        amountInCents: 900,
        date: Timestamp.fromDate(new Date(2026, 2, 1)),
      }),
      makeExpense({
        category: "Transport",
        amountInCents: 100,
        date: Timestamp.fromDate(new Date(2026, 1, 1)),
      }),
    ];
    const result = buildCategoryChange(items, reference);
    expect(result[0].category).toBe("Transport");
  });

  it("returns an empty array when there is no data", () => {
    expect(buildCategoryChange([], new Date(2026, 2, 15))).toEqual([]);
  });
});
