'use client';

export type UploadedImage = {
  url: string;
  publicId?: string;
};

export async function uploadDashboardImage(file: File, folder: string): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Image upload failed");
  }

  return {
    url: data.url,
    publicId: data.publicId,
  };
}


