"use server";

import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function upsertUser(formData: FormData) {
  const id = formData.get("id") as string | null;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  if (id) {
    const data: Record<string, string> = { email, name, role };
    if (password) data.password = await hash(password, 10);
    await prisma.user.update({ where: { id }, data });
  } else {
    if (!password) throw new Error("Password required");
    await prisma.user.create({
      data: { email, name, role, password: await hash(password, 10) },
    });
  }
  revalidatePath("/admin/users");
}

export async function deleteUser(formData: FormData) {
  await prisma.user.delete({ where: { id: formData.get("id") as string } });
  revalidatePath("/admin/users");
}
