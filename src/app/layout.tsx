import type { Metadata } from "next";
import { Bodoni_Moda, Inter } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeoAngelo — Real Italy Furniture | เฟอร์นิเจอร์คลาสสิคจากอิตาลี",
  description:
    "บริษัท ลีโอ แอนเจลโล่ จำกัด ผู้นำเข้าเฟอร์นิเจอร์สไตล์คลาสสิคแท้จากอิตาลี งานทำมือ (Handmade) คุณภาพสูงจากช่างมืออาชีพชาวอิตาลี สอบถาม 02-561-4209",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${bodoni.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
