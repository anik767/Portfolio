import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const status = formData.get("status") === "true" ? 1 : 0;
    const file = formData.get("avatar") as Blob;

    if (!name || !file) {
      return NextResponse.json({ success: false, error: "Name and image required" });
    }

    // Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload image to Cloudinary using upload_stream
    const uploaded: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "users" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    // Insert user into MongoDB
    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db.collection("users").insertOne({
      name,
      status,
      avatar: uploaded.secure_url, // store Cloudinary URL
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

// GET → fetch all users
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("mydb");

    const users = await db.collection("users").find().toArray();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error });
  }
}

// DELETE → delete a user by _id
import { ObjectId } from "mongodb";
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: "ID is required" });

    const client = await clientPromise;
    const db = client.db("mydb");

    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return NextResponse.json({ success: false, error: "User not found" });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
