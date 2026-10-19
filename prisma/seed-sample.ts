import { PrismaClient } from "@prisma/client";
import { ROOMS } from "./rooms-data";

const prisma = new PrismaClient();

// Mock data for local development. Sample rows are recognisable (product ids start
// with "sample-", inquiry emails end in @example.com) so re-running replaces them
// instead of duplicating, and real data is never touched.

const PRODUCTS = [
  // Classic — Furniture
  { line: "classic", category: "furniture", title: "Venezia Sofa", description: "โซฟาสไตล์คลาสสิกอิตาเลียน เบาะกำมะหยี่นุ่มสบาย ขาไม้แกะสลักลายดอกไม้ละเอียด", featured: true, order: 1 },
  { line: "classic", category: "furniture", title: "Firenze Armchair", description: "เก้าอี้นวมผ้ากำมะหยี่สีครีม โครงไม้วอลนัทแท้ทรงคลาสสิก", featured: false, order: 2 },
  { line: "classic", category: "furniture", title: "Roma Coffee Table", description: "โต๊ะกลางหินอ่อนขาวนำเข้าจากอิตาลี โครงทองเหลืองขัดเงา", featured: false, order: 3 },
  { line: "classic", category: "furniture", title: "Milano Bookcase", description: "ชั้นวางหนังสือไม้มะฮอกกานีแกะสลัก 5 ชั้น สไตล์คฤหาสน์ยุโรป", featured: false, order: 4 },
  { line: "classic", category: "furniture", title: "Siena Dining Table", description: "โต๊ะอาหาร 8 ที่นั่ง ไม้โอ๊คแท้ขัดเงา ขาแกะสลักลายคลาสสิกอิตาเลียน", featured: true, order: 5 },
  { line: "classic", category: "furniture", title: "Napoli Dining Chair", description: "เก้าอี้ทานอาหารหุ้มผ้าดามัสก์ทอง โครงไม้แกะสลักสีทองอ่อน", featured: false, order: 6 },
  { line: "classic", category: "furniture", title: "Genova King Bed", description: "เตียง King Size หัวเตียงหุ้มกำมะหยี่ ขาแกะสลัก สไตล์คลาสสิก", featured: false, order: 7 },
  { line: "classic", category: "furniture", title: "Palermo Wardrobe", description: "ตู้เสื้อผ้า 6 บาน ไม้วอลนัทแท้ กระจกเต็มบาน บานพับสไตล์คลาสสิก", featured: false, order: 8 },
  { line: "classic", category: "furniture", title: "Torino Executive Desk", description: "โต๊ะทำงานผู้บริหารไม้วอลนัทแท้ พื้นผิวหนังแท้สีน้ำตาล ลิ้นชัก 3 ด้าน", featured: false, order: 9 },
  { line: "classic", category: "furniture", title: "Ravenna Sideboard", description: "ตู้ข้างห้องอาหารไม้วอลนัท 4 บานพร้อมลิ้นชัก 3 ช่อง หัวเสาแกะสลัก", featured: false, order: 10 },

  // Classic — Lighting
  { line: "classic", category: "lighting", title: "Murano Classic Chandelier", description: "โคมระย้าคริสตัล Murano นำเข้าจากเวนิส 18 หัว โครงทองเหลือง เส้นผ่าศูนย์กลาง 75 ซม.", featured: true, order: 1 },
  { line: "classic", category: "lighting", title: "Venezia Wall Sconce", description: "โคมติดผนังทองเหลืองขัดเงา คริสตัลแขวน เหมาะสำหรับทางเดินและห้องนั่งเล่น", featured: false, order: 2 },
  { line: "classic", category: "lighting", title: "Firenze Floor Lamp", description: "โคมตั้งพื้นทองเหลืองขา 3 เส้น โป๊ะผ้าไหมครีม ความสูง 160 ซม.", featured: false, order: 3 },
  { line: "classic", category: "lighting", title: "Roma Table Lamp", description: "โคมตั้งโต๊ะฐานเซรามิกลายกุหลาบ โป๊ะผ้าลูกไม้ขาว ขอบทอง", featured: false, order: 4 },
  { line: "classic", category: "lighting", title: "Milano Candelabra", description: "เชิงเทียนตั้งพื้น 5 แขน ทองเหลืองขัดเงา ความสูง 140 ซม.", featured: false, order: 5 },

  // Classic — Ornament
  { line: "classic", category: "ornament", title: "Florentine Vase Pair", description: "แจกันคู่เซรามิกฟลอเรนซ์ ลายทองบลูโคบอลต์ ความสูง 45 ซม.", featured: true, order: 1 },
  { line: "classic", category: "ornament", title: "Renaissance Mirror", description: "กระจกเงาขอบทองแกะสลักลายใบอะแคนธัส ขนาด 100×140 ซม.", featured: false, order: 2 },
  { line: "classic", category: "ornament", title: "Capodimonte Clock", description: "นาฬิกาตั้งโต๊ะเซรามิก Capodimonte ลายดอกไม้นูน ทาสีมือ", featured: false, order: 3 },
  { line: "classic", category: "ornament", title: "Majolica Fruit Bowl", description: "ถาดผลไม้เซรามิก Majolica ลายพฤกษาสีสด เส้นผ่าศูนย์กลาง 40 ซม.", featured: false, order: 4 },
  { line: "classic", category: "ornament", title: "Gilded Photo Frame Set", description: "ชุดกรอบรูปทองคำปิดทอง 3 ขนาด แกะสลักลายดอกกุหลาบ", featured: false, order: 5 },

  // Classic — Hardwares
  { line: "classic", category: "hardwares", title: "Classic Brass Handle Set", description: "ชุดมือจับประตูและลิ้นชักทองเหลืองแท้ ลายคลาสสิก ชุบทองไม่ลอก", featured: false, order: 1 },
  { line: "classic", category: "hardwares", title: "Ornate Door Knob", description: "ลูกบิดประตูทองเหลืองแกะสลักลายดอกไม้ ใช้กับประตูไม้สไตล์คลาสสิก", featured: false, order: 2 },
  { line: "classic", category: "hardwares", title: "Classic Hinge Set", description: "บานพับประตูทองเหลืองขัดเงา ขนาด 4 นิ้ว รับน้ำหนักสูง", featured: false, order: 3 },
  { line: "classic", category: "hardwares", title: "Brass Escutcheon", description: "แผ่นกุญแจทองเหลืองแกะสลัก สำหรับตู้และประตูไม้สไตล์คลาสสิก", featured: false, order: 4 },
  { line: "classic", category: "hardwares", title: "Classic Curtain Rod", description: "ราวม่านทองเหลืองขัดเงา พร้อมหัวราวแกะสลักทรงดอกไม้ ยาว 3 ม.", featured: false, order: 5 },

  // Luxury — Furniture
  { line: "luxury", category: "furniture", title: "Imperial Throne Chair", description: "เก้าอี้บัลลังก์หุ้มกำมะหยี่สีแดงเข้ม ขาแกะสลักปิดทอง 24K สไตล์พระราชวัง", featured: true, order: 1 },
  { line: "luxury", category: "furniture", title: "Versailles Sofa", description: "โซฟา 3 ที่นั่งหุ้มหนังนำเข้าสีครีม โครงไม้วอลนัทปิดทองบริสุทธิ์ 24K", featured: true, order: 2 },
  { line: "luxury", category: "furniture", title: "Palace Dining Table", description: "โต๊ะอาหาร 12 ที่นั่ง ไม้โอ๊คนำเข้า ขาแกะสลักและปิดทอง ยาว 3.6 ม.", featured: false, order: 3 },
  { line: "luxury", category: "furniture", title: "Canopy Bed Royale", description: "เตียง 4 เสาปิดทอง 24K Queen Size ม่านผ้าไหมฝรั่งเศส มือทำทุกชิ้นส่วน", featured: true, order: 4 },
  { line: "luxury", category: "furniture", title: "Grand Library Cabinet", description: "ตู้ห้องสมุดขนาดใหญ่ไม้มะฮอกกานีแท้ กระจกบรอนซ์ พร้อมบันไดเลื่อน", featured: false, order: 5 },
  { line: "luxury", category: "furniture", title: "Marquise Dressing Table", description: "โต๊ะเครื่องแป้งปิดทองสไตล์แวร์ซาย กระจกขอบทอง ลิ้นชัก 8 ช่อง", featured: false, order: 6 },
  { line: "luxury", category: "furniture", title: "Executive Palace Desk", description: "โต๊ะทำงานผู้บริหารระดับสูง ไม้วอลนัทปิดทอง พื้นหนังนูบัคสีดำ", featured: false, order: 7 },
  { line: "luxury", category: "furniture", title: "Grand Armoire", description: "ตู้เสื้อผ้าขนาดใหญ่พิเศษ 8 บาน ไม้วอลนัทปิดทอง กระจกบรอนซ์เต็มบาน", featured: false, order: 8 },

  // Luxury — Lighting
  { line: "luxury", category: "lighting", title: "Grand Murano Chandelier", description: "โคมระย้าคริสตัล Murano 48 หัว ปิดทอง 24K เส้นผ่าศูนย์กลาง 150 ซม. สั่งทำพิเศษ", featured: true, order: 1 },
  { line: "luxury", category: "lighting", title: "Royal Floor Lamp", description: "โคมตั้งพื้นทองเหลืองปิดทอง สูง 180 ซม. ฐานหินอ่อนคาร์รารา โป๊ะผ้าไหม", featured: false, order: 2 },
  { line: "luxury", category: "lighting", title: "Prestige Table Lamp", description: "โคมตั้งโต๊ะฐานหินอ่อนและทองเหลืองปิดทอง โป๊ะผ้าไหมอิตาเลียน", featured: false, order: 3 },
  { line: "luxury", category: "lighting", title: "Palace Wall Sconce Pair", description: "โคมติดผนังทองเหลืองปิดทองคู่ คริสตัล Swarovski แขวน", featured: false, order: 4 },

  // Luxury — Ornament
  { line: "luxury", category: "ornament", title: "Marble Bust Sculpture", description: "รูปสลักหินอ่อนครึ่งตัว เทพีแห่งความงาม งานฝีมือช่างอิตาเลียนเอกชน", featured: true, order: 1 },
  { line: "luxury", category: "ornament", title: "Bronze Equestrian", description: "รูปปั้นทองสัมฤทธิ์ม้าและนักขี่ ความสูง 60 ซม. งานหล่อประณีต Limited Edition", featured: false, order: 2 },
  { line: "luxury", category: "ornament", title: "Venetian Grand Mirror", description: "กระจกเงาขอบกระจกแกะสลักสไตล์เวนิส ขนาด 120×180 ซม. ทำมือทั้งชิ้น", featured: false, order: 3 },
  { line: "luxury", category: "ornament", title: "Royal Tapestry", description: "ผ้าทอโกเบอแลงสไตล์คลาสสิก ลายล่าสัตว์ยุคกลาง 120×180 ซม. กรอบไม้วอลนัท", featured: false, order: 4 },

  // Luxury — Hardwares
  { line: "luxury", category: "hardwares", title: "Gold Plated Handle Set", description: "ชุดมือจับปิดทอง 24K นำเข้าจากอิตาลี แกะสลักลายดอกกุหลาบ รับประกัน 10 ปี", featured: false, order: 1 },
  { line: "luxury", category: "hardwares", title: "Crystal Door Handle", description: "มือจับประตูคริสตัล Swarovski ฐานทองเหลืองปิดทอง สำหรับงาน High-end", featured: false, order: 2 },
  { line: "luxury", category: "hardwares", title: "Prestige Lock Set", description: "ชุดกุญแจและมือจับประตูทองเหลืองปิดทอง ระบบล็อคอัจฉริยะ สั่งทำพิเศษ", featured: false, order: 3 },
];

