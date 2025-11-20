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

type QuickLinkInput = {
  label?: string;
  target?: string;
};

type SocialLinkInput = {
  platform?: string;
  url?: string;
};

type FooterContactInput = {
  email?: string;
  phone?: string;
  location?: string;
};

type FooterContentInput = {
  logoUrl?: string;
  logoPublicId?: string;
  name?: string;
  tagline?: string;
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const doc = await db.collection("content").findOne({ type: "footer" });

    return NextResponse.json({
      success: true,
      brand: doc?.brand ?? {
        logoUrl: "",
        name: "",
        tagline: "",
      },
      quickLinks: doc?.quickLinks ?? [],
      socialLinks: doc?.socialLinks ?? [],
      contact: doc?.contact ?? {
        email: "",
        phone: "",
        location: "",
      },
    });
  } catch (error) {
    console.error("Footer GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch footer content" },
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

    const brand: FooterContentInput = body.brand ?? {};
    const quickLinks: QuickLinkInput[] = Array.isArray(body.quickLinks)
      ? body.quickLinks
      : [];
    const socialLinks: SocialLinkInput[] = Array.isArray(body.socialLinks)
      ? body.socialLinks
      : [];
    const contact: FooterContactInput = body.contact ?? {};

    const sanitizedQuickLinks = quickLinks
      .map((link) => ({
        label: link.label?.trim() || "",
        target: link.target?.trim() || "",
      }))
      .filter((link) => link.label && link.target);

    const sanitizedSocialLinks = socialLinks
      .map((link) => ({
        platform: link.platform?.trim() || "",
        url: link.url?.trim() || "",
      }))
      .filter((link) => link.platform && link.url);

    const sanitizedContact = {
      email: contact.email?.trim() || "",
      phone: contact.phone?.trim() || "",
      location: contact.location?.trim() || "",
    };

    const sanitizedBrand = {
      logoUrl: brand.logoUrl?.trim() || "",
      logoPublicId: brand.logoPublicId?.trim() || "",
      name: brand.name?.trim() || "",
      tagline: brand.tagline?.trim() || "",
    };

    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("content").updateOne(
      { type: "footer" },
      {
        $set: {
          type: "footer",
          brand: sanitizedBrand,
          quickLinks: sanitizedQuickLinks,
          socialLinks: sanitizedSocialLinks,
          contact: sanitizedContact,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Footer POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update footer content" },
      { status: 500 }
    );
  }
}


