import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Majesty Mandi House | Authentic Arabian Mandi in Hanamkonda",
  description:
    "Premium family-friendly Arabian mandi restaurant in Hanamkonda with authentic mandi, grilled specialties, and Indo-Chinese starters.",
  keywords: [
    "Majesty Mandi House",
    "Arabian Mandi Hanamkonda",
    "Mandi in Warangal",
    "Family restaurant Hanamkonda",
  ],
  openGraph: {
    title: "Majesty Mandi House",
    description:
      "Taste the Legacy: Authentic Arabian Mandi in Hanamkonda. Reserve, pre-order, and explore premium mandi specials.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#2a0f0e] text-white antialiased">
        {children}
        <a
          href="https://wa.me/918121213533?text=Hello%20Majesty%20Mandi%20House,%20I%20would%20like%20to%20place%20an%20order%20or%20reserve%20a%20table."
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 z-[120] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-2xl shadow-xl transition hover:scale-105"
          aria-label="Order on WhatsApp"
        >
          💬
        </a>
      </body>
    </html>
  );
}