// Which rooms each sample product appears in; hardware stays out of rooms on purpose.
const PRODUCT_ROOMS: Record<string, string[]> = {
  "Venezia Sofa": ["living"],
  "Firenze Armchair": ["living", "bedroom"],
  "Roma Coffee Table": ["living"],
  "Milano Bookcase": ["living", "working"],
  "Siena Dining Table": ["dining"],
  "Napoli Dining Chair": ["dining"],
  "Genova King Bed": ["bedroom"],
  "Palermo Wardrobe": ["bedroom"],
  "Torino Executive Desk": ["working"],
  "Ravenna Sideboard": ["dining", "living"],
  "Murano Classic Chandelier": ["living", "dining"],
  "Venezia Wall Sconce": ["living", "bedroom"],
  "Firenze Floor Lamp": ["living", "working"],
  "Roma Table Lamp": ["bedroom", "working"],
  "Milano Candelabra": ["dining"],
  "Florentine Vase Pair": ["living", "dining"],
  "Renaissance Mirror": ["bedroom", "living"],
  "Capodimonte Clock": ["working", "living"],
  "Majolica Fruit Bowl": ["dining"],
  "Gilded Photo Frame Set": ["bedroom", "working"],
  "Imperial Throne Chair": ["living"],
  "Versailles Sofa": ["living"],
  "Palace Dining Table": ["dining"],
  "Canopy Bed Royale": ["bedroom"],
  "Grand Library Cabinet": ["working"],
  "Marquise Dressing Table": ["bedroom"],
  "Executive Palace Desk": ["working"],
  "Grand Armoire": ["bedroom"],
  "Grand Murano Chandelier": ["dining", "living"],
  "Royal Floor Lamp": ["living", "bedroom"],
  "Prestige Table Lamp": ["working", "bedroom"],
  "Palace Wall Sconce Pair": ["dining", "living"],
  "Marble Bust Sculpture": ["living", "working"],
  "Bronze Equestrian": ["working"],
  "Venetian Grand Mirror": ["bedroom", "dining"],
  "Royal Tapestry": ["living", "dining"],
};

