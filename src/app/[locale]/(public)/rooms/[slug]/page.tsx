import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { roomName } from "@/lib/rooms";
import { CATEGORY_KEYS } from "@/lib/catalog";
import { RoomClient } from "./RoomClient";

const PREVIEW_LIMIT = 8;

async function getRoom(slug: string) {
  return prisma.room.findUnique({
    where: { slug, published: true },
    include: {
      products: {
        where: { published: true },
        orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        select: {
          id: true, title: true, imageUrl: true, images: true,
          description: true, line: true, category: true, featured: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const room = await getRoom(slug);
  if (!room) return {};
  return { title: `${roomName(room, locale)} — LeoAngelo` };
}

export default async function RoomPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const room = await getRoom(slug);
  if (!room) notFound();
  const t = await getTranslations("rooms");

  const otherRooms = await prisma.room.findMany({
    where: { published: true, NOT: { id: room.id } },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { slug: true, nameEn: true, nameTh: true },
  });

  // Known categories first, in their usual order, then anything else admins used.
  const categories = [
    ...CATEGORY_KEYS,
    ...new Set(room.products.map((p) => p.category).filter((c) => !CATEGORY_KEYS.includes(c))),
  ];
  const byCategory = categories
    .map((category) => {
      const all = room.products.filter((p) => p.category === category);
      return { category, products: { preview: all.slice(0, PREVIEW_LIMIT), rest: all.slice(PREVIEW_LIMIT) } };
    })
    .filter((g) => g.products.preview.length > 0);

  return (
    <RoomClient
      name={roomName(room, locale)}
      altName={locale === "th" ? room.nameEn : room.nameTh}
      description={locale === "th" ? room.descriptionTh : room.descriptionEn}
      coverImage={room.coverImage}
      productCount={room.products.length}
      byCategory={byCategory}
      otherRooms={otherRooms.map((r) => ({ slug: r.slug, name: roomName(r, locale) }))}
      labels={{
        back: t("back"),
        count: t("product_count", { count: room.products.length }),
        empty: t("room_empty"),
        other: t("other_rooms"),
      }}
    />
  );
}
