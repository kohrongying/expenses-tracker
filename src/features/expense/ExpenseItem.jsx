import React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import CategoryStamp from "../../components/ui/CategoryStamp";
import { categories, findCategory } from "../../constants/ExpenseCategories";
import { formatCentsToString } from "../../lib/common";

const ExpenseItem = ({ dashboard, item, removeItem }) => {
  const category = findCategory(item.category) || categories[0];

  return (
    <div className="flex items-center gap-3 border-b border-border/70 py-3 last:border-b-0">
      <CategoryStamp category={category} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.8438rem] font-semibold">{item.desc || item.category}</p>
        <p className="font-mono text-[0.6875rem] text-muted-foreground">{item.date.toDate().toDateString()}</p>
      </div>
      <span className="flex-shrink-0 font-mono text-[0.8438rem] font-bold tabular-nums">
        S$ {formatCentsToString(item.amountInCents)}
      </span>
      {!dashboard && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={removeItem(item.id)}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Delete expense"
        >
          <Trash2 size={16} strokeWidth={2} />
        </Button>
      )}
    </div>
  );
};

export default ExpenseItem;