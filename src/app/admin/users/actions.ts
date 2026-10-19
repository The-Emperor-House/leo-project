"use server";

import { prisma } from "@/lib/prisma";
import { ADMIN_ROLES } from "@/lib/auth.config";
import { requireAdmin } from "@/lib/require-admin";
import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function upsertUser(formData: FormData): Promise<{ error?: string }> {
  await requireAdmin();
  const id = formData.get("id") as string | null;
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  if (!ADMIN_ROLES.includes(role)) return { error: "Role ไม่ถูกต้อง" };
  if (password && password.length < 8) return { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" };

  const duplicate = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (duplicate && duplicate.id !== id) return { error: "Email นี้มีอยู่แล้ว" };

  if (id) {
    const data: Record<string, string> = { email, name, role };
    if (password) data.password = await hash(password, 10);
    await prisma.user.update({ where: { id }, data });
  } else {
    if (!password) return { error: "กรุณาใส่รหัสผ่าน" };
    await prisma.user.create({
      data: { email, name, role, password: await hash(password, 10) },
    });
  }
  revalidatePath("/admin/users");
  return {};
}

export async function deleteUser(formData: FormData): Promise<{ error?: string }> {
  const session = await requireAdmin();
  const id = formData.get("id") as string;
  const target = await prisma.user.findUnique({ where: { id }, select: { email: true } });
  if (!target) return { error: "ไม่พบ User นี้" };
  if (target.email === session.user?.email) return { error: "ไม่สามารถลบบัญชีของตัวเองได้" };
  if ((await prisma.user.count()) <= 1) return { error: "ต้องมี User อย่างน้อย 1 บัญชี" };
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return {};
}
