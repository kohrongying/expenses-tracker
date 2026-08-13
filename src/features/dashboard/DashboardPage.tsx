import React from "react";
import { useHistory } from "react-router-dom";
import useAuthedUser from "../auth/useAuthedUser";
import Container, { CONTAINER_WIDTH } from "@/components/ui/Container";
import Ticket from "@/components/ui/Ticket";
import { Button } from "@/components/ui/button";
import ExpenseItem from "../expense/ExpenseItem";
import CategoryBreakdown from "./CategoryBreakdown";
import MonthlyTrend from "./MonthlyTrend";
import useDashboardData from "./useDashboardData";
import { formatCentsToString, getMonthYear } from "@/lib/utils";

const Eyebrow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={`font-mono text-[0.6875rem] font-bold uppercase tracking-wide text-muted-foreground ${className}`}
  >
    {children}
  </p>
);

const SectionTitle = ({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="mb-2.5 mt-7 flex items-baseline justify-between">
    <h3 className="font-mono text-[0.6875rem] font-bold uppercase tracking-wide text-ink-soft">
      {children}
    </h3>
    {action}
  </div>
);

const Panel = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-[4px] border border-border/70 bg-card shadow-sm ${className}`}
  >
    {children}
  </div>
);

function Dashboard() {
  const { uid } = useAuthedUser();
  const history = useHistory();
  const {
    loading,
    totalInCents,
    categoryBreakdown,
    monthlyTrend,
    recentItems,
    topCategory,
    averageDailyCents,
    percentChange,
  } = useDashboardData(uid);

  const goToAddExpense = () => history.push("/expenses/new");
  const goToAllExpenses = () => history.push("/expenses");

  return (
    <Container className="pb-32">
      <Eyebrow className="mb-4">{getMonthYear()}</Eyebrow>

      <Ticket className="p-5">
        <Eyebrow className="mb-2">Total spent</Eyebrow>
        <p className="font-mono text-4xl font-bold leading-none tracking-tight">
          <span className="mr-1 text-lg font-semibold text-ink-soft">S$</span>
          {formatCentsToString(totalInCents)}
        </p>

        <hr className="my-4 border-dashed border-border" />

        <div className="flex gap-6">
          <div>
            <Eyebrow className="mb-1">Avg / day</Eyebrow>
            <p className="font-mono text-[0.9375rem] font-bold">
              S$ {formatCentsToString(averageDailyCents)}
            </p>
          </div>
          {percentChange !== null && (
            <div>
              <Eyebrow className="mb-1">Vs. last month</Eyebrow>
              <p
                className={`font-mono text-[0.9375rem] font-bold ${percentChange <= 0 ? "text-primary" : "text-foreground"}`}
              >
                {percentChange > 0 ? "+" : ""}
                {percentChange.toFixed(0)}%
              </p>
            </div>
          )}
          {topCategory && (
            <div>
              <Eyebrow className="mb-1">Top category</Eyebrow>
              <p className="font-mono text-[0.9375rem] font-bold">
                {topCategory.label}
              </p>
            </div>
          )}
        </div>
      </Ticket>

      <div className="md:grid md:grid-cols-2 md:gap-5">
        <div>
          <SectionTitle>By category</SectionTitle>
          <Panel className="p-4">
            <CategoryBreakdown
              breakdown={categoryBreakdown}
              loading={loading}
            />
          </Panel>
        </div>

        <div>
          <SectionTitle>Last 6 months</SectionTitle>
          <button
            type="button"
            onClick={() => history.push("/analytics")}
            aria-label="View analytics"
            className="block w-full text-left"
          >
            <Panel className="p-4 transition-colors hover:bg-accent/40">
              <MonthlyTrend trend={monthlyTrend} loading={loading} />
            </Panel>
          </button>
        </div>
      </div>

      <SectionTitle
        action={
          <button
            type="button"
            onClick={goToAllExpenses}
            className="font-mono text-[0.6875rem] font-bold uppercase tracking-wide text-primary"
          >
            View all
          </button>
        }
      >
        Recent
      </SectionTitle>
      <Panel className="px-4">
        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading…</p>
        ) : recentItems.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            No expenses logged this month yet.
          </p>
        ) : (
          recentItems.map((item) => (
            <ExpenseItem dashboard key={item.id} item={item} />
          ))
        )}
      </Panel>

      <div
        className={`fixed inset-x-0 bottom-0 mx-auto w-full ${CONTAINER_WIDTH} bg-background px-5 pb-6 pt-4 sm:px-6 md:px-8`}
      >
        <hr className="mb-3.5 border-dashed border-border" />
        <Button
          type="button"
          onClick={goToAddExpense}
          className="tear-notch w-full rounded-[6px] py-6 font-mono text-sm font-bold uppercase tracking-wide"
        >
          + Add expense
        </Button>
      </div>
    </Container>
  );
}

export default Dashboard;
