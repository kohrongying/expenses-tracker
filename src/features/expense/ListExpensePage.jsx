import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import useAuthedUser from "@/features/auth/useAuthedUser";
import Container from "@/components/ui/Container";
import Navbar from "@/components/ui/Navbar";
import PageShell from "@/components/ui/PageShell";
import MonthSum from "@/components/ui/MonthSum";
import { Button } from "@/components/ui/button";
import ExpenseItem from "./ExpenseItem";
import { subscribeToCurrentMonthExpenses, removeExpense } from "./expenseApi";

function ListExpensePage() {
  const { uid } = useAuthedUser();
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    setLoading(true);
    setMessageText("");

    const unsubscribe = subscribeToCurrentMonthExpenses(
      uid,
      (expenses) => {
        const total = expenses.reduce((sum, item) => sum + item.amountInCents, 0);
        setItems(expenses);
        setTotalAmount(total);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setMessageText("Couldn't load expenses. Please try again.");
        setMessageType("error");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid]);

  const navigate = (route) => () => {
    history.push(route);
  };

  const handleRemove = (itemId) => async () => {
    try {
      await removeExpense(uid, itemId);
      setMessageText("Expense removed");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessageText("Couldn't remove expense. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <PageShell>
      <Navbar />
      <Container>
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={navigate("/")}
            className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] border border-border/70 bg-card text-sm"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-[0.9375rem] font-extrabold">Expenses</h1>
        </div>

        <MonthSum loading={loading} totalAmountInCents={totalAmount} title="Expenses" />

        {messageText && (
          <div
            className={`mt-4 rounded-[4px] px-4 py-3 text-sm ${
              messageType === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}
          >
            {messageText}
          </div>
        )}

        <Button
          type="button"
          onClick={navigate("/expenses/new")}
          className="tear-notch mt-6 w-full rounded-[6px] py-6 font-mono text-sm font-bold uppercase tracking-wide"
        >
          + Add expense
        </Button>

        <div className="mt-8 rounded-[4px] border border-border/70 bg-card px-4 shadow-sm">
          {loading ? (
            <p className="py-4 text-sm text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="py-4 text-sm text-muted-foreground">No expenses found.</p>
          ) : (
            items.map((item) => <ExpenseItem key={item.id} item={item} removeItem={handleRemove} />)
          )}
        </div>
      </Container>
    </PageShell>
  );
}

export default ListExpensePage;
