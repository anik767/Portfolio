import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Helper: extract Cloudinary public ID from URL
function extractPublicId(imageUrl?: string | null) {
  if (!imageUrl) return null;
  try {
    const withoutQuery = imageUrl.split("?")[0];
    const parts = withoutQuery.split("/");
    const uploadIndex = parts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) return null;
    const publicIdParts = parts.slice(uploadIndex + 1);
    const filename = publicIdParts.pop();
    if (!filename) return null;
    const baseName = filename.replace(/\.[^/.]+$/, "");
    publicIdParts.push(baseName);
    return publicIdParts.join("/");
  } catch (err) {
    console.error("Failed to extract Cloudinary public ID:", err);
    return null;
  }
}

// Helper: check admin auth via cookie
async function checkAuth() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
  return token === adminToken;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("mydb");

    if (id) {
      // Fetch single project
      const project = await db.collection("project").findOne({ _id: new ObjectId(id) });
      if (!project) return NextResponse.json({ success: false, error: "Project not found" });
      return NextResponse.json({ success: true, project: { ...project, _id: project._id.toString() } });
    } else {
      // Fetch all projects
      const projects = await db.collection("project").find().sort({ createdAt: -1 }).toArray();
      const serialized = projects.map((p) => ({ ...p, _id: p._id.toString() }));
      return NextResponse.json({ success: true, project: serialized });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch projects" });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as Blob | null;

    const technologiesStr = (formData.get("technologies") as string) || '';
    const featuresStr = (formData.get("features") as string) || '';
    const technologies = technologiesStr.split(",").map(s => s.trim()).filter(Boolean);
    const features = featuresStr.split(",").map(s => s.trim()).filter(Boolean);

    const liveUrl = (formData.get("liveUrl") as string) || '';
    const githubUrl = (formData.get("githubUrl") as string) || '';
    const status = (formData.get("status") as string) || 'Live';
    const category = (formData.get("category") as string) || 'Full Stack';

    if (!title || !description) return NextResponse.json({ success: false, error: "Title and description are required" });

    let imageUrl = "";
    let imagePublicId = "";

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "project" }, (err, result) => {
          if (err) return reject(err);
          resolve(result as { secure_url: string; public_id: string });
        });
        stream.end(buffer);
      });
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db.collection("project").insertOne({
      title,
      description,
      image: imageUrl,
      imagePublicId,
      technologies,
      features,
      liveUrl,
      githubUrl,
      status,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      project: { _id: result.insertedId.toString(), title, description, image: imageUrl, imagePublicId, technologies, features, liveUrl, githubUrl, status, category }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to create project" });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await checkAuth())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as Blob | null;

    const technologiesStr = (formData.get("technologies") as string) || '';
    const featuresStr = (formData.get("features") as string) || '';
    const technologies = technologiesStr.split(",").map(s => s.trim()).filter(Boolean);
    const features = featuresStr.split(",").map(s => s.trim()).filter(Boolean);

    const status = (formData.get("status") as string) || 'Live';
    const category = (formData.get("category") as string) || 'Full Stack';

    if (!id || !title || !description) return NextResponse.json({ success: false, error: "ID, title, and description are required" });

    const client = await clientPromise;
    const db = client.db("mydb");

    const existing = await db.collection("project").findOne({ _id: new ObjectId(id) });
    if (!existing) return NextResponse.json({ success: false, error: "Project not found" });

    let imageUrl = existing.image || "";
    let imagePublicId = existing.imagePublicId || extractPublicId(existing.image);

    if (image && image.size > 0) {
      if (imagePublicId) {
        try { await cloudinary.uploader.destroy(imagePublicId); } catch {}
      }
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "project" }, (err, result) => {
          if (err) return reject(err);
          resolve(result as { secure_url: string; public_id: string });
        });
        stream.end(buffer);
      });
      imageUrl = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    await db.collection("project").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, image: imageUrl, imagePublicId, technologies, features, status, category, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update project" });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAuth())) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: "Project ID is required" });

    const client = await clientPromise;
    const db = client.db("mydb");

    const existing = await db.collection("project").findOne({ _id: new ObjectId(id) });
    if (!existing) return NextResponse.json({ success: false, error: "Project not found" });

    await db.collection("project").deleteOne({ _id: new ObjectId(id) });

    const publicId = existing.imagePublicId || extractPublicId(existing.image);
    if (publicId) {
      try { await cloudinary.uploader.destroy(publicId); } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to delete project" });
  }
}
