import { useEffect, useMemo, useState } from "react";
import { subscribeToExpensesSince } from "../expense/expenseApi";
import { startOfMonth, startOfMonthsAgo } from "@/lib/utils";
import {
  sumAmountInCents,
  buildCategoryBreakdown,
  buildMonthlyTrend,
  getTopCategory,
  getAverageDailyCents,
  getPercentChange,
} from "./dashboardSelectors";
import type { Expense } from "@/types";

const TREND_MONTHS = 6;
const RECENT_LIMIT = 5;

// Single Firestore subscription covering the last TREND_MONTHS, from which
// every dashboard figure (month total, category breakdown, 6-month trend,
// recent list) is derived client-side — one read instead of one per view.
function useDashboardData(uid: string) {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToExpensesSince(
      uid,
      startOfMonthsAgo(TREND_MONTHS - 1),
      (data) => {
        setItems(data);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [uid]);

  const currentMonthItems = useMemo(() => {
    const monthStart = startOfMonth();
    return items.filter((item) => item.date.toDate() >= monthStart);
  }, [items]);

  const totalInCents = useMemo(
    () => sumAmountInCents(currentMonthItems),
    [currentMonthItems]
  );
  const categoryBreakdown = useMemo(
    () => buildCategoryBreakdown(currentMonthItems),
    [currentMonthItems]
  );
  const monthlyTrend = useMemo(
    () => buildMonthlyTrend(items, TREND_MONTHS),
    [items]
  );
  const recentItems = useMemo(
    () => currentMonthItems.slice(0, RECENT_LIMIT),
    [currentMonthItems]
  );

  const topCategory = useMemo(
    () => getTopCategory(categoryBreakdown),
    [categoryBreakdown]
  );
  const averageDailyCents = useMemo(
    () => getAverageDailyCents(totalInCents),
    [totalInCents]
  );
  const percentChange = useMemo(() => {
    const previousMonth = monthlyTrend[monthlyTrend.length - 2];
    return previousMonth
      ? getPercentChange(totalInCents, previousMonth.amountInCents)
      : null;
  }, [monthlyTrend, totalInCents]);

  return {
    loading,
    totalInCents,
    categoryBreakdown,
    monthlyTrend,
    recentItems,
    topCategory,
    averageDailyCents,
    percentChange,
  };
}

export default useDashboardData;
