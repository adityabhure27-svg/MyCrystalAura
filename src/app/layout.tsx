import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Cinzel, Poppins } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CrystalAura — Authentic Crystals & Conscious Living",
    template: "%s · CrystalAura",
  },
  description:
    "India's premium holistic wellness marketplace for authentic crystals, sound healing, meditation, and conscious living. Shop, Learn, Experience, and connect with the Community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {/* Public (site) and admin route groups provide their own chrome. */}
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
