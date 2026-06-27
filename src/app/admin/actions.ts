"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateInquiryStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await prisma.inquiry.update({ where: { id }, data: { status, read: true } });
  revalidatePath("/admin/inquiries");
}

export async function deleteProduct(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function upsertProduct(formData: FormData) {
  const id = formData.get("id") as string | null;
  const data = {
    title: formData.get("title") as string,
    category: formData.get("category") as string,
    description: formData.get("description") as string,
    imageUrl: (formData.get("imageUrl") as string) || null,
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
}
