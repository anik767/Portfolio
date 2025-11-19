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
    let client;
    try {
      client = await clientPromise;
    } catch (dbError) {
      console.error("MongoDB connection error:", dbError);
      return NextResponse.json({ 
        success: false, 
        error: "Database connection failed. Please check your MongoDB connection string." 
      }, { status: 500 });
    }

    const db = client.db("mydb");
    const normalizedEmail = email.toLowerCase();
    const adminCollection = db.collection("admin_users");

    // Prefer admin_users collection
    let user = await adminCollection.findOne({ email: normalizedEmail });

    // Legacy fallback: migrate user from old users collection automatically
    if (!user) {
      const legacyUser = await db.collection("users").findOne({ email: normalizedEmail });
      if (legacyUser && legacyUser.password) {
        const hashedPassword = legacyUser.password.startsWith("$2")
          ? legacyUser.password
          : await bcrypt.hash(legacyUser.password, 10);

        const migrationResult = await adminCollection.insertOne({
          email: normalizedEmail,
          password: hashedPassword,
          status: typeof legacyUser.status === "number" ? legacyUser.status : 1,
          createdAt: legacyUser.createdAt || new Date(),
          updatedAt: new Date(),
          migratedFromUsers: true,
        });

        user = await adminCollection.findOne({ _id: migrationResult.insertedId });
      }
    }

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

