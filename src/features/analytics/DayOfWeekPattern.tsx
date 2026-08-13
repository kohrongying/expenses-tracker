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
import type { DayOfWeekBucket } from "@/types";

const axisTick = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 0.5,
  fill: "var(--muted-foreground)",
};

function DayOfWeekTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const day = payload[0].payload as DayOfWeekBucket;

  return (
    <div className="rounded-[4px] border border-border bg-popover px-2.5 py-1.5 shadow-md">
      <p className="font-mono text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground">
        {day.label}
      </p>
      <p className="font-mono text-xs font-bold tabular-nums text-popover-foreground">
        S$ {formatCentsToString(day.averageCents)} avg
      </p>
    </div>
  );
}

interface DayOfWeekPatternProps {
  data: DayOfWeekBucket[];
  loading: boolean;
}

function DayOfWeekPattern({ data, loading }: DayOfWeekPatternProps) {
  if (loading) {
    return <p className="py-2 text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={125}>
      <BarChart data={data} margin={{ top: 18, right: 0, bottom: 0, left: 0 }}>
        <Tooltip
          content={DayOfWeekTooltip}
          cursor={{ fill: "var(--accent)" }}
        />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={axisTick}
          interval={0}
        />
        <Bar dataKey="averageCents" radius={[2, 2, 0, 0]} maxBarSize={26}>
          {data.map((day) => (
            <Cell
              key={day.day}
              fill={day.isWeekend ? "var(--primary)" : "var(--secondary)"}
            />
          ))}
          <LabelList
            dataKey="averageCents"
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

export default DayOfWeekPattern;
