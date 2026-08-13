import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  type TooltipContentProps,
} from "recharts";
import { formatCentsCompact, formatCentsToString } from "@/lib/utils";
import type { MonthlyTrendBucket } from "@/types";

const axisTick = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 0.5,
  fill: "var(--muted-foreground)",
};

function TrendTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const month = payload[0].payload as MonthlyTrendBucket;

  return (
    <div className="rounded-[4px] border border-border bg-popover px-2.5 py-1.5 shadow-md">
      <p className="font-mono text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground">
        {month.label}
      </p>
      <p className="font-mono text-xs font-bold tabular-nums text-popover-foreground">
        S$ {formatCentsToString(month.amountInCents)}
      </p>
    </div>
  );
}

interface MonthlyTrendProps {
  trend: MonthlyTrendBucket[];
  loading: boolean;
}

function MonthlyTrend({ trend, loading }: MonthlyTrendProps) {
  if (loading) {
    return <p className="py-2 text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={125}>
      <BarChart
        data={trend}
        margin={{ top: 18, right: 0, bottom: 0, left: 0 }}
      >
        <Tooltip content={TrendTooltip} cursor={{ fill: "var(--accent)" }} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={axisTick}
          interval={0}
        />
        <Bar dataKey="amountInCents" radius={[2, 2, 0, 0]} maxBarSize={26}>
          {trend.map((month) => (
            <Cell
              key={month.key}
              fill={month.isCurrent ? "var(--primary)" : "var(--secondary)"}
            />
          ))}
          <LabelList
            dataKey="amountInCents"
            position="top"
            offset={6}
            fontSize={9}
            fontWeight={700}
            fill="var(--muted-foreground)"
            formatter={(value) => formatCentsCompact(Number(value))}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MonthlyTrend;
