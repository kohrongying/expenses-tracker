import { ref, onValue, push, remove } from "firebase/database";
import { db } from "../../firebase";

const path = (uid, year, month) => `/users/${uid}/${year}/${month}/items`;

export function subscribeToExpenses(uid, year, month, callback) {
  return onValue(ref(db, path(uid, year, month)), callback);
}

export function addExpense(uid, year, month, values) {
  return push(ref(db, path(uid, year, month)), values);
}

export function removeExpense(uid, year, month, itemId) {
  return remove(ref(db, `${path(uid, year, month)}/${itemId}`));
}