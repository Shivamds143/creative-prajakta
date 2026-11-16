import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "./providers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Creative Prajakta – Premium Personalized Gifts & Celebration Hampers",
  description:
    "Discover thoughtful personalized gifts, curated gift hampers, and delightful surprises across India with direct WhatsApp ordering.",
  keywords: "gifts, personalized gifts, hampers, birthday gifts, anniversary gifts, direct whatsapp ordering, creative prajakta",
  openGraph: {
    title: "Creative Prajakta – Gift More. Feel More.",
    description: "Curated luxury gifts and personalized hampers delivered across India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
