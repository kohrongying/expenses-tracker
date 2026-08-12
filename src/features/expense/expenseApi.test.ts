import { beforeEach, describe, expect, it, vi } from "vitest";
import { Timestamp } from "firebase/firestore";

const {
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} = vi.hoisted(() => ({
  collection: vi.fn(() => "expenses-collection"),
  addDoc: vi.fn(),
  doc: vi.fn(() => "doc-ref"),
  deleteDoc: vi.fn(),
  query: vi.fn((...args: unknown[]) => ["query", ...args]),
  where: vi.fn((...args: unknown[]) => ["where", ...args]),
  orderBy: vi.fn((...args: unknown[]) => ["orderBy", ...args]),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(() => "server-timestamp"),
}));

vi.mock("firebase/firestore", async (importOriginal) => {
  const actual = await importOriginal<typeof import("firebase/firestore")>();
  return {
    ...actual,
    collection,
    addDoc,
    doc,
    deleteDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp,
  };
});

vi.mock("@/firebase", () => ({ db: {} }));

const {
  addExpense,
  removeExpense,
  subscribeToCurrentMonthExpenses,
  subscribeToExpensesSince,
} = await import("./expenseApi");

describe("addExpense", () => {
  beforeEach(() => {
    collection.mockClear();
    addDoc.mockClear();
  });

  it("writes to the user's expenses collection with cents, defaults, and a server timestamp", async () => {
    addDoc.mockResolvedValue({ id: "new-id" });

    const id = await addExpense("user-1", {
      amount: "12.5",
      category: "Food",
      remarks: "Lunch",
    });

    expect(collection).toHaveBeenCalledWith({}, "users/user-1/expenses");
    expect(addDoc).toHaveBeenCalledWith(
      "expenses-collection",
      expect.objectContaining({
        amountInCents: 1250,
        desc: "Lunch",
        category: "Food",
        currency: "SGD",
        createdAt: "server-timestamp",
      })
    );
    expect(id).toBe("new-id");
  });

  it("rounds fractional cents and defaults an empty remark", async () => {
    addDoc.mockResolvedValue({ id: "new-id" });

    await addExpense("user-1", {
      amount: 10.005,
      category: "Other",
      remarks: "",
    });

    expect(addDoc).toHaveBeenCalledWith(
      "expenses-collection",
      expect.objectContaining({ amountInCents: 1001, desc: "" })
    );
  });
});

describe("removeExpense", () => {
  it("deletes the doc at the user's expense path", async () => {
    deleteDoc.mockResolvedValue(undefined);

    await removeExpense("user-1", "expense-1");

    expect(doc).toHaveBeenCalledWith({}, "users/user-1/expenses/expense-1");
    expect(deleteDoc).toHaveBeenCalledWith("doc-ref");
  });
});

describe("subscribeToCurrentMonthExpenses", () => {
  beforeEach(() => {
    onSnapshot.mockReset();
  });

  it("maps snapshot docs to Expense objects and calls onData", () => {
    const unsubscribe = vi.fn();
    onSnapshot.mockImplementation((_query, onNext) => {
      onNext({
        docs: [
          {
            id: "expense-1",
            data: () => ({ amountInCents: 500, category: "Food" }),
          },
        ],
      });
      return unsubscribe;
    });

    const onData = vi.fn();
    const result = subscribeToCurrentMonthExpenses("user-1", onData);

    expect(onData).toHaveBeenCalledWith([
      { id: "expense-1", amountInCents: 500, category: "Food" },
    ]);
    expect(result).toBe(unsubscribe);
  });

  it("calls onError when the snapshot listener errors", () => {
    onSnapshot.mockImplementation((_query, _onNext, onErrorCb) => {
      onErrorCb(new Error("permission denied"));
      return vi.fn();
    });

    const onError = vi.fn();
    subscribeToCurrentMonthExpenses("user-1", vi.fn(), onError);

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});

describe("subscribeToExpensesSince", () => {
  beforeEach(() => {
    onSnapshot.mockReset();
    where.mockClear();
  });

  it("queries from the given date onward, newest first", () => {
    onSnapshot.mockImplementation(() => vi.fn());
    const since = new Date(2026, 0, 1);

    subscribeToExpensesSince("user-1", since, vi.fn());

    expect(where).toHaveBeenCalledWith("date", ">=", Timestamp.fromDate(since));
    expect(orderBy).toHaveBeenCalledWith("date", "desc");
  });

  it("maps snapshot docs to Expense objects and calls onData", () => {
    onSnapshot.mockImplementation((_query, onNext) => {
      onNext({
        docs: [{ id: "expense-2", data: () => ({ amountInCents: 200 }) }],
      });
      return vi.fn();
    });

    const onData = vi.fn();
    subscribeToExpensesSince("user-1", new Date(), onData);

    expect(onData).toHaveBeenCalledWith([
      { id: "expense-2", amountInCents: 200 },
    ]);
  });
});
