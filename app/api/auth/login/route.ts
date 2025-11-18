import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    // Find user in MongoDB - only check users collection
    const client = await clientPromise;
    const db = client.db("mydb");
    const user = await db.collection("users").findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Check if user is active (status === 1)
    if (user.status !== 1) {
      return NextResponse.json({ success: false, error: "Account is inactive" }, { status: 403 });
    }

    // Verify password - handle both hashed (bcrypt) and plain text passwords
    let isPasswordValid = false;
    
    // Check if password is hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
    if (user.password && user.password.startsWith('$2')) {
      // Password is hashed, use bcrypt compare
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // Password is plain text, do direct comparison
      isPasswordValid = user.password === password;
    }
    
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Set authentication cookie
    const token = process.env.ADMIN_TOKEN || "admin-secret-token";
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Store user email in cookie for reference
    cookieStore.set("admin_email", user.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({ success: true, message: "Login successful", user: { email: user.email } });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

