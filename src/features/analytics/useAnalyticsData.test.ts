import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeExpense } from "@/test/factories";

const { subscribeToExpensesSince } = vi.hoisted(() => ({
  subscribeToExpensesSince: vi.fn(),
}));

vi.mock("../expense/expenseApi", () => ({ subscribeToExpensesSince }));

const { default: useAnalyticsData } = await import("./useAnalyticsData");

describe("useAnalyticsData", () => {
  beforeEach(() => {
    subscribeToExpensesSince.mockReset();
  });

  it("starts in a loading state with no data", () => {
    subscribeToExpensesSince.mockReturnValue(vi.fn());

    const { result } = renderHook(() => useAnalyticsData("user-1"));

    expect(result.current.loading).toBe(true);
    expect(result.current.biggestExpenses).toEqual([]);
    expect(result.current.dayOfWeek).toHaveLength(7);
  });

  it("derives every chart's data from a single subscription", async () => {
    const { Timestamp } = await import("firebase/firestore");
    const items = [
      makeExpense({
        id: "1",
        category: "Food",
        amountInCents: 1000,
        date: Timestamp.fromDate(new Date()),
      }),
    ];

    subscribeToExpensesSince.mockImplementation((_uid, _since, onData) => {
      onData(items);
      return vi.fn();
    });

    const { result } = renderHook(() => useAnalyticsData("user-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(subscribeToExpensesSince).toHaveBeenCalledTimes(1);
    expect(result.current.biggestExpenses).toHaveLength(1);
    expect(result.current.categoryTrend.length).toBeGreaterThan(0);
  });

  it("stops loading when the subscription errors", async () => {
    subscribeToExpensesSince.mockImplementation(
      (_uid, _since, _onData, onError) => {
        onError(new Error("boom"));
        return vi.fn();
      }
    );

    const { result } = renderHook(() => useAnalyticsData("user-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.biggestExpenses).toEqual([]);
  });

  it("unsubscribes on unmount", () => {
    const unsubscribe = vi.fn();
    subscribeToExpensesSince.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useAnalyticsData("user-1"));
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("re-subscribes when the uid changes", () => {
    subscribeToExpensesSince.mockReturnValue(vi.fn());

    const { rerender } = renderHook(({ uid }) => useAnalyticsData(uid), {
      initialProps: { uid: "user-1" },
    });
    rerender({ uid: "user-2" });

    expect(subscribeToExpensesSince).toHaveBeenCalledTimes(2);
    expect(subscribeToExpensesSince.mock.calls[1][0]).toBe("user-2");
  });
});
