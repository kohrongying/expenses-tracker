const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const getMonthName = () => {
  return monthNames[new Date().getMonth()];
};

export const getMonth = () => {
  return new Date().getMonth();
};

export const formatNumber = (num) => {
  let result = num !== null ? parseFloat(num).toFixed(2) : 0;
  return result;
};

// Returns string
export const formatCentsToString = (amountInCents) => {
  let result = amountInCents !== null ? (amountInCents / 100).toFixed(2) : "0.00";
  return result;
};

export const getMonthYear = () => {
  return `${monthNames[new Date().getMonth()]} ${new Date().getFullYear()}`;
};

// Midnight on the 1st of the given date's month.
export const startOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);

// Midnight on the 1st of the month `monthsAgo` months before the given date.
export const startOfMonthsAgo = (monthsAgo, date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth() - monthsAgo, 1);

// Sortable/groupable key for a date's month, e.g. "2026-08".
export const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const shortMonthLabel = (date) => shortMonthNames[date.getMonth()];

export const getTotalFromItems = (items) => {
  let total = 0;
  for (let item in items) {
    total += items[item].amount;
  }
  return total;
};
