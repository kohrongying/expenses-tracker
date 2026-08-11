import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { startOfMonth, startOfMonthsAgo } from "@/lib/utils";

function expensesCollection(uid) {
  return collection(db, `users/${uid}/expenses`);
}

/**
 * 1) Create an expense.
 * Writes to: users/{uid}/expenses/{auto-generated id}
 *
 * Accepts `amount` as a plain decimal dollar value (what AddExpenseForm's
 * InputNumber produces) and `remarks` as the free-text note — these are
 * converted here into the canonical stored field names/types:
 *   amountInCents: integer cents, avoids floating-point rounding issues
 *   desc:          free-text description
 *   date:          Firestore Timestamp
 *   createdAt:     Firestore Timestamp (server-assigned)
 */
export async function addExpense(uid, { amount, category, remarks }) {
  const now = new Date();

  const docRef = await addDoc(expensesCollection(uid), {
    amountInCents: Math.round(Number(amount) * 100),
    desc: remarks || "",
    category,
    currency: "SGD",
    date: Timestamp.fromDate(now),
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * 2) Subscribe to the current month's expenses, newest first.
 * Returns an unsubscribe function — call it on cleanup.
 *
 * onData: (items) => void        called whenever data changes
 * onError: (error) => void       called on read/permission errors
 */
export function subscribeToCurrentMonthExpenses(uid, onData, onError) {
  const q = query(
    expensesCollection(uid),
    where("date", ">=", Timestamp.fromDate(startOfMonth())),
    where("date", "<", Timestamp.fromDate(startOfMonthsAgo(-1))),
    orderBy("date", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

/**
 * Delete a single expense.
 * Targets: users/{uid}/expenses/{expenseId}
 */
export async function removeExpense(uid, expenseId) {
  await deleteDoc(doc(db, `users/${uid}/expenses/${expenseId}`));
}

/**
 * Subscribe to every expense on/after `sinceDate`, newest first.
 * Returns an unsubscribe function — call it on cleanup.
 *
 * Used by the dashboard to fetch one range covering both the current month
 * and the trailing months needed for the 6-month chart in a single query,
 * rather than a separate read per view.
 */
export function subscribeToExpensesSince(uid, sinceDate, onData, onError) {
  const q = query(
    expensesCollection(uid),
    where("date", ">=", Timestamp.fromDate(sinceDate)),
    orderBy("date", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}