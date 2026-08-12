#!/usr/bin/env node
/**
 * One-off migration: copies expense records from the old Realtime Database
 * layout into the current Firestore layout.
 *
 * Old (Realtime Database), written by the pre-Firestore app:
 *   users/{uid}/{year}/{month}/items/{pushId} = {
 *     amount: number,    // dollars
 *     remarks: string,
 *     category: string,
 *     date: number,      // ms epoch, Date.now() at submit time
 *   }
 *   (year = Date.getFullYear(), month = Date.getMonth(), 0-indexed)
 *
 * New (Firestore), written by src/features/expense/expenseApi.js:
 *   users/{uid}/expenses/{docId} = {
 *     amountInCents: number,
 *     desc: string,
 *     category: string,
 *     currency: string,
 *     date: Timestamp,
 *     createdAt: Timestamp,
 *   }
 *
 * The RTDB push ID is reused as the Firestore doc ID so the script is safe
 * to re-run: existing docs are skipped unless --overwrite is passed.
 *
 * Usage:
 *   npm install --save-dev firebase-admin
 *   node scripts/migrate-rtdb-to-firestore.js \
 *     --service-account=./serviceAccountKey.json \
 *     --database-url=https://expenses-tracker-staging.firebaseio.com \
 *     [--months=6] [--uid=someUid] [--overwrite] [--commit]
 *
 * Runs as a dry run (no writes) unless --commit is passed. Always do a
 * dry run first and check the summary before committing.
 */

import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

function parseArgs(argv) {
  const args = { months: 6, commit: false, overwrite: false, uid: null, serviceAccount: null, databaseUrl: null };
  for (const raw of argv) {
    const [key, value] = raw.replace(/^--/, "").split("=");
    if (key === "service-account") args.serviceAccount = value;
    else if (key === "database-url") args.databaseUrl = value;
    else if (key === "months") args.months = Number(value);
    else if (key === "uid") args.uid = value;
    else if (key === "overwrite") args.overwrite = true;
    else if (key === "commit") args.commit = true;
  }
  return args;
}

function usageAndExit() {
  console.error(
    "Usage: node scripts/migrate-rtdb-to-firestore.js --service-account=<path> --database-url=<url> [--months=6] [--uid=<uid>] [--overwrite] [--commit]"
  );
  process.exit(1);
}

// Last `months` (year, month) pairs ending with the current month, oldest first.
// `month` is 0-indexed to match the old schema's Date.getMonth() convention.
function lastMonths(months, now = new Date()) {
  const pairs = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    pairs.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return pairs;
}

function toExpenseDoc(item) {
  const warnings = [];

  const amount = Number(item.amount);
  if (!Number.isFinite(amount)) warnings.push(`non-numeric amount: ${item.amount}`);

  let dateMillis = item.date;
  if (typeof dateMillis !== "number" || !Number.isFinite(dateMillis)) {
    warnings.push(`missing/invalid date, falling back to now`);
    dateMillis = Date.now();
  }

  const doc = {
    amountInCents: Math.round((Number.isFinite(amount) ? amount : 0) * 100),
    desc: item.remarks || "",
    category: item.category || "",
    currency: "SGD",
    date: Timestamp.fromMillis(dateMillis),
    createdAt: Timestamp.fromMillis(dateMillis),
  };

  return { doc, warnings };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.serviceAccount || !args.databaseUrl) usageAndExit();
  if (!Number.isFinite(args.months) || args.months <= 0) usageAndExit();

  const serviceAccount = JSON.parse(readFileSync(args.serviceAccount, "utf8"));
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: args.databaseUrl,
  });

  const rtdb = getDatabase();
  const firestore = getFirestore();

  console.log(args.commit ? "Running in COMMIT mode (writes enabled)." : "Running in DRY RUN mode (no writes).");

  const usersSnapshot = await rtdb.ref("users").once("value");
  if (!usersSnapshot.exists()) {
    console.log("No /users node found in Realtime Database. Nothing to migrate.");
    return;
  }

  const months = lastMonths(args.months);
  console.log(
    `Migrating months: ${months.map(({ year, month }) => `${year}-${String(month + 1).padStart(2, "0")}`).join(", ")}`
  );

  const usersData = usersSnapshot.val();
  const uids = args.uid ? [args.uid] : Object.keys(usersData);

  let migrated = 0;
  let skippedExisting = 0;
  let withWarnings = 0;

  for (const uid of uids) {
    const userData = usersData[uid];
    if (!userData) continue;

    for (const { year, month } of months) {
      const items = userData[year]?.[month]?.items;
      if (!items) continue;

      let batch = firestore.batch();
      let batchSize = 0;

      for (const [itemId, item] of Object.entries(items)) {
        const docRef = firestore.doc(`users/${uid}/expenses/${itemId}`);

        if (!args.overwrite) {
          const existing = await docRef.get();
          if (existing.exists) {
            skippedExisting++;
            continue;
          }
        }

        const { doc, warnings } = toExpenseDoc(item);
        if (warnings.length > 0) {
          withWarnings++;
          console.warn(`[${uid} ${year}-${month + 1} ${itemId}] ${warnings.join("; ")}`);
        }

        console.log(
          `${args.commit ? "Writing" : "Would write"} users/${uid}/expenses/${itemId}:`,
          JSON.stringify({ ...doc, date: doc.date.toDate().toISOString(), createdAt: doc.createdAt.toDate().toISOString() })
        );

        if (args.commit) {
          batch.set(docRef, doc);
          batchSize++;
          if (batchSize === 500) {
            await batch.commit();
            batch = firestore.batch();
            batchSize = 0;
          }
        }
        migrated++;
      }

      if (args.commit && batchSize > 0) {
        await batch.commit();
      }
    }
  }

  console.log("\nSummary:");
  console.log(`  ${migrated} item(s) ${args.commit ? "migrated" : "would be migrated"}`);
  console.log(`  ${skippedExisting} item(s) skipped (already exist in Firestore)`);
  console.log(`  ${withWarnings} item(s) had data warnings (see above)`);
  if (!args.commit) {
    console.log("\nThis was a dry run. Re-run with --commit to write to Firestore.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
