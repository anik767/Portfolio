import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";

    if (token === adminToken) {
      return NextResponse.json({ success: true, authenticated: true });
    }

    return NextResponse.json({ success: true, authenticated: false });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, authenticated: false });
  }
}

