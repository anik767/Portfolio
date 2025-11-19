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
    
    const services = await db.collection("services").find().sort({ order: 1 }).toArray();
    
    const serialized = services.map((s) => ({
      ...s,
      _id: s._id.toString()
    }));

    return NextResponse.json({
      success: true,
      services: serialized
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { services } = await request.json();

    if (!Array.isArray(services)) {
      return NextResponse.json({ success: false, error: "Services must be an array" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    // Delete all existing services
    await db.collection("services").deleteMany({});

    // Insert new services
    type ServiceInput = { title?: string; description?: string; features?: string[]; icon?: string; order?: number };
    const servicesToInsert = services.map((service: ServiceInput, index: number) => ({
      title: service.title || "",
      description: service.description || "",
      features: Array.isArray(service.features) ? service.features : [],
      icon: service.icon || "code",
      order: service.order !== undefined ? service.order : index,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (servicesToInsert.length > 0) {
      await db.collection("services").insertMany(servicesToInsert);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update services" }, { status: 500 });
  }
}

