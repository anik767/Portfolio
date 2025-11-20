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
    const metaDoc = await db.collection("content").findOne({ type: "services" });
    
    const serialized = services.map((s) => ({
      ...s,
      _id: s._id.toString()
    }));

    return NextResponse.json({
      success: true,
      services: serialized,
      meta: {
        heading: metaDoc?.heading ?? "My Services",
        subheading:
          metaDoc?.subheading ??
          "I offer a comprehensive range of development and design services to help bring your ideas to life and grow your business.",
        ctaHeading: metaDoc?.ctaHeading ?? "Ready to Start Your Project?",
        ctaDescription:
          metaDoc?.ctaDescription ??
          "Let's discuss your requirements and create something amazing together. I'm here to help you achieve your goals.",
        ctaButtonLabel: metaDoc?.ctaButtonLabel ?? "Get Started Today",
      },
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

    const { services, meta } = await request.json();

    if (!Array.isArray(services)) {
      return NextResponse.json({ success: false, error: "Services must be an array" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("mydb");

    // Delete all existing services
    await db.collection("services").deleteMany({});

    // Insert new services
    type ServiceInput = {
      title?: string;
      description?: string;
      features?: string[];
      icon?: string;
      iconPublicId?: string;
      order?: number;
    };
    const servicesToInsert = services.map((service: ServiceInput, index: number) => ({
      title: service.title || "",
      description: service.description || "",
      features: Array.isArray(service.features) ? service.features : [],
      icon: service.icon || "",
      iconPublicId: typeof service.iconPublicId === "string" ? service.iconPublicId : "",
      order: service.order !== undefined ? service.order : index,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    if (servicesToInsert.length > 0) {
      await db.collection("services").insertMany(servicesToInsert);
    }

    const sanitizedMeta = {
      heading: typeof meta?.heading === "string" ? meta.heading.trim() : "My Services",
      subheading: typeof meta?.subheading === "string" ? meta.subheading.trim() : "",
      ctaHeading: typeof meta?.ctaHeading === "string" ? meta.ctaHeading.trim() : "",
      ctaDescription: typeof meta?.ctaDescription === "string" ? meta.ctaDescription.trim() : "",
      ctaButtonLabel:
        typeof meta?.ctaButtonLabel === "string" ? meta.ctaButtonLabel.trim() : "Get Started Today",
    };

    await db.collection("content").updateOne(
      { type: "services" },
      {
        $set: {
          type: "services",
          ...sanitizedMeta,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to update services" }, { status: 500 });
  }
}

