import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET → fetch all admin users (requires authentication)
export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
    
    if (!token || token !== adminToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const users = await db.collection("admin_users").find({}, { projection: { password: 0 } }).toArray();
    
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// POST → create a new admin user (requires authentication)
export async function POST(request: Request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
    
    if (!token || token !== adminToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { email, password, status } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    // Check if user already exists
    const existingUser = await db.collection("admin_users").findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.collection("admin_users").insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      status: status !== undefined ? status : 1, // Default to active
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// PUT → update admin user (requires authentication)
export async function PUT(request: Request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
    
    if (!token || token !== adminToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, email, password, status } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const { ObjectId } = await import("mongodb");

    const updateData: any = {};
    if (email) updateData.email = email.toLowerCase();
    if (status !== undefined) updateData.status = status;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    updateData.updatedAt = new Date();

    const result = await db.collection("admin_users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// DELETE → delete admin user (requires authentication)
export async function DELETE(request: Request) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
    
    if (!token || token !== adminToken) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");
    const { ObjectId } = await import("mongodb");

    const result = await db.collection("admin_users").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

