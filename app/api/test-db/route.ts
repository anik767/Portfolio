import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Test endpoint to check MongoDB connection
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    
    // Test connection by listing collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    // Count documents in key collections
    const postsCount = await db.collection("posts").countDocuments();
    const categoriesCount = await db.collection("categories").countDocuments();
    const usersCount = await db.collection("users").countDocuments();
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      collections: collectionNames,
      counts: {
        posts: postsCount,
        categories: categoriesCount,
        users: usersCount,
      }
    });
  } catch (error) {
    console.error("Database test error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      message: "Database connection failed. Check your MONGODB_URI environment variable."
    }, { status: 500 });
  }
}

