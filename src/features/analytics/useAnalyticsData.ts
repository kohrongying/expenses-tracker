import { useEffect, useMemo, useState } from "react";
import { subscribeToExpensesSince } from "../expense/expenseApi";
import { startOfMonthsAgo } from "@/lib/utils";
import {
  buildCategoryChange,
  buildCategoryTrend,
  buildDayOfWeekAverages,
  getBiggestExpenses,
} from "./analyticsSelectors";
import type { Expense } from "@/types";

const ANALYTICS_MONTHS = 6;
const BIGGEST_EXPENSES_LIMIT = 10;

// Single Firestore subscription covering the last ANALYTICS_MONTHS, from
// which every analytics chart is derived client-side — one read instead of
// one per chart. Mirrors useDashboardData's approach.
function useAnalyticsData(uid: string) {
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToExpensesSince(
      uid,
      startOfMonthsAgo(ANALYTICS_MONTHS - 1),
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

  const categoryTrend = useMemo(
    () => buildCategoryTrend(items, ANALYTICS_MONTHS),
    [items]
  );
  const dayOfWeek = useMemo(
    () => buildDayOfWeekAverages(items, startOfMonthsAgo(ANALYTICS_MONTHS - 1)),
    [items]
  );
  const biggestExpenses = useMemo(
    () => getBiggestExpenses(items, BIGGEST_EXPENSES_LIMIT),
    [items]
  );
  const categoryChange = useMemo(() => buildCategoryChange(items), [items]);

  return {
    loading,
    categoryTrend,
    dayOfWeek,
    biggestExpenses,
    categoryChange,
  };
}

export default useAnalyticsData;
