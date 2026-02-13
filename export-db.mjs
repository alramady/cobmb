#!/usr/bin/env node
/**
 * CoBnB KSA — Database Export Script
 * Exports all table data as SQL INSERT statements for migration.
 * Usage: node export-db.mjs > database-dump.sql
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL environment variable is required");
  process.exit(1);
}

const TABLES = [
  "users",
  "cities",
  "neighborhoods",
  "properties",
  "bookings",
  "favorites",
  "reviews",
  "inquiries",
  "blog_posts",
  "team_members",
  "admin_users",
  "client_users",
  "password_reset_tokens",
  "partners",
  "job_postings",
  "job_applications",
  "settings",
];

function escapeValue(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace("T", " ")}'`;
  if (typeof val === "boolean") return val ? "1" : "0";
  if (Buffer.isBuffer(val)) return `X'${val.toString("hex")}'`;
  const str = String(val).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r");
  return `'${str}'`;
}

async function main() {
  const conn = await mysql.createConnection(DATABASE_URL);
  
  console.log("-- CoBnB KSA Database Dump");
  console.log(`-- Generated: ${new Date().toISOString()}`);
  console.log("-- Use: mysql -u user -p database < database-dump.sql");
  console.log("");
  console.log("SET FOREIGN_KEY_CHECKS = 0;");
  console.log("");

  for (const table of TABLES) {
    try {
      const [rows] = await conn.query(`SELECT * FROM \`${table}\``);
      console.log(`-- Table: ${table} (${rows.length} rows)`);
      
      if (rows.length === 0) {
        console.log(`-- (empty table)`);
        console.log("");
        continue;
      }

      // Truncate first for clean import
      console.log(`TRUNCATE TABLE \`${table}\`;`);

      const columns = Object.keys(rows[0]);
      const colList = columns.map(c => `\`${c}\``).join(", ");

      // Batch inserts in groups of 50
      for (let i = 0; i < rows.length; i += 50) {
        const batch = rows.slice(i, i + 50);
        const values = batch.map(row => {
          const vals = columns.map(col => escapeValue(row[col]));
          return `(${vals.join(", ")})`;
        });
        console.log(`INSERT INTO \`${table}\` (${colList}) VALUES`);
        console.log(values.join(",\n") + ";");
      }
      console.log("");
    } catch (err) {
      console.log(`-- ERROR exporting ${table}: ${err.message}`);
      console.log("");
    }
  }

  console.log("SET FOREIGN_KEY_CHECKS = 1;");
  console.log("");
  console.log("-- End of dump");

  await conn.end();
}

main().catch(err => {
  console.error("Export failed:", err.message);
  process.exit(1);
});
