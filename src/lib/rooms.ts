import { prisma } from "./prisma";

export type RoomCard = { slug: string; name: string; altName: string; coverImage: string | null; productCount: number };

export function roomName(room: { nameEn: string; nameTh: string }, locale: string) {
  return locale === "th" ? room.nameTh : room.nameEn;
}

export async function getPublishedRoomCards(locale: string): Promise<RoomCard[]> {
  const rooms = await prisma.room.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { products: { where: { published: true } } } } },
  });
  return rooms.map((r) => ({
    slug: r.slug,
    name: roomName(r, locale),
    altName: locale === "th" ? r.nameEn : r.nameTh,
    coverImage: r.coverImage,
    productCount: r._count.products,
  }));
}
