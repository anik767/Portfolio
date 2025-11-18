import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to check authentication
async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
  return token === adminToken;
}

// GET → fetch all posts
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const posts = await db.collection("posts").find().sort({ createdAt: -1 }).toArray();
    
    // Convert ObjectId to string for JSON serialization
    const serializedPosts = posts.map(post => ({
      ...post,
      _id: post._id.toString(),
    }));
    
    return NextResponse.json({ success: true, posts: serializedPosts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ 
      success: false, 
      error: errorMessage,
      posts: [] // Return empty array on error
    });
  }
}

// POST → create a new post (requires authentication)
export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as Blob | null;

    if (!title || !content) {
      return NextResponse.json({ success: false, error: "Title and content are required" });
    }

    let imageUrl = "";

    // Upload image to Cloudinary if provided
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        stream.end(buffer);
      });
      imageUrl = uploaded.secure_url;
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db.collection("posts").insertOne({
      title,
      content,
      category: category || null,
      image: imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, post: { _id: result.insertedId, title, content, image: imageUrl } });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// PUT → update a post (requires authentication)
export async function PUT(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const image = formData.get("image") as Blob | null;
    const existingImage = formData.get("existingImage") as string | null;

    if (!id || !title || !content) {
      return NextResponse.json({ success: false, error: "ID, title, and content are required" });
    }

    let imageUrl = existingImage || "";

    // Upload new image to Cloudinary if provided
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "posts" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        stream.end(buffer);
      });
      imageUrl = uploaded.secure_url;
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    const updateData: {
      title: string;
      content: string;
      category: string | null;
      image: string;
      updatedAt: Date;
    } = {
      title,
      content,
      category: category || null,
      image: imageUrl,
      updatedAt: new Date(),
    };

    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Post not found" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

// DELETE → delete a post (requires authentication)
export async function DELETE(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Post ID is required" });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Post not found" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ success: false, error: errorMessage });
  }
}

