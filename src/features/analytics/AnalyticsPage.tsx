import React from "react";
import { useHistory } from "react-router-dom";
import useAuthedUser from "@/features/auth/useAuthedUser";
import Container from "@/components/ui/Container";
import Navbar from "@/components/ui/Navbar";
import PageShell from "@/components/ui/PageShell";
import CategoryChange from "./CategoryChange";
import CategoryTrend from "./CategoryTrend";
import DayOfWeekPattern from "./DayOfWeekPattern";
import BiggestExpenses from "./BiggestExpenses";
import useAnalyticsData from "./useAnalyticsData";

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="mb-2.5 mt-7 font-mono text-[0.6875rem] font-bold uppercase tracking-wide text-ink-soft first:mt-0">
    {children}
  </h3>
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

function AnalyticsPage() {
  const { uid } = useAuthedUser();
  const history = useHistory();
  const { loading, categoryTrend, dayOfWeek, biggestExpenses, categoryChange } =
    useAnalyticsData(uid);

  return (
    <PageShell>
      <Navbar />
      <Container>
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => history.push("/")}
            className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[6px] border border-border/70 bg-card text-sm"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-[0.9375rem] font-extrabold">Analytics</h1>
        </div>

        <SectionTitle>Category trend</SectionTitle>
        <Panel className="p-4">
          <CategoryTrend trend={categoryTrend} loading={loading} />
        </Panel>

        <SectionTitle>Day-of-week habits</SectionTitle>
        <Panel className="p-4">
          <DayOfWeekPattern data={dayOfWeek} loading={loading} />
        </Panel>

        <SectionTitle>What&apos;s driving the change</SectionTitle>
        <Panel className="p-4">
          <CategoryChange data={categoryChange} loading={loading} />
        </Panel>

        <SectionTitle>Biggest expenses</SectionTitle>
        <Panel className="px-4">
          <BiggestExpenses items={biggestExpenses} loading={loading} />
        </Panel>
      </Container>
    </PageShell>
  );
}

export default AnalyticsPage;
