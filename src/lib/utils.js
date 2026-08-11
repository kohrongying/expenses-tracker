import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
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

export const shortMonthLabel = (date) => monthNames[date.getMonth()]['short'];

export const getMonthName = () => {
  return monthNames[getMonth()]['full'];
};

export const getMonth = () => {
  return new Date().getMonth();
};

// Returns string
export const formatCentsToString = (amountInCents) => {
  let result = amountInCents !== null ? (amountInCents / 100).toFixed(2) : "0.00";
  return result;
};

export const getMonthYear = () => {
  return `${monthNames[getMonth()]['full']} ${new Date().getFullYear()}`;
};

// Midnight on the 1st of the given date's month.
export const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);

// Midnight on the 1st of the month `monthsAgo` months before the given date.
export const startOfMonthsAgo = (monthsAgo, date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() - monthsAgo, 1);

// Sortable/groupable key for a date's month, e.g. "2026-08".
export const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const getTotalFromItems = (items) => {
  let total = 0;
  for (let item in items) {
    total += items[item].amount;
  }
  return total;
};
