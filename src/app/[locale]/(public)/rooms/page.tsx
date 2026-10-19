import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { DoorOpen } from "lucide-react";
import { Link } from "@/navigation";
import { getPublishedRoomCards } from "@/lib/rooms";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rooms" });
  return { title: `${t("heading")} — LeoAngelo` };
}

export default async function RoomsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("rooms");
  const rooms = await getPublishedRoomCards(locale);

  return (
    <main>
      <section className="py-24 px-6 text-center damask-bg text-white">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">{t("label")}</p>
        <h1 className="text-5xl md:text-6xl font-light mb-4">
          <span className="gold-text font-semibold italic">{t("heading")}</span>
        </h1>
        <p className="text-white/60 max-w-xl mx-auto text-base leading-relaxed">{t("sub")}</p>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {rooms.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">{t("empty")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <Link key={room.slug} href={`/rooms/${room.slug}` as "/rooms/[slug]"} className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4">
                    {room.coverImage ? (
                      <Image src={room.coverImage} alt={room.name} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <DoorOpen className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <p className="absolute bottom-4 left-4 text-white/75 text-xs tracking-widest uppercase">{room.altName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors font-display">{room.name}</h2>
                    <span className="text-sm text-muted-foreground">{t("product_count", { count: room.productCount })}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
