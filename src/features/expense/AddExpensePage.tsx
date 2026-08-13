import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { toast } from "sonner";
import useAuthedUser from "@/features/auth/useAuthedUser";
import Container from "@/components/ui/Container";
import Navbar from "@/components/ui/Navbar";
import PageShell from "@/components/ui/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CategoryStamp from "@/components/ui/CategoryStamp";
import { categories } from "@/constants/ExpenseCategories";
import { addExpense } from "./expenseApi";
import { cn } from "@/lib/utils";

function AddExpensePage() {
  const { uid } = useAuthedUser();
  const history = useHistory();
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [category, setCategory] = useState(categories[0].value);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const savedAmount = amount;
    const savedRemarks = remarks;
    const savedCategory = category;

    toast.success(`Added S$${savedAmount}`);
    setAmount("");
    setRemarks("");
    setCategory(categories[0].value);

    addExpense(uid, {
      amount: Number(savedAmount),
      remarks: savedRemarks,
      category: savedCategory,
    }).catch((err) => {
      console.error(err);
      toast.error(`Something went wrong, add S$${savedAmount} again`);
    });
  };

  const navigateHome = () => {
    history.push("/");
  };

  return (
    <PageShell>
      <Navbar />
      <Container>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={navigateHome}
            className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] border border-border/70 bg-card text-sm"
            aria-label="Back"
          >
            ←
          </button>
          <h2 className="text-[0.9375rem] font-extrabold">New expense</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex items-baseline justify-center gap-1 border-y border-dashed border-border py-7 my-6">
            <span className="font-mono text-2xl font-semibold text-ink-soft">
              S$
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              required
              autoFocus
              className="w-36 border-0 bg-transparent p-0 text-center font-mono text-5xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
          </div>

          <p className="mb-2.5 font-mono text-[0.6875rem] font-bold uppercase tracking-wide text-muted-foreground">
            Category
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((option) => {
              const isSelected = option.value === category;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setCategory(option.value)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex items-center gap-2 rounded-[5px] border px-3 py-2 text-sm font-medium transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-input bg-card text-muted-foreground hover:bg-accent"
                  )}
                >
                  <CategoryStamp category={option} size="sm" />
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="mb-2.5 font-mono text-[0.6875rem] font-bold uppercase tracking-wide text-muted-foreground">
            Memo{" "}
            <span className="font-sans font-normal normal-case tracking-normal text-muted-foreground">
              (optional)
            </span>
          </p>
          <Input
            type="text"
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
            placeholder="Add a note…"
            className="mb-8 rounded-none border-0 border-b border-dotted border-border bg-transparent px-1 shadow-none focus-visible:ring-0"
          />

          <hr className="mb-3.5 border-dashed border-border" />
          <Button
            type="submit"
            className="tear-notch w-full rounded-[6px] py-6 font-mono text-sm font-bold uppercase tracking-wide"
          >
            Save expense
          </Button>
        </form>
      </Container>
    </PageShell>
  );
}

export default AddExpensePage;
