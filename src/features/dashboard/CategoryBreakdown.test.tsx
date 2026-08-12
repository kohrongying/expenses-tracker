import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildCategoryBreakdown } from "./dashboardSelectors";
import { makeExpense } from "@/test/factories";
import CategoryBreakdown from "./CategoryBreakdown";

describe("CategoryBreakdown", () => {
  it("shows a loading message while loading", () => {
    render(<CategoryBreakdown breakdown={[]} loading={true} />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("shows an empty-state message when there is no spend", () => {
    render(<CategoryBreakdown breakdown={[]} loading={false} />);
    expect(
      screen.getByText("No expenses logged this month yet.")
    ).toBeInTheDocument();
  });

  it("lists each category's label and formatted amount", () => {
    const breakdown = buildCategoryBreakdown([
      makeExpense({ category: "Food", amountInCents: 1500 }),
      makeExpense({ category: "Transport", amountInCents: 500 }),
    ]);

    render(<CategoryBreakdown breakdown={breakdown} loading={false} />);

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("S$ 15.00")).toBeInTheDocument();
    expect(screen.getByText("Transport")).toBeInTheDocument();
    expect(screen.getByText("S$ 5.00")).toBeInTheDocument();
  });
});
