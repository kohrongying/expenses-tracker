import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { categories } from "@/constants/ExpenseCategories";
import CategoryStamp from "./CategoryStamp";

const foodCategory = categories[0];

describe("CategoryStamp", () => {
  it("renders the category's icon tinted to its color", () => {
    const { container } = render(<CategoryStamp category={foodCategory} />);
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveStyle({ color: foodCategory.color });
  });

  it("defaults to the medium size", () => {
    const { container } = render(<CategoryStamp category={foodCategory} />);
    expect(container.firstChild).toHaveClass("h-[30px]", "w-[30px]");
  });

  it("applies the requested size", () => {
    const { container } = render(
      <CategoryStamp category={foodCategory} size="lg" />
    );
    expect(container.firstChild).toHaveClass("h-[34px]", "w-[34px]");
  });
});