// Photos already in /public, grouped by the room they show. Products borrow a
// photo of their main room so cards are not blank placeholders.
const photo = (name: string) => `/slider/${name}-Logo.jpg`;
const PHOTOS: Record<string, string[]> = {
  living: ["Nont-Living6", "Nont-Living8", "Bangpli-Living2", "SS1-Living Room", "Srinakarin2-Living3", "OP-Family3", "OP-Nook3", "OP-Nook5"].map(photo),
  dining: ["Nont-Dining1", "Nont-Dining3", "OP-Dining3", "SS2-Dining5", "Srinakarin2-Dining3", "KritP1-Dining3", "Bangpli-Bed-DIning1"].map(photo),
  bedroom: ["Nont-Bed4", "Nont-Bed6", "OP-Bed", "OP-Bed2", "OP-BED-7", "OP-BED-D2", "OP-Bed-Green1", "SS2-Walkin"].map(photo),
  working: ["Nont-Working3", "Bangpli-Working3", "SS1-Working2"].map(photo),
  other: ["Nont-Chandelier1", "OP-Foyer-Chanderlier", "Bangpli-Wall Lamp4", "Bangpli-Stair2", "Nont-Stair Hall3"].map(photo),
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const PROJECTS = [
  { title: "Somchai Residence — Sathorn", slug: "saladaeng-residence", location: "Sathorn, Bangkok", description: "A 3-story residential interior project in a full Italian classic style.", style: "classic", featured: true, published: true, order: 1,
    photos: ["Nont-Living8", "Nont-Living6", "Nont-Dining1", "Nont-Dining3", "Nont-Bed4", "Nont-Bed6", "Nont-Chandelier1", "Nont-Stair Hall3", "Nont-Working3"] },
  { title: "Penthouse — The Ritz Sukhumvit", slug: "ritz-penthouse", location: "Sukhumvit, Bangkok", description: "A 42nd-floor penthouse residence furnished with authentic Italian furniture.", style: "luxury", featured: true, published: true, order: 2,
    photos: ["OP-Foyer-Chanderlier", "OP-Family3", "OP-Dining3", "OP-BED-7", "OP-Bed-Green1", "OP-Nook3", "OP-Nook5", "OP_ห้องลูกชาย 1", "OP_ห้องลูกชาย 29"] },
  { title: "Beach Villa — Pattaya", slug: "pattaya-villa", location: "Pattaya, Chonburi", description: "A 4-bedroom seaside villa designed with a Mediterranean resort ambiance.", style: "contemporary", featured: false, published: true, order: 3,
    photos: ["Bangpli-Living2", "Bangpli-Bed-DIning1", "Bangpli-Stair2", "Bangpli-Wall Lamp4", "Bangpli-Working3"] },
  { title: "Executive Office — Sathorn Tower", slug: "sathorn-executive-office", location: "Sathorn, Bangkok", description: "A 38th-floor executive office furnished with the Luxury Collection.", style: "luxury", featured: false, published: true, order: 4,
    photos: ["SS1-Working2", "SS1-Living Room", "SS2-Dining5", "SS2-Walkin", "SS2-Buddha-1"] },
  { title: "Condominium — Lumpini", slug: "lumpini-condo", location: "Lumpini, Bangkok", description: "A 180 sq.m. condo unit opened up with cream and soft-gold furniture.", style: "modern", featured: true, published: true, order: 5,
    photos: ["Srinakarin2-Living3", "Srinakarin2-Dining3", "KritP1-Dining3", "OP-Bed", "OP-Bed2"] },
];

const DAY = 24 * 60 * 60 * 1000;
const INQUIRIES = [
  { name: "สมชาย ใจดี", phone: "081-234-5678", interest: "living", status: "NEW", daysAgo: 0, message: "สนใจโซฟา Venezia สีครีม ขอทราบราคาและระยะเวลาจัดส่งครับ" },
  { name: "Emily Carter", phone: null, interest: "dining", status: "NEW", daysAgo: 1, message: "Hello, could you send me a quote for the Siena dining table with 8 Napoli chairs? Delivery to Thonglor." },
  { name: "วิภาวรรณ ศรีสุข", phone: "089-765-4321", interest: "bedroom", status: "NEW", daysAgo: 2, message: "กำลังรีโนเวทห้องนอนใหญ่ อยากได้เตียง Canopy Bed Royale กับตู้เสื้อผ้า ขอนัดเข้าชมโชว์รูมได้ไหมคะ" },
  { name: "ประยุทธ มั่นคง", phone: "02-345-6789", interest: "working", status: "CONTACTED", daysAgo: 4, message: "ต้องการชุดโต๊ะทำงานผู้บริหารสำหรับออฟฟิศใหม่ 3 ห้อง ขอใบเสนอราคา" },
  { name: "Kenji Tanaka", phone: "+66 92 111 2233", interest: "lighting", status: "CONTACTED", daysAgo: 6, message: "Interested in the Grand Murano Chandelier for a double-height foyer (ceiling 6.5m). Is custom sizing possible?" },
  { name: "ณัฐธิดา วงศ์ใหญ่", phone: "086-222-3344", interest: "custom", status: "NEW", daysAgo: 7, message: "อยากสั่งทำตู้โชว์ไม้แกะสลักขนาดพิเศษ กว้าง 3 เมตร รับงานสั่งทำไหมคะ" },
  { name: "Daniel Rossi", phone: null, interest: "ornament", status: "CLOSED", daysAgo: 11, message: "Do you have the Florentine vase pair in stock? Looking to buy two sets." },
  { name: "กิตติพงษ์ ทองดี", phone: "084-555-6677", interest: "dining", status: "CONTACTED", daysAgo: 14, message: "สนใจโต๊ะอาหาร 12 ที่นั่ง สำหรับบ้านใหม่ที่นนทบุรี ขอดูของจริงก่อนได้ไหมครับ" },
  { name: "Sarah Lim", phone: "+65 9123 4567", interest: "living", status: "CLOSED", daysAgo: 18, message: "We are furnishing a villa in Phuket. Can you ship there and handle installation?" },
  { name: "อรุณี พรหมมา", phone: "087-888-9900", interest: "bedroom", status: "CLOSED", daysAgo: 23, message: "ขอบคุณสำหรับข้อมูลค่ะ ตัดสินใจสั่งโต๊ะเครื่องแป้ง Marquise แล้ว" },
  { name: "Michael Brown", phone: null, interest: null, status: "NEW", daysAgo: 0, message: "What are your showroom opening hours on weekends?" },
  { name: "ธนวัฒน์ แสงทอง", phone: "091-234-0000", interest: "lighting", status: "NEW", daysAgo: 3, message: "โคมติดผนัง Palace Wall Sconce มีกี่คู่ในสต็อกครับ ต้องการ 6 คู่" },
];

function assertLocalDatabase() {
  const host = process.env.DATABASE_URL?.match(/@([^:/?]+)/)?.[1] ?? "";
  if (!["localhost", "127.0.0.1", "db"].includes(host) && process.env.ALLOW_SAMPLE_SEED !== "1") {
    throw new Error(`Refusing to seed sample data into "${host || "unknown host"}" — this script is for local databases only.`);
  }
}

async function main() {
  assertLocalDatabase();

  for (const room of ROOMS) {
    await prisma.room.upsert({ where: { slug: room.slug }, update: {}, create: room });
  }
  const roomIds: Record<string, string> = Object.fromEntries(
    (await prisma.room.findMany({ select: { id: true, slug: true } })).map((r) => [r.slug, r.id])
  );

  console.log("Seeding products...");
  await prisma.product.deleteMany({ where: { id: { startsWith: "sample-" } } });
  const used: Record<string, number> = {};
  for (const product of PRODUCTS) {
    const rooms = (PRODUCT_ROOMS[product.title] ?? []).filter((r) => roomIds[r]);
    const key = rooms[0] ?? "other";
    const pool = PHOTOS[key];
    const i = (used[key] = (used[key] ?? -1) + 1);
    await prisma.product.create({
      data: {
        ...product,
        id: `sample-${slugify(product.title)}`,
        published: true,
        imageUrl: pool[i % pool.length],
        images: JSON.stringify([pool[(i + 1) % pool.length], pool[(i + 2) % pool.length]]),
        rooms: { connect: rooms.map((r) => ({ id: roomIds[r] })) },
      },
    });
  }
  console.log(`✓ ${PRODUCTS.length} products seeded`);

  console.log("Seeding projects...");
  for (const { photos, ...project } of PROJECTS) {
    const data = { ...project, coverImage: photo(photos[0]), images: JSON.stringify(photos.map(photo)) };
    await prisma.project.upsert({ where: { slug: project.slug }, update: data, create: data });
  }
  console.log(`✓ ${PROJECTS.length} projects seeded`);

  console.log("Seeding inquiries...");
  await prisma.inquiry.deleteMany({ where: { email: { endsWith: "@example.com" } } });
  const now = Date.now();
  for (const [i, { daysAgo, ...inquiry }] of INQUIRIES.entries()) {
    const createdAt = new Date(now - daysAgo * DAY - i * 37 * 60 * 1000);
    await prisma.inquiry.create({
      data: { ...inquiry, email: `customer${i + 1}@example.com`, read: inquiry.status !== "NEW", consentAt: createdAt, createdAt },
    });
  }
  console.log(`✓ ${INQUIRIES.length} inquiries seeded`);
}

main()
  .catch((err) => { console.error(err); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
