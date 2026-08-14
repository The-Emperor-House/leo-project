"use server";

import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const UPLOAD_TIMEOUT_MS = 30_000;

export async function uploadImage(formData: FormData): Promise<{ url: string }> {
  const file = formData.get("file") as File;
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
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.inquiry.update({ where: { id }, data: { status, read: true } });
  revalidatePath("/admin/inquiries");
}

export async function deleteProduct(formData: FormData) {
  await prisma.product.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/products");
  revalidatePath("/en/collections");
  revalidatePath("/th/collections");
}

export async function upsertProduct(formData: FormData) {
  const id = formData.get("id") as string | null;
  const images = formData.getAll("images") as string[];
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
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }
  revalidatePath("/admin/products");
  revalidatePath("/en/collections");
  revalidatePath("/th/collections");
}
