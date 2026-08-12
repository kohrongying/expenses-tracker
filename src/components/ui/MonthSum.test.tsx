import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMonthYear } from "@/lib/utils";
import MonthSum from "./MonthSum";

describe("MonthSum", () => {
  it("shows the title, month/year, and formatted total", () => {
    render(
      <MonthSum loading={false} totalAmountInCents={12345} title="Spent" />
    );

    expect(screen.getByText(`Spent — ${getMonthYear()}`)).toBeInTheDocument();
    expect(screen.getByText("123.45")).toBeInTheDocument();
  });

  it("shows a loading placeholder instead of the amount while loading", () => {
    render(
      <MonthSum loading={true} totalAmountInCents={12345} title="Spent" />
    );

    expect(screen.getByText("…")).toBeInTheDocument();
    expect(screen.queryByText("123.45")).not.toBeInTheDocument();
  });
});
