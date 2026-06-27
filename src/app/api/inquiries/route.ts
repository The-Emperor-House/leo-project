import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, interest, message } = body;
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const inquiry = await prisma.inquiry.create({
      data: { name, email, phone: phone || null, interest: interest || null, message },
    });
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
