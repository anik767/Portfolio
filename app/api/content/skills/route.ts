import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

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
    
    const skills = await db.collection("skills").find().sort({ order: 1 }).toArray();
    
    const serialized = skills.map((s) => ({
      ...s,
      _id: s._id.toString()
    }));

    return NextResponse.json({
      success: true,
      skills: serialized
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch skills" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { skills } = await request.json();

    if (!Array.isArray(skills)) {
      return NextResponse.json({ success: false, error: "Skills must be an array" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    // Delete all existing skills
    await db.collection("skills").deleteMany({});

    // Insert new skills
    type SkillInput = { name?: string; level?: number; order?: number };
    const skillsToInsert = skills.map((skill: SkillInput, index: number) => ({
      name: skill.name || "",
      level: skill.level || 0,
      order: skill.order !== undefined ? skill.order : index,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (skillsToInsert.length > 0) {
      await db.collection("skills").insertMany(skillsToInsert);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update skills" }, { status: 500 });
  }
}

