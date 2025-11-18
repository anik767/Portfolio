import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to check authentication
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
  return token === adminToken;
}

// GET → fetch all categories
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const categories = await db.collection("categories").find().sort({ name: 1 }).toArray();
    
    // Convert ObjectId to string for JSON serialization
    const serializedCategories = categories.map(cat => ({
      ...cat,
      _id: cat._id.toString(),
    }));
    
    return NextResponse.json({ success: true, categories: serializedCategories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch categories";
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      categories: [] // Return empty array on error
    });
  }
}

// POST → create a new category (requires authentication)
export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ success: false, error: "Category name is required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    // Check if category already exists (case insensitive)
    const existing = await db.collection("categories").findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Category already exists" });
    }

    const result = await db.collection("categories").insertOne({
      name: name.trim(),
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, category: { _id: result.insertedId, name: name.trim() } });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create category";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// PUT → update a category (requires authentication)
export async function PUT(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, name } = await request.json();

    if (!id || !name || name.trim() === "") {
      return NextResponse.json({ success: false, error: "ID and category name are required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const { ObjectId } = await import("mongodb");

    // Check if another category with the same name exists (case insensitive)
    const existing = await db.collection("categories").findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      _id: { $ne: new ObjectId(id) }
    });

    if (existing) {
      return NextResponse.json({ success: false, error: "Category name already exists" });
    }

    const result = await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      { $set: { name: name.trim(), updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Category not found" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update category";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// DELETE → delete a category (requires authentication)
export async function DELETE(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const { ObjectId } = await import("mongodb");

    const result = await db.collection("categories").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Category not found" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

