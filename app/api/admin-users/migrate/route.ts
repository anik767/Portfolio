import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";

  if (!token || token !== adminToken) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export async function POST() {
  try {
    const authError = await requireAuth();
    if (authError) return authError;

    const client = await clientPromise;
    const db = client.db("mydb");
    const legacyUsers = await db
      .collection("users")
      .find({ email: { $exists: true, $ne: null } })
      .toArray();

    if (legacyUsers.length === 0) {
      return NextResponse.json({ success: true, migrated: 0, message: "No legacy users found." });
    }

    const adminCollection = db.collection("admin_users");
    let migrated = 0;

    for (const legacy of legacyUsers) {
      const email = typeof legacy.email === "string" ? legacy.email.toLowerCase() : null;
      if (!email) continue;

      const exists = await adminCollection.findOne({ email });
      if (exists) continue;

      if (!legacy.password) continue;

      const hashedPassword = legacy.password.startsWith("$2")
        ? legacy.password
        : await bcrypt.hash(legacy.password, 10);

      await adminCollection.insertOne({
        email,
        password: hashedPassword,
        status: typeof legacy.status === "number" ? legacy.status : 1,
        migratedFromUsers: true,
        createdAt: legacy.createdAt || new Date(),
        updatedAt: new Date(),
      });

      migrated += 1;
    }

    return NextResponse.json({
      success: true,
      migrated,
      message: migrated > 0 ? `Migrated ${migrated} users.` : "All users already migrated.",
    });
  } catch (error) {
    console.error("Migration failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Migration failed";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}


