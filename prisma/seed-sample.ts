import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

const PROJECTS = [
  { title: "บ้านคุณสมชาย — สาทร", slug: "saladaeng-residence", location: "สาทร กรุงเทพฯ", description: "โครงการตกแต่งบ้านพักอาศัย 3 ชั้น สไตล์คลาสสิกอิตาเลียนเต็มรูปแบบ", style: "Italian Classic", featured: true, published: true, order: 1 },
  { title: "Penthouse — The Ritz Sukhumvit", slug: "ritz-penthouse", location: "สุขุมวิท กรุงเทพฯ", description: "ห้องพักอาศัยระดับ Penthouse ชั้น 42 ตกแต่งด้วยเฟอร์นิเจอร์อิตาเลียนแท้", style: "Contemporary Italian", featured: true, published: true, order: 2 },
  { title: "บ้านพักตากอากาศ — พัทยา", slug: "pattaya-villa", location: "พัทยา ชลบุรี", description: "วิลล่าริมทะเล 4 ห้องนอน ออกแบบให้ได้กลิ่นอายรีสอร์ทเมดิเตอร์เรเนียน", style: "Mediterranean", featured: false, published: true, order: 3 },
  { title: "ออฟฟิศผู้บริหาร — อาคารสาทร", slug: "sathorn-executive-office", location: "สาทร กรุงเทพฯ", description: "ห้องทำงานผู้บริหารระดับสูง ชั้น 38 ตกแต่งด้วย Luxury Collection", style: "Executive Classic", featured: false, published: true, order: 4 },
  { title: "คอนโดมิเนียม — ลุมพินี", slug: "lumpini-condo", location: "ลุมพินี กรุงเทพฯ", description: "ห้องคอนโด 180 ตร.ม. ออกแบบให้พื้นที่เปิดโล่งด้วยเฟอร์นิเจอร์สีครีมและทองอ่อน", style: "Italian Modern", featured: true, published: true, order: 5 },
];

async function main() {
  // clear old sample products
  await prisma.product.deleteMany({ where: { id: { startsWith: "sample-" } } });

  console.log("Seeding products...");
  for (const product of PRODUCTS) {
    await prisma.product.create({ data: { ...product, published: true } });
  }
  console.log(`✓ ${PRODUCTS.length} products seeded`);

  console.log("Seeding projects...");
  for (const project of PROJECTS) {
    await prisma.project.upsert({ where: { slug: project.slug }, update: {}, create: project });
  }
  console.log(`✓ ${PROJECTS.length} projects seeded`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
