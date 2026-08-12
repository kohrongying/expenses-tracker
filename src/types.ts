import type { Timestamp } from "firebase/firestore";
import type { LucideIcon } from "lucide-react";

export interface Category {
  value: string;
  label: string;
  color: string;
  icon: LucideIcon;
}

export interface Expense {
  id: string;
  amountInCents: number;
  desc: string;
  category: string;
  currency: string;
  date: Timestamp;
  createdAt: Timestamp;
}

export interface CategoryBreakdownEntry {
  category: string;
  label: string;
  color: string;
  amountInCents: number;
  percent: number;
}

export interface MonthlyTrendBucket {
  key: string;
  label: string;
  amountInCents: number;
  isCurrent: boolean;
}
