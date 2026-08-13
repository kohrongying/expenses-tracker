import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeUser } from "@/test/factories";

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock("@/firebase", () => ({ auth: {}, db: {} }));

const { addExpense } = vi.hoisted(() => ({ addExpense: vi.fn() }));
vi.mock("./expenseApi", () => ({ addExpense }));

const { toast } = vi.hoisted(() => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("sonner", () => ({ toast, Toaster: () => null }));

const { default: useAuthStore } = await import("@/store/authStore");
const { default: AddExpensePage } = await import("./AddExpensePage");

function renderPage() {
  const history = createMemoryHistory({ initialEntries: ["/expenses/new"] });
  render(
    <Router history={history}>
      <AddExpensePage />
    </Router>
  );
  return { history };
}

describe("AddExpensePage", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: makeUser({ uid: "user-1" }),
      isLoading: false,
    });
    addExpense.mockReset();
    toast.success.mockReset();
    toast.error.mockReset();
  });

  it("renders the amount input with Food selected by default", () => {
    renderPage();
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Food/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("submits the entered amount, category, and memo", async () => {
    const user = userEvent.setup();
    addExpense.mockResolvedValue("new-id");
    renderPage();

    await user.type(screen.getByPlaceholderText("0.00"), "12.50");
    await user.click(screen.getByRole("button", { name: /Transport/ }));
    await user.type(screen.getByPlaceholderText("Add a note…"), "Bus fare");
    await user.click(screen.getByRole("button", { name: "Save expense" }));

    await waitFor(() =>
      expect(addExpense).toHaveBeenCalledWith("user-1", {
        amount: 12.5,
        remarks: "Bus fare",
        category: "Transport",
      })
    );
    // jsdom normalizes the typed number input value, dropping the trailing
    // zero ("12.50" -> "12.5").
    expect(toast.success).toHaveBeenCalledWith("Added S$12.5");
  });

  it("clears the form after a successful submit", async () => {
    const user = userEvent.setup();
    addExpense.mockResolvedValue("new-id");
    renderPage();

    const amountInput = screen.getByPlaceholderText("0.00");
    await user.type(amountInput, "5");
    await user.click(screen.getByRole("button", { name: "Save expense" }));

    await waitFor(() => expect(amountInput).toHaveValue(null));
  });

  it("shows an error and keeps the form filled when saving fails", async () => {
    const user = userEvent.setup();
    addExpense.mockRejectedValue(new Error("network error"));
    renderPage();

    const amountInput = screen.getByPlaceholderText("0.00");
    await user.type(amountInput, "5");
    await user.click(screen.getByRole("button", { name: "Save expense" }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong, add S$5 again"
      )
    );
    expect(amountInput).toHaveValue(5);
  });

  it("navigates home when the back button is clicked", async () => {
    const user = userEvent.setup();
    const { history } = renderPage();

    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(history.location.pathname).toBe("/");
  });
});
