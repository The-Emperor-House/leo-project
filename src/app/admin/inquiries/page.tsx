import { prisma } from "@/lib/prisma";
import { InquiriesClient } from "./InquiriesClient";
import Link from "next/link";

const PAGE_SIZE = 15;

const STATUS_TABS = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "NEW",       label: "ใหม่" },
  { value: "CONTACTED", label: "ติดต่อแล้ว" },
  { value: "CLOSED",    label: "ปิด" },
];

export default async function InquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const status = sp.status;

  const where = status ? { status } : {};

  const [inquiries, total, statusGroups] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.inquiry.count({ where }),
    prisma.inquiry.groupBy({ by: ["status"], _count: { id: true } }),
  ]);

  const statusCounts = Object.fromEntries(statusGroups.map((g) => [g.status, g._count.id]));
  const totalAll = Object.values(statusCounts).reduce((s, n) => s + n, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold font-display">Inquiries</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">คำถามและข้อความจากลูกค้า</p>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => {
          const active = tab.value === status;
          const count = tab.value ? (statusCounts[tab.value] ?? 0) : totalAll;
          const href = tab.value ? `/admin/inquiries?status=${tab.value}` : "/admin/inquiries";
          return (
            <Link key={tab.value ?? "all"} href={href}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${active ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-border"}`}>{count}</span>
            </Link>
          );
        })}
      </div>

      <InquiriesClient
        inquiries={inquiries}
        total={total}
        page={page}
        totalPages={Math.ceil(total / PAGE_SIZE)}
        currentStatus={status}
      />
    </div>
  );
}
