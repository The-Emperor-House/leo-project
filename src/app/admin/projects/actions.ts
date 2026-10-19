"use server";

import { collectImageUrls, deleteCloudinaryImages } from "@/lib/cloudinary-cleanup";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidateLocalized } from "@/lib/revalidate";
import { revalidatePath } from "next/cache";

export async function upsertProject(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const images = formData.getAll("images") as string[];
  const data = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    location: (formData.get("location") as string) || null,
    description: (formData.get("description") as string) || null,
    coverImage: (formData.get("coverImage") as string) || null,
    images: images.length ? JSON.stringify(images.filter(Boolean)) : null,
    style: (formData.get("style") as string) || null,
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    order: Number(formData.get("order") ?? 0),
  };
  if (id) {
    const before = await prisma.project.findUniqueOrThrow({ where: { id } });
    const after = await prisma.project.update({ where: { id }, data });
    const kept = new Set(collectImageUrls(after, "coverImage"));
    await deleteCloudinaryImages(collectImageUrls(before, "coverImage").filter((u) => !kept.has(u)));
    revalidateLocalized(`/projects/${before.slug}`);
  } else {
    await prisma.project.create({ data });
  }
  revalidatePath("/admin/projects");
  revalidateLocalized("/projects", `/projects/${data.slug}`);
}

export async function deleteProject(formData: FormData) {
  await requireAdmin();
  const project = await prisma.project.delete({ where: { id: formData.get("id") as string } });
  await deleteCloudinaryImages(collectImageUrls(project, "coverImage"));
  revalidatePath("/admin/projects");
  revalidateLocalized("/projects", `/projects/${project.slug}`);
}
