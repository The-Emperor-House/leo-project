"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


export async function upsertProject(formData: FormData) {
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
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}

export async function deleteProject(formData: FormData) {
  await prisma.project.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
}
