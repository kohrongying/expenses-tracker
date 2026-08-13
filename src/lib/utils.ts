import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const monthNames = [
  { full: "January", short: "Jan" },
  { full: "February", short: "Feb" },
  { full: "March", short: "Mar" },
  { full: "April", short: "Apr" },
  { full: "May", short: "May" },
  { full: "June", short: "Jun" },
  { full: "July", short: "Jul" },
  { full: "August", short: "Aug" },
  { full: "September", short: "Sep" },
  { full: "October", short: "Oct" },
  { full: "November", short: "Nov" },
  { full: "December", short: "Dec" },
];

export const shortMonthLabel = (date: Date) =>
  monthNames[date.getMonth()]["short"];

export const getMonthName = () => {
  return monthNames[getMonth()]["full"];
};

export const getMonth = () => {
  return new Date().getMonth();
};

// Returns string
export const formatCentsToString = (amountInCents: number | null) => {
  const result =
    amountInCents !== null ? (amountInCents / 100).toFixed(2) : "0.00";
  return result;
};

// Compact whole-dollar figure for on-chart bar labels, where space is tight
// (full cents precision stays available via the tooltip).
export const formatCentsCompact = (amountInCents: number) =>
  `S$${Math.round(amountInCents / 100)}`;

export const getMonthYear = () => {
  return `${monthNames[getMonth()]["full"]} ${new Date().getFullYear()}`;
};

// Midnight on the 1st of the given date's month.
export const startOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

// Midnight on the 1st of the month `monthsAgo` months before the given date.
export const startOfMonthsAgo = (monthsAgo: number, date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() - monthsAgo, 1);

// Sortable/groupable key for a date's month, e.g. "2026-08".
export const monthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getTotalFromItems = (
  items: Record<string, { amount: number }>
) => {
  let total = 0;
  for (const item in items) {
    total += items[item].amount;
  }
  return total;
};
