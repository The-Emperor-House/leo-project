"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Loader2, ShieldCheck, Shield } from "lucide-react";
import { upsertUser, deleteUser } from "./actions";

type User = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: Date;
};

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

function UserDrawer({ user, onClose }: { user: User | null; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await upsertUser(fd);
        router.refresh();
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      }
    });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-semibold">{user ? "แก้ไข User" : "เพิ่ม User ใหม่"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {user && <input type="hidden" name="id" value={user.id} />}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">ชื่อ</label>
            <input
              name="name"
              defaultValue={user?.name ?? ""}
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
              placeholder="ชื่อ-นามสกุล"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={user?.email ?? ""}
              required
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
              placeholder="email@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Role</label>
            <select
              name="role"
              defaultValue={user?.role ?? "ADMIN"}
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">
              {user ? "รหัสผ่านใหม่ (เว้นว่างถ้าไม่ต้องการเปลี่ยน)" : "รหัสผ่าน"}
            </label>
            <input
              name="password"
              type="password"
              required={!user}
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60"
              placeholder={user ? "••••••••" : "อย่างน้อย 8 ตัวอักษร"}
              minLength={user ? undefined : 8}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {user ? "บันทึก" : "สร้าง User"}
          </button>
        </form>
      </aside>
    </>
  );
}

export function UsersClient({ users }: { users: User[] }) {
  const router = useRouter();
  const [drawer, setDrawer] = useState<User | "new" | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, email: string) {
    if (!confirm(`ลบ user "${email}"?`)) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      await deleteUser(fd);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1 font-display">Users</h1>
          <p className="text-sm text-muted-foreground">{users.length} บัญชี</p>
        </div>
        <button
          onClick={() => setDrawer("new")}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่ม User
        </button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">ยังไม่มี User</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">วันที่สร้าง</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {u.name?.charAt(0) ?? u.email.charAt(0).toUpperCase()}
                      </div>
                      {u.name ?? <span className="text-muted-foreground">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      u.role === "SUPER_ADMIN"
                        ? "bg-primary/15 text-primary"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {u.role === "SUPER_ADMIN" ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {ROLES.find((r) => r.value === u.role)?.label ?? u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(u.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setDrawer(u)}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.email)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {drawer !== null && (
        <UserDrawer user={drawer === "new" ? null : drawer} onClose={() => setDrawer(null)} />
      )}
    </>
  );
}
