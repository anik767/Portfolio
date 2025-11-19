#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Utility script to create or update an admin user manually.
 *
 * Usage examples:
 *   node user.js --email=admin@example.com --password=Pass123 --status=1
 *   node user.js                       (script will prompt for missing values)
 *
 * The script reads Mongo credentials from environment variables. It automatically
 * loads .env.local if present, then falls back to the current shell environment.
 */

require("dotenv").config({ path: ".env.local" });

const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");
const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((arg) => {
      const [key, value] = arg.split("=");
      return [key.replace(/^--/, ""), value];
    })
    .filter(([key]) => key)
);

async function prompt(question, fallback) {
  if (fallback) {
    return fallback;
  }

  const rl = readline.createInterface({ input, output });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Set it in .env.local or the shell before running this script.");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB || "mydb";

  const emailInput = await prompt(
    "Admin email: ",
    args.email || process.env.ADMIN_DEFAULT_EMAIL
  );
  if (!emailInput) {
    console.error("Email is required.");
    process.exit(1);
  }

  const passwordInput = await prompt(
    "Admin password: ",
    args.password || process.env.ADMIN_DEFAULT_PASSWORD
  );
  if (!passwordInput) {
    console.error("Password is required.");
    process.exit(1);
  }

  const statusInput = args.status || process.env.ADMIN_DEFAULT_STATUS || "1";
  const status = parseInt(statusInput, 10) === 0 ? 0 : 1;

  const email = emailInput.toLowerCase();
  const hashedPassword = await bcrypt.hash(passwordInput, 10);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("admin_users");

    await collection.createIndex({ email: 1 }, { unique: true });

    const result = await collection.updateOne(
      { email },
      {
        $set: {
          email,
          password: hashedPassword,
          status,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          seededViaScript: true,
        },
      },
      { upsert: true }
    );

    if (result.upsertedCount > 0) {
      console.log(`✅ Created new admin: ${email}`);
    } else {
      console.log(`✅ Updated existing admin: ${email}`);
    }
  } catch (error) {
    console.error("Failed to create/update admin user:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();


