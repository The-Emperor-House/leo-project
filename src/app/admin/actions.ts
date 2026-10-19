"use server";

import { cloudinary } from "@/lib/cloudinary";
import { collectImageUrls, deleteCloudinaryImages } from "@/lib/cloudinary-cleanup";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidateLocalized, revalidateRooms } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";

const UPLOAD_TIMEOUT_MS = 30_000;
const INQUIRY_STATUSES = ["NEW", "CONTACTED", "CLOSED"];

export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  await requireAdmin();
  const file = formData.get("file");
  if (!(file instanceof File) || !file.type.startsWith("image/")) {
    throw new Error("Invalid image file");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const upload = new Promise<{ url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "leoangelo", resource_type: "image" }, (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve({ url: result.secure_url });
      })
      .end(buffer);
  });
  const timeout = new Promise<{ url: string }>((_, reject) =>
    setTimeout(() => reject(new Error("Upload timed out")), UPLOAD_TIMEOUT_MS)
  );
  return Promise.race([upload, timeout]);
}

export async function updateInquiryStatus(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  if (!INQUIRY_STATUSES.includes(status)) throw new Error("Invalid status");
  await prisma.inquiry.update({ where: { id }, data: { status, read: true } });
  revalidatePath("/admin/inquiries");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const product = await prisma.product.delete({ where: { id: formData.get("id") as string } });
  await deleteCloudinaryImages(collectImageUrls(product, "imageUrl"));
  revalidatePath("/admin/products");
  revalidatePath("/admin/rooms");
  revalidateLocalized("/collections");
  revalidateRooms();
}

export async function upsertProduct(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const images = formData.getAll("images") as string[];
  const roomIds = (formData.getAll("roomIds") as string[]).filter(Boolean);
  const data = {
    title: formData.get("title") as string,
    line: formData.get("line") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    imageUrl: (formData.get("imageUrl") as string) || null,
    images: images.length ? JSON.stringify(images.filter(Boolean)) : null,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    order: Number(formData.get("order") ?? 0),
  };
  if (id) {
    const before = await prisma.product.findUniqueOrThrow({ where: { id } });
    const after = await prisma.product.update({
      where: { id },
      data: { ...data, rooms: { set: roomIds.map((rid) => ({ id: rid })) } },
    });
    const kept = new Set(collectImageUrls(after, "imageUrl"));
    await deleteCloudinaryImages(collectImageUrls(before, "imageUrl").filter((u) => !kept.has(u)));
  } else {
    await prisma.product.create({ data: { ...data, rooms: { connect: roomIds.map((rid) => ({ id: rid })) } } });
  }
  revalidatePath("/admin/products");
  revalidatePath("/admin/rooms");
  revalidateLocalized("/collections");
  revalidateRooms();
}
