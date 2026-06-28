import type { Metadata } from "next";
import { Bodoni_Moda, Inter, IBM_Plex_Sans_Thai } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeoAngelo — Real Italy Furniture",
  description: "Authentic classic Italian handmade furniture. LeoAngelo Co., Ltd. Tel. 02-561-4209",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${ibmPlexSansThai.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
