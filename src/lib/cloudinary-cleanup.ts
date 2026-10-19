import { cloudinary } from "./cloudinary";

const UPLOAD_FOLDER = "leoangelo";

// https://res.cloudinary.com/<cloud>/image/upload/v123/leoangelo/abc.jpg -> leoangelo/abc
function publicIdFromUrl(url: string): string | null {
  const m = url.match(/^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\/(?:[^/]+\/)*?(?:v\d+\/)?(leoangelo\/[^.]+)\.[a-z0-9]+$/i);
  if (!m || m[1] !== process.env.CLOUDINARY_CLOUD_NAME) return null;
  return m[2].startsWith(`${UPLOAD_FOLDER}/`) ? m[2] : null;
}

export function collectImageUrls(record: { images: string | null } & Record<string, unknown>, mainField: string): string[] {
  const main = record[mainField];
  const gallery: string[] = record.images ? JSON.parse(record.images) : [];
  return [typeof main === "string" ? main : null, ...gallery].filter(Boolean) as string[];
}

// Best-effort: a failed delete only leaves an orphan file, so it never throws.
export async function deleteCloudinaryImages(urls: string[]) {
  const ids = [...new Set(urls.map(publicIdFromUrl).filter(Boolean) as string[])];
  if (ids.length === 0) return;
  try {
    await cloudinary.api.delete_resources(ids, { resource_type: "image" });
  } catch (err) {
    console.error("Cloudinary cleanup failed", err);
  }
}
