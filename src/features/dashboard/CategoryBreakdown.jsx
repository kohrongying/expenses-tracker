import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatCentsToString } from "@/lib/utils";

function CategoryBreakdown({ breakdown, loading }) {
  if (loading) {
    return <p className="py-2 text-sm text-muted-foreground">Loading…</p>;
  }

  if (breakdown.length === 0) {
    return <p className="py-2 text-sm text-muted-foreground">No expenses logged this month yet.</p>;
  }

  // recharts stacks per data row, so the whole month's breakdown is one row
  // with each category as its own dataKey — a single 100%-stacked bar.
  const row = breakdown.reduce((acc, entry) => ({ ...acc, [entry.category]: entry.amountInCents }), { name: "total" });

  return (
    <div>
      <div className="mb-4 h-2.5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[row]} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" hide />
            {breakdown.map((entry, index) => (
              <Bar
                key={entry.category}
                dataKey={entry.category}
                stackId="total"
                fill={entry.color}
                stroke="var(--card)"
                strokeWidth={2}
                barSize={10}
                radius={index === 0 ? [3, 0, 0, 3] : index === breakdown.length - 1 ? [0, 3, 3, 0] : 0}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col gap-2.5">
        {breakdown.map((entry) => (
          <div key={entry.category} className="flex items-center gap-2 text-[0.8125rem]">
            <span className="h-[13px] w-[13px] flex-shrink-0 rounded-[3px]" style={{ backgroundColor: entry.color }} />
            <span className="whitespace-nowrap font-medium tracking-tight">{entry.label}</span>
            <span className="mx-0.5 min-w-3 flex-1 -translate-y-[3px] border-b border-dotted border-border" />
            <span className="font-mono font-bold tabular-nums">S$ {formatCentsToString(entry.amountInCents)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryBreakdown;
