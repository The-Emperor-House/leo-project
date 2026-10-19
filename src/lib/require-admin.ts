import { auth } from "./auth";
import { isAdminRole } from "./auth.config";

// Server actions are reachable by POST from any route, so the proxy's /admin
// guard does not protect them. Every admin action must call this first.
export async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !isAdminRole(role)) {
    throw new Error("Unauthorized");
  }
  return session;
}
