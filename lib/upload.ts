// FILE: apps/web/lib/upload.ts
// Uploads a file directly to Cloudinary using a signed URL from the backend.
// The Express backend never touches the file — only signs the upload request.

interface CloudinaryParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

/**
 * Upload file directly to Cloudinary.
 * Returns the secure_url of the uploaded file.
 */
export async function uploadToCloudinary(
  file: File,
  { signature, timestamp, cloudName, apiKey, folder }: CloudinaryParams
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}