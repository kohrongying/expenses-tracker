import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Banner from "./Banner";

describe("Banner", () => {
  it("renders the title", () => {
    render(<Banner title="This month" />);
    expect(screen.getByText("This month")).toBeInTheDocument();
  });

  it("renders secondary text when provided", () => {
    render(<Banner title="This month" secondaryText="S$ 120.00" />);
    expect(screen.getByText("S$ 120.00")).toBeInTheDocument();
  });

  it("omits secondary text when not provided", () => {
    render(<Banner title="This month" />);
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });
});
