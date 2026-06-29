import { prisma } from "@/lib/prisma";
import { InquiriesClient } from "./InquiriesClient";

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1 font-display">Inquiries</h1>
      <p className="text-sm text-muted-foreground mb-8">คำถามและข้อความจากลูกค้า</p>
      <InquiriesClient inquiries={inquiries} />
    </div>
  );
}
