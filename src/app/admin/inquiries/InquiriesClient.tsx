"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Mail, Phone, Tag, Calendar, MessageSquare, Loader2 } from "lucide-react";
import { updateInquiryStatus } from "../actions";
import { Pagination } from "@/components/Pagination";

type InquiryRow = {
  id: string; name: string; email: string; phone: string | null;
  interest: string | null; message: string; status: string;
  read: boolean; createdAt: Date;
};

const statusColor: Record<string, string> = {
  NEW: "bg-primary/15 text-primary",
  CONTACTED: "bg-blue-500/15 text-blue-600",
  CLOSED: "bg-secondary text-muted-foreground",
};
const statusLabel: Record<string, string> = {
  NEW: "ใหม่", CONTACTED: "ติดต่อแล้ว", CLOSED: "ปิด",
};

export function InquiriesClient({ inquiries, total, page, totalPages, currentStatus }: {
  inquiries: InquiryRow[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus?: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<InquiryRow | null>(null);
  const [isPending, startTransition] = useTransition();

  function changeStatus(id: string, newStatus: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      fd.append("status", newStatus);
      await updateInquiryStatus(fd);
      if (selected?.id === id) {
        setSelected((prev) => prev ? { ...prev, status: newStatus } : null);
      }
      router.refresh();
    });
  }

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        {inquiries.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">ยังไม่มี inquiry</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ติดต่อ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สนใจ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-48">ข้อความ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">วันที่</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr
                  key={inq.id}
                  onClick={() => setSelected(inq)}
                  className="border-b border-border last:border-0 hover:bg-secondary/30 align-top cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{inq.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{inq.email}</div>
                    {inq.phone && <div className="text-xs">{inq.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{inq.interest || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[180px]">
                    <p className="line-clamp-2">{inq.message}</p>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={inq.status}
                      onChange={(e) => changeStatus(inq.id, e.target.value)}
                      disabled={isPending}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer outline-none disabled:opacity-50 ${statusColor[inq.status]}`}
                    >
                      {Object.entries(statusLabel).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    <div>{new Date(inq.createdAt).toLocaleDateString("th-TH")}</div>
                    <div className="text-xs">{new Date(inq.createdAt).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/inquiries"
        params={{ status: currentStatus }}
      />

      {/* Drawer */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSelected(null)} />
          <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div>
                <h2 className="font-semibold text-base">{selected.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(selected.createdAt).toLocaleString("th-TH", {
                    year: "numeric", month: "long", day: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })} น.
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Contact */}
              <section className="space-y-2.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ข้อมูลติดต่อ</h3>
                <div className="rounded-lg border border-border bg-secondary/30 divide-y divide-border">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${selected.email}`} className="text-sm hover:text-primary transition-colors">
                      {selected.email}
                    </a>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                      <a href={`tel:${selected.phone}`} className="text-sm hover:text-primary transition-colors">
                        {selected.phone}
                      </a>
                    </div>
                  )}
                  {selected.interest && (
                    <div className="flex items-center gap-3 px-4 py-3">
                      <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{selected.interest}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(selected.createdAt).toLocaleString("th-TH", {
                        year: "numeric", month: "long", day: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })} น.
                    </span>
                  </div>
                </div>
              </section>

              {/* Message */}
              <section className="space-y-2.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> ข้อความ
                </h3>
                <div className="rounded-lg border border-border bg-secondary/30 px-4 py-3">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                </div>
              </section>

              {/* Status */}
              <section className="space-y-2.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  สถานะ
                  {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(statusLabel).map(([val, label]) => (
                    <button
                      key={val}
                      disabled={isPending}
                      onClick={() => changeStatus(selected.id, val)}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border disabled:opacity-50 ${
                        selected.status === val
                          ? `${statusColor[val]} border-transparent ring-2 ring-offset-1 ring-primary/40`
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
