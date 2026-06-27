import { prisma } from "@/lib/prisma";
import { updateInquiryStatus } from "../actions";

type InquiryRow = {
  id: string; name: string; email: string; phone: string | null;
  interest: string | null; message: string; status: string;
  read: boolean; createdAt: Date;
};

const statusOptions = ["NEW", "CONTACTED", "CLOSED"];
const statusLabel: Record<string, string> = {
  NEW: "ใหม่",
  CONTACTED: "ติดต่อแล้ว",
  CLOSED: "ปิด",
};
const statusColor: Record<string, string> = {
  NEW: "bg-primary/15 text-primary",
  CONTACTED: "bg-blue-500/15 text-blue-600",
  CLOSED: "bg-secondary text-muted-foreground",
};

export default async function InquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Inquiries
      </h1>
      <p className="text-sm text-muted-foreground mb-8">คำถามและข้อความจากลูกค้า</p>

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
              {(inquiries as InquiryRow[]).map((inq) => (
                <tr key={inq.id} className="border-b border-border last:border-0 hover:bg-secondary/30 align-top">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{inq.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{inq.email}</div>
                    {inq.phone && <div className="text-xs">{inq.phone}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{inq.interest || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[180px]">
                    <p className="line-clamp-2">{inq.message}</p>
                  </td>
                  <td className="px-4 py-3">
                    <form action={updateInquiryStatus}>
                      <input type="hidden" name="id" value={inq.id} />
                      <select
                        name="status"
                        defaultValue={inq.status}
                        onChange={(e) => e.currentTarget.form?.requestSubmit()}
                        className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer outline-none ${statusColor[inq.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{statusLabel[s]}</option>
                        ))}
                      </select>
                    </form>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(inq.createdAt).toLocaleDateString("th-TH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
