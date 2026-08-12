import { describe, expect, it } from "vitest";
import { categories, findCategory } from "./ExpenseCategories";

describe("findCategory", () => {
  it("finds a category by exact value", () => {
    expect(findCategory("Food")?.value).toBe("Food");
  });

  it("is case-insensitive", () => {
    expect(findCategory("groceries")?.value).toBe("Groceries");
    expect(findCategory("TRANSPORT")?.value).toBe("Transport");
  });

  it("returns undefined for an unknown category", () => {
    expect(findCategory("Rent")).toBeUndefined();
  });

  it("returns undefined for undefined input", () => {
    expect(findCategory(undefined)).toBeUndefined();
  });

  it.each(categories.map((category) => category.value))(
    "finds every configured category (%s)",
    (value) => {
      expect(findCategory(value)?.value).toBe(value);
    }
  );
});
