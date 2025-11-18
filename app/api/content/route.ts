import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET → fetch content
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");

    const content = await db.collection("content").findOne({ type: "home" });
    
    if (!content) {
      // Return default content if none exists
      return NextResponse.json({
        success: true,
        content: {
          title: "Welcome to Our Site",
          description: "This is the default content. Login to admin to edit it.",
          body: "Add your content here..."
        }
      });
    }

    return NextResponse.json({ success: true, content: content.data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" });
  }
}

// PUT → update content (requires authentication)
export async function PUT(request: Request) {
  try {
    // Check authentication via cookie
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
    
    if (!token || token !== adminToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, body } = await request.json();

    if (!title || !description || !body) {
      return NextResponse.json({ success: false, error: "All fields are required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("content").updateOne(
      { type: "home" },
      { $set: { type: "home", data: { title, description, body }, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update content";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

