import React from "react";
import Ticket from "./Ticket";
import { getMonthYear, formatCentsToString } from "../../lib/common";

const MonthSum = ({ loading, totalAmountInCents, title }) => (
  <Ticket className="p-5">
    <p className="mb-2 font-mono text-[0.6875rem] font-bold uppercase tracking-wide text-muted-foreground">
      {title} — {getMonthYear()}
    </p>
    <p className="font-mono text-4xl font-bold leading-none tracking-tight">
      <span className="mr-1 text-lg font-semibold text-ink-soft">S$</span>
      {loading ? "…" : formatCentsToString(totalAmountInCents)}
    </p>
  </Ticket>
);

export default MonthSum;
