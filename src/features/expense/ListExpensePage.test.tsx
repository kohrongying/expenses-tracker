import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeExpense, makeUser } from "@/test/factories";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/firebase", () => ({ auth: {}, db: {} }));

const { subscribeToCurrentMonthExpenses, removeExpense } = vi.hoisted(() => ({
  subscribeToCurrentMonthExpenses: vi.fn(),
  removeExpense: vi.fn(),
}));
vi.mock("./expenseApi", () => ({
  subscribeToCurrentMonthExpenses,
  removeExpense,
}));

const { default: useAuthStore } = await import("@/store/authStore");
const { default: ListExpensePage } = await import("./ListExpensePage");

function renderPage() {
  const history = createMemoryHistory({ initialEntries: ["/expenses"] });
  render(
    <Router history={history}>
      <ListExpensePage />
    </Router>
  );
  return { history };
}

describe("ListExpensePage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: makeUser({ uid: "user-1" }),
      isLoading: false,
    });
    subscribeToCurrentMonthExpenses.mockReset();
    removeExpense.mockReset();
  });

  it("shows a loading state before the subscription delivers data", () => {
    subscribeToCurrentMonthExpenses.mockReturnValue(vi.fn());
    renderPage();
    expect(screen.getAllByText("Loading…")).not.toHaveLength(0);
  });

  it("renders the fetched expenses and their total once loaded", async () => {
    const items = [
      makeExpense({ id: "1", desc: "Coffee", amountInCents: 500 }),
      makeExpense({ id: "2", desc: "Lunch", amountInCents: 1200 }),
    ];
    subscribeToCurrentMonthExpenses.mockImplementation((_uid, onData) => {
      onData(items);
      return vi.fn();
    });

    renderPage();

    expect(await screen.findByText("Coffee")).toBeInTheDocument();
    expect(screen.getByText("Lunch")).toBeInTheDocument();
    expect(screen.getByText("17.00")).toBeInTheDocument(); // (500+1200)/100
  });

  it("shows an empty state when there are no expenses", async () => {
    subscribeToCurrentMonthExpenses.mockImplementation((_uid, onData) => {
      onData([]);
      return vi.fn();
    });

    renderPage();

    expect(await screen.findByText("No expenses found.")).toBeInTheDocument();
  });

  it("shows an error message when the subscription fails", async () => {
    subscribeToCurrentMonthExpenses.mockImplementation(
      (_uid, _onData, onError) => {
        onError(new Error("permission denied"));
        return vi.fn();
      }
    );

    renderPage();

    expect(
      await screen.findByText("Couldn't load expenses. Please try again.")
    ).toBeInTheDocument();
  });

  it("removes an expense and shows a success message", async () => {
    const user = userEvent.setup();
    const item = makeExpense({ id: "expense-1", desc: "Coffee" });
    subscribeToCurrentMonthExpenses.mockImplementation((_uid, onData) => {
      onData([item]);
      return vi.fn();
    });
    removeExpense.mockResolvedValue(undefined);

    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Delete expense" })
    );

    await waitFor(() =>
      expect(removeExpense).toHaveBeenCalledWith("user-1", "expense-1")
    );
    expect(await screen.findByText("Expense removed")).toBeInTheDocument();
  });

  it("shows an error message when removing an expense fails", async () => {
    const user = userEvent.setup();
    const item = makeExpense({ id: "expense-1" });
    subscribeToCurrentMonthExpenses.mockImplementation((_uid, onData) => {
      onData([item]);
      return vi.fn();
    });
    removeExpense.mockRejectedValue(new Error("network error"));

    renderPage();
    await user.click(
      await screen.findByRole("button", { name: "Delete expense" })
    );

    expect(
      await screen.findByText("Couldn't remove expense. Please try again.")
    ).toBeInTheDocument();
  });

  it("navigates to the add-expense page", async () => {
    const user = userEvent.setup();
    subscribeToCurrentMonthExpenses.mockReturnValue(vi.fn());
    const { history } = renderPage();

    await user.click(screen.getByRole("button", { name: "+ Add expense" }));

    expect(history.location.pathname).toBe("/expenses/new");
  });

  it("navigates home when the back button is clicked", async () => {
    const user = userEvent.setup();
    subscribeToCurrentMonthExpenses.mockReturnValue(vi.fn());
    const { history } = renderPage();

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(history.location.pathname).toBe("/");
  });
});
