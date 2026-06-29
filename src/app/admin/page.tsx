import { prisma } from "@/lib/prisma";
import { MessageSquare, Package, FileImage, Inbox, Plus, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  NEW:       { label: "ใหม่",       className: "bg-primary/15 text-primary" },
  CONTACTED: { label: "ติดต่อแล้ว", className: "bg-blue-500/15 text-blue-600" },
  CLOSED:    { label: "ปิดแล้ว",    className: "bg-secondary text-muted-foreground" },
};

const CATEGORY_LABELS: Record<string, string> = {
  living: "Living Room", dining: "Dining Room", bedroom: "Bedroom",
  working: "Working Room", lighting: "Lighting", ornament: "Ornament",
};

export default async function AdminDashboard() {
  const [
    totalInquiries, newInquiries, contactedInquiries, closedInquiries,
    totalProducts, featuredProducts,
    totalProjects, publishedProjects,
    recentInquiries, productsByCategory,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.inquiry.count({ where: { status: "CONTACTED" } }),
    prisma.inquiry.count({ where: { status: "CLOSED" } }),
    prisma.product.count(),
    prisma.product.count({ where: { featured: true } }),
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, name: true, interest: true, status: true, createdAt: true } }),
    prisma.product.groupBy({ by: ["category"], _count: { id: true }, orderBy: { category: "asc" } }),
  ]);

  const maxCategoryCount = Math.max(...productsByCategory.map((c) => c._count.id), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1 font-display">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("th-TH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        {newInquiries > 0 && (
          <Link href="/admin/inquiries"
            className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary text-xs font-medium px-3 py-2 rounded-lg hover:bg-primary/15 transition-colors">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            มี {newInquiries} inquiry ใหม่
          </Link>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/inquiries?status=NEW">
          <div className={`rounded-xl border p-5 hover:shadow-sm transition-all ${newInquiries > 0 ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${newInquiries > 0 ? "bg-primary/15" : "bg-secondary"}`}>
                <Inbox className={`w-4 h-4 ${newInquiries > 0 ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              {newInquiries > 0 && <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">ใหม่</span>}
            </div>
            <p className="text-3xl font-bold mb-0.5">{newInquiries}</p>
            <p className="text-xs text-muted-foreground">Inquiries ที่ยังไม่ได้ติดต่อ</p>
          </div>
        </Link>

        <Link href="/admin/inquiries">
          <div className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="text-3xl font-bold mb-0.5">{totalInquiries}</p>
            <p className="text-xs text-muted-foreground">Inquiries ทั้งหมด</p>
          </div>
        </Link>

        <Link href="/admin/products">
          <div className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <Package className="w-4 h-4 text-muted-foreground" />
              </div>
              {featuredProducts > 0 && (
                <span className="text-[10px] text-muted-foreground">★ {featuredProducts} แนะนำ</span>
              )}
            </div>
            <p className="text-3xl font-bold mb-0.5">{totalProducts}</p>
            <p className="text-xs text-muted-foreground">สินค้าทั้งหมด</p>
          </div>
        </Link>

        <Link href="/admin/projects">
          <div className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <FileImage className="w-4 h-4 text-muted-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">{publishedProjects} published</span>
            </div>
            <p className="text-3xl font-bold mb-0.5">{totalProjects}</p>
            <p className="text-xs text-muted-foreground">Projects ทั้งหมด</p>
          </div>
        </Link>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent inquiries */}
        <div className="lg:col-span-2 rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold">Inquiries ล่าสุด</h2>
            <Link href="/admin/inquiries" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
              ดูทั้งหมด <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentInquiries.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">ยังไม่มี inquiry</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 border-b border-border">
                <tr>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">ชื่อ</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">สนใจ</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">สถานะ</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-muted-foreground">วันที่</th>
                </tr>
              </thead>
              <tbody>
                {recentInquiries.map((inq) => {
                  const st = STATUS_CONFIG[inq.status] ?? { label: inq.status, className: "bg-secondary text-muted-foreground" };
                  return (
                    <tr key={inq.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                      <td className="px-5 py-3 font-medium">{inq.name}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{inq.interest || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${st.className}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">
                        {new Date(inq.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Inquiry status breakdown */}
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" /> สถานะ Inquiries
            </h2>
            <div className="space-y-3">
              {[
                { label: "ใหม่", count: newInquiries, color: "bg-primary" },
                { label: "ติดต่อแล้ว", count: contactedInquiries, color: "bg-blue-500" },
                { label: "ปิดแล้ว", count: closedInquiries, color: "bg-border" },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all`}
                      style={{ width: totalInquiries > 0 ? `${(count / totalInquiries) * 100}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products by category */}
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-muted-foreground" /> สินค้าตามหมวด
            </h2>
            <div className="space-y-2.5">
              {productsByCategory.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{CATEGORY_LABELS[cat.category] ?? cat.category}</span>
                    <span className="font-medium">{cat._count.id}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary/60 transition-all"
                      style={{ width: `${(cat._count.id / maxCategoryCount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { href: "/admin/products", label: "เพิ่มสินค้าใหม่", icon: Package },
                { href: "/admin/projects", label: "เพิ่ม Project ใหม่", icon: FileImage },
                { href: "/admin/inquiries", label: "จัดการ Inquiries", icon: MessageSquare },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-sm">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  {label}
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
