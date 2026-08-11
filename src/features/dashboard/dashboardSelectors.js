import { categories } from "@/constants/ExpenseCategories";
import { monthKey, shortMonthLabel, startOfMonthsAgo } from "@/lib/utils";

export function sumAmountInCents(items) {
  return items.reduce((total, item) => total + item.amountInCents, 0);
}

// Per-category totals for a set of items, in the fixed category order,
// with zero-spend categories dropped and each entry's share of the total.
export function buildCategoryBreakdown(items) {
  const totalInCents = sumAmountInCents(items);

  const totalsByCategory = items.reduce((totals, item) => {
    totals[item.category] = (totals[item.category] || 0) + item.amountInCents;
    return totals;
  }, {});

  return categories
    .map((category) => ({
      category: category.value,
      label: category.label,
      color: category.color,
      amountInCents: totalsByCategory[category.value] || 0,
    }))
    .filter((entry) => entry.amountInCents > 0)
    .map((entry) => ({
      ...entry,
      percent: totalInCents ? (entry.amountInCents / totalInCents) * 100 : 0,
    }));
}

export function getTopCategory(breakdown) {
  if (!breakdown.length) return null;
  return breakdown.reduce((top, entry) => (entry.amountInCents > top.amountInCents ? entry : top));
}

// Fixed-width series of the last `monthsCount` months (oldest first, ending
// at `referenceDate`'s month), each bucket summed from `items`. Months with
// no expenses still appear, at zero, so the chart's x-axis never gaps.
export function buildMonthlyTrend(items, monthsCount, referenceDate = new Date()) {
  const months = Array.from({ length: monthsCount }, (_, index) => {
    const offset = monthsCount - 1 - index;
    const date = startOfMonthsAgo(offset, referenceDate);
    return {
      key: monthKey(date),
      label: shortMonthLabel(date),
      amountInCents: 0,
      isCurrent: offset === 0,
    };
  });

  const monthsByKey = new Map(months.map((month) => [month.key, month]));

  items.forEach((item) => {
    const bucket = monthsByKey.get(monthKey(item.date.toDate()));
    if (bucket) bucket.amountInCents += item.amountInCents;
  });

  return months;
}

export function getAverageDailyCents(totalInCents, referenceDate = new Date()) {
  return Math.round(totalInCents / referenceDate.getDate());
}

// Percent change from `previousInCents` to `currentInCents`, or null when
// there's no prior-month baseline to compare against.
export function getPercentChange(currentInCents, previousInCents) {
  if (!previousInCents) return null;
  return ((currentInCents - previousInCents) / previousInCents) * 100;
}
