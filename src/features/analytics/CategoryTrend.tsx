import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  type TooltipContentProps,
} from "recharts";
import { categories } from "@/constants/ExpenseCategories";
import { formatCentsCompact, formatCentsToString } from "@/lib/utils";
import type { CategoryTrendRow } from "@/types";

function rowTotal(row: CategoryTrendRow) {
  return categories.reduce(
    (sum, category) => sum + (Number(row[category.value]) || 0),
    0
  );
}

const axisTick = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: 0.5,
  fill: "var(--muted-foreground)",
};

function CategoryTrendTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload as CategoryTrendRow;

  return (
    <div className="rounded-[4px] border border-border bg-popover px-2.5 py-1.5 shadow-md">
      <p className="mb-1 font-mono text-[0.625rem] font-bold uppercase tracking-wide text-muted-foreground">
        {row.label}
      </p>
      <div className="flex flex-col gap-0.5">
        {categories.map((category) => {
          const amountInCents = Number(row[category.value]) || 0;
          if (!amountInCents) return null;
          return (
            <div
              key={category.value}
              className="flex items-center gap-1.5 text-xs"
            >
              <span
                className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-mono font-bold tabular-nums text-popover-foreground">
                S$ {formatCentsToString(amountInCents)}
              </span>
              <span className="text-muted-foreground">{category.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface CategoryTrendProps {
  trend: CategoryTrendRow[];
  loading: boolean;
}

function CategoryTrend({ trend, loading }: CategoryTrendProps) {
  if (loading) {
    return <p className="py-2 text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={176}>
        <BarChart
          data={trend}
          margin={{ top: 18, right: 0, bottom: 0, left: 0 }}
        >
          <Tooltip
            content={CategoryTrendTooltip}
            cursor={{ fill: "var(--accent)" }}
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={axisTick}
            interval={0}
          />
          {categories.map((category, index) => {
            const isTopSegment = index === categories.length - 1;
            return (
              <Bar
                key={category.value}
                dataKey={category.value}
                name={category.label}
                stackId="total"
                fill={category.color}
                radius={isTopSegment ? [2, 2, 0, 0] : 0}
                isAnimationActive={false}
              >
                {isTopSegment && (
                  <LabelList
                    dataKey={rowTotal}
                    position="top"
                    offset={6}
                    fontSize={9}
                    fontWeight={700}
                    fill="var(--muted-foreground)"
                    formatter={(value) => formatCentsCompact(Number(value))}
                  />
                )}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {categories.map((category) => (
          <div
            key={category.value}
            className="flex items-center gap-1.5 text-[0.75rem]"
          >
            <span
              className="h-[9px] w-[9px] flex-shrink-0 rounded-[2px]"
              style={{ backgroundColor: category.color }}
            />
            <span className="text-muted-foreground">{category.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryTrend;
