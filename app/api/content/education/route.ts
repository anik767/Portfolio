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

type EducationInput = {
  institution?: string;
  degree?: string;
  duration?: string;
  location?: string;
  logo?: string;
  gpa?: string;
  description?: string;
  courses?: string[];
  achievements?: string[];
  order?: number;
};

type CertificationInput = {
  name?: string;
  issuer?: string;
  date?: string;
  credentialId?: string;
  logo?: string;
  description?: string;
  skills?: string[];
  order?: number;
};

const sanitizeArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
};

const sanitizeEducation = (item: EducationInput, index: number) => ({
  institution: item.institution?.trim() || "",
  degree: item.degree?.trim() || "",
  duration: item.duration?.trim() || "",
  location: item.location?.trim() || "",
  logo: item.logo?.trim() || "",
  gpa: item.gpa?.trim() || "",
  description: item.description?.trim() || "",
  courses: sanitizeArray(item.courses),
  achievements: sanitizeArray(item.achievements),
  order: typeof item.order === "number" ? item.order : index,
});

const sanitizeCertification = (item: CertificationInput, index: number) => ({
  name: item.name?.trim() || "",
  issuer: item.issuer?.trim() || "",
  date: item.date?.trim() || "",
  credentialId: item.credentialId?.trim() || "",
  logo: item.logo?.trim() || "",
  description: item.description?.trim() || "",
  skills: sanitizeArray(item.skills),
  order: typeof item.order === "number" ? item.order : index,
});

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const doc = await db.collection("content").findOne({ type: "education" });

    return NextResponse.json({
      success: true,
      heading: doc?.heading ?? "Education & Certifications",
      subheading:
        doc?.subheading ??
        "My educational background and professional certifications that validate my expertise.",
      educationHeading: doc?.educationHeading ?? "Education",
      certificationsHeading:
        doc?.certificationsHeading ?? "Professional Certifications",
      education: doc?.education ?? [],
      certifications: doc?.certifications ?? [],
    });
  } catch (error) {
    console.error("Education GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch education data" },
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
      typeof body.heading === "string"
        ? body.heading.trim()
        : "Education & Certifications";
    const subheading =
      typeof body.subheading === "string" ? body.subheading.trim() : "";
    const educationHeading =
      typeof body.educationHeading === "string"
        ? body.educationHeading.trim()
        : "Education";
    const certificationsHeading =
      typeof body.certificationsHeading === "string"
        ? body.certificationsHeading.trim()
        : "Professional Certifications";

    const educationInput: EducationInput[] = Array.isArray(body.education)
      ? body.education
      : [];
    const certificationsInput: CertificationInput[] = Array.isArray(
      body.certifications
    )
      ? body.certifications
      : [];

    const education = educationInput
      .map((item, index) => sanitizeEducation(item, index))
      .filter((item) => item.institution || item.degree || item.description);

    const certifications = certificationsInput
      .map((item, index) => sanitizeCertification(item, index))
      .filter((item) => item.name || item.issuer || item.description);

    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("content").updateOne(
      { type: "education" },
      {
        $set: {
          type: "education",
          heading,
          subheading,
          educationHeading,
          certificationsHeading,
          education,
          certifications,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Education POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update education data" },
      { status: 500 }
    );
  }
}


