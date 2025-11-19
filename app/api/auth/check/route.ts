import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const email = cookieStore.get("admin_email")?.value;
    const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";

    if (token === adminToken && email) {
      try {
        const client = await clientPromise;
        const db = client.db("mydb");
        const user = await db.collection("admin_users").findOne({ email });

        if (user && user.status === 1) {
          return NextResponse.json({ success: true, authenticated: true });
        }
      } catch (dbError) {
        console.error("Auth check DB error:", dbError);
      }
    }

    return NextResponse.json({ success: true, authenticated: false });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json({ success: false, authenticated: false });
  }
}

