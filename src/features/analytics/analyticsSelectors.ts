import { categories } from "@/constants/ExpenseCategories";
import { monthKey, shortMonthLabel, startOfMonth, startOfMonthsAgo } from "@/lib/utils";
import { sumAmountInCents, getPercentChange } from "../dashboard/dashboardSelectors";
import type {
  CategoryChangeEntry,
  CategoryTrendRow,
  DayOfWeekBucket,
  Expense,
} from "@/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Fixed-width series of the last `monthsCount` months, each row holding a
// zero-filled amount per category (mirrors buildMonthlyTrend's zero-fill so
// the stacked chart's x-axis never gaps).
export function buildCategoryTrend(
  items: Expense[],
  monthsCount: number,
  referenceDate = new Date()
): CategoryTrendRow[] {
  const months: CategoryTrendRow[] = Array.from(
    { length: monthsCount },
    (_, index) => {
      const offset = monthsCount - 1 - index;
      const date = startOfMonthsAgo(offset, referenceDate);
      const row: CategoryTrendRow = { key: monthKey(date), label: shortMonthLabel(date) };
      categories.forEach((category) => {
        row[category.value] = 0;
      });
      return row;
    }
  );

  const monthsByKey = new Map(months.map((month) => [month.key, month]));

  items.forEach((item) => {
    const bucket = monthsByKey.get(monthKey(item.date.toDate()));
    if (bucket) {
      bucket[item.category] = (Number(bucket[item.category]) || 0) + item.amountInCents;
    }
  });

  return months;
}

// Average spend per weekday, normalized by how many times that weekday
// actually occurred between startDate and endDate — so it reads as "typical
// Tuesday spend," not skewed by which weekday the window happens to start on.
export function buildDayOfWeekAverages(
  items: Expense[],
  startDate: Date,
  endDate = new Date()
): DayOfWeekBucket[] {
  const totalsByDay = new Array(7).fill(0);
  const occurrencesByDay = new Array(7).fill(0);

  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    occurrencesByDay[date.getDay()] += 1;
  }

  items.forEach((item) => {
    totalsByDay[item.date.toDate().getDay()] += item.amountInCents;
  });

  return DAY_LABELS.map((label, day) => ({
    day,
    label,
    averageCents: occurrencesByDay[day]
      ? Math.round(totalsByDay[day] / occurrencesByDay[day])
      : 0,
    isWeekend: day === 0 || day === 6,
  }));
}

export function getBiggestExpenses(items: Expense[], limit = 10): Expense[] {
  return [...items]
    .sort((a, b) => b.amountInCents - a.amountInCents)
    .slice(0, limit);
}

// This-month vs last-month per-category totals and percent change, sorted by
// absolute cents delta so the biggest movers surface first. Categories with
// no previous-month baseline (percentChange would be null) are dropped —
// there's nothing to compare yet.
export function buildCategoryChange(
  items: Expense[],
  referenceDate = new Date()
): CategoryChangeEntry[] {
  const currentStart = startOfMonth(referenceDate);
  const previousStart = startOfMonthsAgo(1, referenceDate);

  const currentItems = items.filter(
    (item) => item.date.toDate() >= currentStart
  );
  const previousItems = items.filter((item) => {
    const date = item.date.toDate();
    return date >= previousStart && date < currentStart;
  });

  const entries: CategoryChangeEntry[] = [];

  categories.forEach((category) => {
    const currentCents = sumAmountInCents(
      currentItems.filter((item) => item.category === category.value)
    );
    const previousCents = sumAmountInCents(
      previousItems.filter((item) => item.category === category.value)
    );
    const percentChange = getPercentChange(currentCents, previousCents);
    if (percentChange === null) return;

    entries.push({
      category: category.value,
      label: category.label,
      currentCents,
      previousCents,
      percentChange,
    });
  });

  return entries.sort(
    (a, b) =>
      Math.abs(b.currentCents - b.previousCents) -
      Math.abs(a.currentCents - a.previousCents)
  );
}
