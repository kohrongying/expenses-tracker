import { Timestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import type { Expense } from "@/types";

export function makeExpense(overrides: Partial<Expense> = {}): Expense {
  return {
    id: "expense-1",
    amountInCents: 1000,
    desc: "Lunch",
    category: "Food",
    currency: "SGD",
    date: Timestamp.fromDate(new Date("2026-03-15")),
    createdAt: Timestamp.fromDate(new Date("2026-03-15")),
    ...overrides,
  };
}

export function makeUser(overrides: Partial<User> = {}): User {
  return { uid: "user-1", ...overrides } as User;
}
