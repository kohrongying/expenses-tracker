import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeExpense } from "@/test/factories";
import ExpenseItem from "./ExpenseItem";

describe("ExpenseItem", () => {
  it("renders the description, date, and formatted amount", () => {
    const item = makeExpense({ desc: "Coffee", amountInCents: 550 });
    render(<ExpenseItem item={item} />);

    expect(screen.getByText("Coffee")).toBeInTheDocument();
    expect(
      screen.getByText(item.date.toDate().toDateString())
    ).toBeInTheDocument();
    expect(screen.getByText("S$ 5.50")).toBeInTheDocument();
  });

  it("falls back to the category name when there is no description", () => {
    const item = makeExpense({ desc: "", category: "Food" });
    render(<ExpenseItem item={item} />);
    expect(screen.getByText("Food")).toBeInTheDocument();
  });

  it("shows a delete button that removes the item by id", async () => {
    const user = userEvent.setup();
    const removeItem = vi.fn(() => vi.fn());
    const item = makeExpense({ id: "expense-42" });

    render(<ExpenseItem item={item} removeItem={removeItem} />);
    await user.click(screen.getByRole("button", { name: "Delete expense" }));

    expect(removeItem).toHaveBeenCalledWith("expense-42");
  });

  it("hides the delete button in dashboard mode", () => {
    const item = makeExpense();
    render(<ExpenseItem item={item} dashboard />);
    expect(
      screen.queryByRole("button", { name: "Delete expense" })
    ).not.toBeInTheDocument();
  });
});
