import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeExpense } from "@/test/factories";

const { subscribeToExpensesSince } = vi.hoisted(() => ({
  subscribeToExpensesSince: vi.fn(),
}));

vi.mock("../expense/expenseApi", () => ({ subscribeToExpensesSince }));

const { default: useDashboardData } = await import("./useDashboardData");

describe("useDashboardData", () => {
  beforeEach(() => {
    subscribeToExpensesSince.mockReset();
  });

  it("starts in a loading state with no data", () => {
    subscribeToExpensesSince.mockReturnValue(vi.fn());

    const { result } = renderHook(() => useDashboardData("user-1"));

    expect(result.current.loading).toBe(true);
    expect(result.current.totalInCents).toBe(0);
    expect(result.current.recentItems).toEqual([]);
  });

  it("derives totals, breakdown, and recent items from the subscription's data", async () => {
    // A real Firestore Timestamp for "now" so the hook's current-month
    // filter includes this item.
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

    const { result } = renderHook(() => useDashboardData("user-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.totalInCents).toBe(1000);
    expect(result.current.recentItems).toHaveLength(1);
    expect(result.current.categoryBreakdown).toEqual([
      expect.objectContaining({ category: "Food", amountInCents: 1000 }),
    ]);
    expect(result.current.topCategory?.category).toBe("Food");
  });

  it("stops loading and surfaces no data when the subscription errors", async () => {
    subscribeToExpensesSince.mockImplementation(
      (_uid, _since, _onData, onError) => {
        onError(new Error("boom"));
        return vi.fn();
      }
    );

    const { result } = renderHook(() => useDashboardData("user-1"));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.totalInCents).toBe(0);
  });

  it("unsubscribes on unmount", () => {
    const unsubscribe = vi.fn();
    subscribeToExpensesSince.mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useDashboardData("user-1"));
    unmount();

    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });

  it("re-subscribes when the uid changes", () => {
    subscribeToExpensesSince.mockReturnValue(vi.fn());

    const { rerender } = renderHook(({ uid }) => useDashboardData(uid), {
      initialProps: { uid: "user-1" },
    });
    rerender({ uid: "user-2" });

    expect(subscribeToExpensesSince).toHaveBeenCalledTimes(2);
    expect(subscribeToExpensesSince.mock.calls[1][0]).toBe("user-2");
  });
});
