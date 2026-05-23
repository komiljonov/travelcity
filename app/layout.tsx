import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

import { Providers } from "./providers";

import "../i18n"; // MUHIM: faqat import qilish

export const metadata: Metadata = {
  title: "Travel",
  description:
    "Travel is a platform for booking tours and cities in Uzbekistan",
  keywords: "Travel, Tours, Cities, Uzbekistan",
  authors: [{ name: "Travel", url: "https://travel.uz" }],
  creator: "Travel",
  publisher: "Travel",
  openGraph: {
    title: "Travel",
    description:
      "Travel is a platform for booking tours and cities in Uzbekistan",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
