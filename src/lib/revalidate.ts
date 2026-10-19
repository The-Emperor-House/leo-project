import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

// Public pages live under /[locale], so a path like "/projects" must be
// revalidated once per locale ("/en/projects", "/th/projects").
export function revalidateLocalized(...paths: string[]) {
  for (const locale of routing.locales) {
    for (const path of paths) revalidatePath(`/${locale}${path}`);
  }
}

// Everything that lists rooms or a room's products: home cards, /rooms, every /rooms/[slug].
export function revalidateRooms() {
  revalidateLocalized("", "/rooms");
  revalidatePath("/[locale]/rooms/[slug]", "page");
}
