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

type ContactCardInput = {
  title?: string;
  value?: string;
  description?: string;
  icon?: string;
  actionType?: "email" | "phone" | "link" | "none";
  actionTarget?: string;
  order?: number;
};

type SocialLinkInput = {
  platform?: string;
  url?: string;
};

const sanitizeCard = (item: ContactCardInput, index: number) => ({
  title: item.title?.trim() || "",
  value: item.value?.trim() || "",
  description: item.description?.trim() || "",
  icon: item.icon?.trim() || "mail",
  actionType: item.actionType || "none",
  actionTarget: item.actionTarget?.trim() || "",
  order: typeof item.order === "number" ? item.order : index,
});

const sanitizeSocialLink = (item: SocialLinkInput) => ({
  platform: item.platform?.trim() || "",
  url: item.url?.trim() || "",
});

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");
    const doc = await db.collection("content").findOne({ type: "contact" });

    const cards = Array.isArray(doc?.cards)
      ? doc.cards.filter(
          (card: ContactCardInput) =>
            (card?.title && card.title.trim()) ||
            (card?.value && card.value.trim()) ||
            (card?.description && card.description.trim())
        )
      : [];

    const socialLinks = Array.isArray(doc?.socialLinks)
      ? doc.socialLinks.filter(
          (link: SocialLinkInput) => link?.platform?.trim() && link?.url?.trim()
        )
      : [];

    return NextResponse.json({
      success: true,
      heading: doc?.heading ?? "Get In Touch",
      subheading:
        doc?.subheading ??
        "Ready to start your next project? I'd love to hear from you.",
      cards,
      socialLinks,
    });
  } catch (error) {
    console.error("Contact GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact data" },
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
      typeof body.heading === "string" ? body.heading.trim() : "Get In Touch";
    const subheading =
      typeof body.subheading === "string" ? body.subheading.trim() : "";
    const cardsInput: ContactCardInput[] = Array.isArray(body.cards)
      ? body.cards
      : [];
    const socialLinksInput: SocialLinkInput[] = Array.isArray(body.socialLinks)
      ? body.socialLinks
      : [];

    const cards = cardsInput
      .map((card, index) => sanitizeCard(card, index))
      .filter((card) => card.title || card.value || card.description);

    const socialLinks = socialLinksInput
      .map((link) => sanitizeSocialLink(link))
      .filter((link) => link.platform && link.url);

    const client = await clientPromise;
    const db = client.db("mydb");

    await db.collection("content").updateOne(
      { type: "contact" },
      {
        $set: {
          type: "contact",
          heading,
          subheading,
          cards,
          socialLinks,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact data" },
      { status: 500 }
    );
  }
}


