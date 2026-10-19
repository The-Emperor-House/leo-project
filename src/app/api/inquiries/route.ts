import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 120, email: 200, phone: 40, interest: 40, message: 5000 };

// Per-instance limiter: on serverless each instance keeps its own window, so this
// slows down bursts from one client rather than enforcing a strict global cap.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
  }
  return recent.length > RATE_MAX;
}

function str(v: unknown) {
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    // Honeypot: a hidden field real users never fill in
    if (str(body.website)) return NextResponse.json({ ok: true });

    const name = str(body.name);
    const email = str(body.email);
    const phone = str(body.phone);
    const interest = str(body.interest);
    const message = str(body.message);

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (body.consent !== true) {
      return NextResponse.json({ error: "Consent required" }, { status: 400 });
    }
    if (
      !EMAIL_RE.test(email) ||
      name.length > LIMITS.name || email.length > LIMITS.email || phone.length > LIMITS.phone ||
      interest.length > LIMITS.interest || message.length > LIMITS.message
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: { name, email, phone: phone || null, interest: interest || null, message, consentAt: new Date() },
    });
    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
