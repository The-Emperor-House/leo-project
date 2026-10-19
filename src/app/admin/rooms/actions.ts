"use server";

import { deleteCloudinaryImages } from "@/lib/cloudinary-cleanup";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidateRooms } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function upsertRoom(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const productIds = (formData.getAll("productIds") as string[]).filter(Boolean);
  const data = {
    slug: (formData.get("slug") as string).trim(),
    nameEn: (formData.get("nameEn") as string).trim(),
    nameTh: (formData.get("nameTh") as string).trim(),
    descriptionEn: (formData.get("descriptionEn") as string)?.trim() || null,
    descriptionTh: (formData.get("descriptionTh") as string)?.trim() || null,
    coverImage: (formData.get("coverImage") as string) || null,
    published: formData.get("published") === "on",
    order: Number(formData.get("order") ?? 0),
  };

  if (!data.nameEn || !data.nameTh) return { error: "กรุณาใส่ชื่อห้องทั้งภาษาอังกฤษและภาษาไทย" };
  if (!SLUG_RE.test(data.slug)) return { error: "Slug ใช้ได้เฉพาะ a-z, 0-9 และ - เช่น living-room" };
  const duplicate = await prisma.room.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (duplicate && duplicate.id !== id) return { error: "Slug นี้มีห้องอื่นใช้แล้ว" };

  const products = { set: productIds.map((pid) => ({ id: pid })) };
  if (id) {
    const before = await prisma.room.findUniqueOrThrow({ where: { id } });
    await prisma.room.update({ where: { id }, data: { ...data, products } });
    if (before.coverImage && before.coverImage !== data.coverImage) {
      await deleteCloudinaryImages([before.coverImage]);
    }
  } else {
    await prisma.room.create({ data: { ...data, products: { connect: products.set } } });
  }
  revalidatePath("/admin/rooms");
  revalidatePath("/admin/products");
  revalidateRooms();
  return {};
}

export async function deleteRoom(formData: FormData) {
  await requireAdmin();
  // Deleting a room only unlinks its products; the products themselves stay.
  const room = await prisma.room.delete({ where: { id: formData.get("id") as string } });
  if (room.coverImage) await deleteCloudinaryImages([room.coverImage]);
  revalidatePath("/admin/rooms");
  revalidatePath("/admin/products");
  revalidateRooms();
}
