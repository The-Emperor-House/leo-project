import { prisma } from "@/lib/prisma";
import { MessageSquare, Package, InboxIcon } from "lucide-react";
import Link from "next/link";

type InquiryRow = {
  id: string; name: string; email: string; interest: string | null;
  status: string; createdAt: Date;
};

export default async function AdminDashboard() {
  const [totalInquiries, newInquiries, totalProducts] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.product.count(),
  ]);

  const recentInquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Inquiries ทั้งหมด", value: totalInquiries, icon: MessageSquare, href: "/admin/inquiries" },
    { label: "Inquiries ใหม่", value: newInquiries, icon: InboxIcon, href: "/admin/inquiries", highlight: true },
    { label: "สินค้าทั้งหมด", value: totalProducts, icon: Package, href: "/admin/products" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Dashboard
      </h1>
      <p className="text-sm text-muted-foreground mb-8">ภาพรวม LeoAngelo Admin</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <div className={`rounded-xl border p-5 flex items-center gap-4 hover:bg-secondary/50 transition-colors ${s.highlight && s.value > 0 ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.highlight && s.value > 0 ? "bg-primary/15" : "bg-secondary"}`}>
                <s.icon className={`w-5 h-5 ${s.highlight && s.value > 0 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">Inquiries ล่าสุด</h2>
          <Link href="/admin/inquiries" className="text-xs text-primary hover:underline">ดูทั้งหมด →</Link>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          {recentInquiries.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">ยังไม่มี inquiry</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">สนใจ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {(recentInquiries as InquiryRow[]).map((inq) => (
                  <tr key={inq.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 font-medium">{inq.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inq.interest || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${inq.status === "NEW" ? "bg-primary/15 text-primary" : inq.status === "CONTACTED" ? "bg-blue-500/15 text-blue-600" : "bg-secondary text-muted-foreground"}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(inq.createdAt).toLocaleDateString("th-TH")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
