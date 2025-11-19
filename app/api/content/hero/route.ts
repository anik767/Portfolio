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
    
    const hero = await db.collection("hero").findOne({});
    
    if (!hero) {
      return NextResponse.json({
        success: true,
        hero: null
      });
    }

    return NextResponse.json({
      success: true,
      hero: {
        ...hero,
        _id: hero._id.toString()
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch hero data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const greeting = formData.get("greeting") as string;
    const name = formData.get("name") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const bannerBackgroundImage = formData.get("bannerBackgroundImage") as Blob | null;
    const personImage = formData.get("personImage") as Blob | null;
    const experience = formData.get("experience") as string;
    const resumeUrl = formData.get("resumeUrl") as string;
    
    // Social links
    const facebook = formData.get("facebook") as string;
    const instagram = formData.get("instagram") as string;
    const linkedin = formData.get("linkedin") as string;
    const twitter = formData.get("twitter") as string;
    const github = formData.get("github") as string;

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

    let bannerImageUrl = "";
    let personImageUrl = "";

    // Upload banner background image if provided
    if (bannerBackgroundImage && bannerBackgroundImage.size > 0) {
      const buffer = Buffer.from(await bannerBackgroundImage.arrayBuffer());
      const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "hero" }, (err, result) => {
          if (err) return reject(err);
          resolve(result as { secure_url: string; public_id: string });
        });
        stream.end(buffer);
      });
      bannerImageUrl = uploaded.secure_url;
    }

    // Upload person image if provided
    if (personImage && personImage.size > 0) {
      const buffer = Buffer.from(await personImage.arrayBuffer());
      const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "hero" }, (err, result) => {
          if (err) return reject(err);
          resolve(result as { secure_url: string; public_id: string });
        });
        stream.end(buffer);
      });
      personImageUrl = uploaded.secure_url;
    }

    // Get existing hero data
    const existing = await db.collection("hero").findOne({});
    
    type HeroUpdateData = {
      greeting: string;
      name: string;
      title: string;
      description: string[];
      experience: string;
      resumeUrl: string;
      socialLinks: {
        facebook: string;
        instagram: string;
        linkedin: string;
        twitter: string;
        github: string;
      };
      updatedAt: Date;
      bannerBackgroundImage?: string;
      personImage?: string;
      createdAt?: Date;
    };
    
    const updateData: HeroUpdateData = {
      greeting: greeting || "",
      name: name || "",
      title: title || "",
      description: descriptionArray,
      experience: experience || "",
      resumeUrl: resumeUrl || "",
      socialLinks: {
        facebook: facebook || "",
        instagram: instagram || "",
        linkedin: linkedin || "",
        twitter: twitter || "",
        github: github || ""
      },
      updatedAt: new Date()
    };

    if (bannerImageUrl) {
      updateData.bannerBackgroundImage = bannerImageUrl;
    } else if (existing?.bannerBackgroundImage) {
      updateData.bannerBackgroundImage = existing.bannerBackgroundImage;
    }

    if (personImageUrl) {
      updateData.personImage = personImageUrl;
    } else if (existing?.personImage) {
      updateData.personImage = existing.personImage;
    }

    if (existing) {
      await db.collection("hero").updateOne({}, { $set: updateData });
    } else {
      updateData.createdAt = new Date();
      await db.collection("hero").insertOne(updateData);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update hero data" }, { status: 500 });
  }
}

