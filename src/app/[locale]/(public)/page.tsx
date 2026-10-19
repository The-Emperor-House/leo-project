import { getPublishedRoomCards } from "@/lib/rooms";
import HomeClient from "./HomeClient";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <HomeClient rooms={await getPublishedRoomCards(locale)} />;
}
