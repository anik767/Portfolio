import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function checkAuth() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  const adminToken = process.env.ADMIN_TOKEN || "admin-secret-token";
  return token === adminToken;
}

type ExperienceItemInput = {
  company?: string;
  position?: string;
  duration?: string;
  location?: string;
  logo?: string;
  description?: string;
  technologies?: string[];
  achievements?: string[];
  order?: number;
};

function sanitizeArray(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((val) => (typeof val === "string" ? val.trim() : ""))
    .filter(Boolean);
}

function sanitizeItem(item: ExperienceItemInput, index: number) {
  return {
    company: item.company?.trim() || "",
    position: item.position?.trim() || "",
    duration: item.duration?.trim() || "",
    location: item.location?.trim() || "",
    logo: item.logo?.trim() || "",
    description: item.description?.trim() || "",
    technologies: sanitizeArray(item.technologies || []),
    achievements: sanitizeArray(item.achievements || []),
    order: typeof item.order === "number" ? item.order : index,
  };
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const doc = await db.collection("content").findOne({ type: "experience" });

    return NextResponse.json({
      success: true,
      heading: doc?.heading ?? "Work Experience",
      subheading:
        doc?.subheading ??
        "My professional journey in web development, from junior developer to senior engineer.",
      items: doc?.items ?? [],
    });
  } catch (error) {
    console.error("Experience GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch experience data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const heading =
      typeof body.heading === "string" ? body.heading.trim() : "Work Experience";
    const subheading =
      typeof body.subheading === "string" ? body.subheading.trim() : "";
    const itemsInput: ExperienceItemInput[] = Array.isArray(body.items)
      ? body.items
      : [];
    const sanitizedItems = itemsInput
      .map((item, index) => sanitizeItem(item, index))
      .filter((item) => item.company || item.position || item.description);

    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("content").updateOne(
      { type: "experience" },
      {
        $set: {
          type: "experience",
          heading,
          subheading,
          items: sanitizedItems,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Experience POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update experience data" },
      { status: 500 }
    );
  }
}


