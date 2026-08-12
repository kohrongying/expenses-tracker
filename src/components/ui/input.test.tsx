import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders with the given type and placeholder", () => {
    render(<Input type="email" placeholder="you@example.com" />);
    const input = screen.getByPlaceholderText("you@example.com");
    expect(input).toHaveAttribute("type", "email");
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="amount" />);
    const input = screen.getByLabelText("amount");

    await user.type(input, "42.50");

    expect(input).toHaveValue("42.50");
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Input aria-label="amount" disabled />);
    expect(screen.getByLabelText("amount")).toBeDisabled();
  });
});
