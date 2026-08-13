import ExpenseItem from "../expense/ExpenseItem";
import type { Expense } from "@/types";

interface BiggestExpensesProps {
  items: Expense[];
  loading: boolean;
}

function BiggestExpenses({ items, loading }: BiggestExpensesProps) {
  if (loading) {
    return <p className="py-4 text-sm text-muted-foreground">Loading…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No expenses in the last 6 months.
      </p>
    );
  }

  return (
    <div>
      {items.map((item) => (
        <ExpenseItem dashboard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default BiggestExpenses;
