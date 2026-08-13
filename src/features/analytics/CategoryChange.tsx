import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { CategoryChangeEntry } from "@/types";

const axisTick = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 0.5,
  fill: "var(--muted-foreground)",
};

function CategoryChangeTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const entry = payload[0].payload as CategoryChangeEntry;

  return (
    <div className="rounded-[4px] border border-border bg-popover px-2.5 py-1.5 shadow-md">
      <p className="font-mono text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground">
        {entry.label}
      </p>
      <p className="font-mono text-xs font-bold tabular-nums text-popover-foreground">
        {entry.percentChange > 0 ? "+" : ""}
        {entry.percentChange.toFixed(0)}% vs last month
      </p>
    </div>
  );
}

interface CategoryChangeProps {
  data: CategoryChangeEntry[];
  loading: boolean;
}

function CategoryChange({ data, loading }: CategoryChangeProps) {
  if (loading) {
    return <p className="py-2 text-sm text-muted-foreground">Loading…</p>;
  }

  if (data.length === 0) {
    return (
      <p className="py-2 text-sm text-muted-foreground">
        Not enough data yet to compare months.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(data.length * 32, 110)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, bottom: 0, left: 0 }}
      >
        <Tooltip
          content={CategoryChangeTooltip}
          cursor={{ fill: "var(--accent)" }}
        />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={axisTick}
          width={80}
        />
        <ReferenceLine x={0} stroke="var(--border)" />
        <Bar
          dataKey="percentChange"
          radius={2}
          maxBarSize={18}
          isAnimationActive={false}
        >
          {data.map((entry) => (
            <Cell
              key={entry.category}
              fill={
                entry.percentChange <= 0
                  ? "var(--primary)"
                  : "var(--foreground)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CategoryChange;
