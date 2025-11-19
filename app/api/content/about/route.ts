import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper: check admin auth via cookie
async function checkAuth() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
  return token === adminToken;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    
    const about = await db.collection("about").findOne({});
    
    if (!about) {
      return NextResponse.json({
        success: true,
        about: null
      });
    }

    return NextResponse.json({
      success: true,
      about: {
        ...about,
        _id: about._id.toString()
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch about data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const slogan = formData.get("slogan") as string;
    const heading = formData.get("heading") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as Blob | null;
    const badges = formData.get("badges") as string;

    const client = await clientPromise;
    const db = client.db("mydb");

    // Parse description if it's a JSON string
    let descriptionArray: string[] = [];
    try {
      descriptionArray = JSON.parse(description || "[]");
    } catch {
      // If not JSON, split by newlines
      descriptionArray = description ? description.split("\n").filter(Boolean) : [];
    }

    // Parse badges - comma-separated format: "text:variant, text:variant"
    let badgesArray: Array<{ text: string; variant: string }> = [];
    if (badges && badges.trim()) {
      badgesArray = badges.split(",").map(badge => {
        const parts = badge.trim().split(":");
        const text = parts[0]?.trim() || "";
        const variant = parts[1]?.trim() || "emerald";
        return { text, variant };
      }).filter(b => b.text.length > 0);
    }

    let imageUrl = "";

    // Upload image if provided
    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "about" }, (err, result) => {
          if (err) return reject(err);
          resolve(result as { secure_url: string; public_id: string });
        });
        stream.end(buffer);
      });
      imageUrl = uploaded.secure_url;
    }

    // Get existing about data
    const existing = await db.collection("about").findOne({});
    
    type AboutUpdateData = {
      title: string;
      slogan: string;
      heading: string;
      description: string[];
      badges: Array<{ text: string; variant: string }>;
      updatedAt: Date;
      image?: string;
      createdAt?: Date;
    };
    
    const updateData: AboutUpdateData = {
      title: title || "",
      slogan: slogan || "",
      heading: heading || "",
      description: descriptionArray,
      badges: badgesArray,
      updatedAt: new Date()
    };

    if (imageUrl) {
      updateData.image = imageUrl;
    } else if (existing?.image) {
      updateData.image = existing.image;
    }

    if (existing) {
      await db.collection("about").updateOne({}, { $set: updateData });
    } else {
      updateData.createdAt = new Date();
      await db.collection("about").insertOne(updateData);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update about data" }, { status: 500 });
  }
}

