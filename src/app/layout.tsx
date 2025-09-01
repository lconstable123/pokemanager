import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist, Inter } from "next/font/google";
import "./globals.css";
import BG from "../../components/bg";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PokeManager",
  description: "Created by Luke Constable",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable}  ${urbanist.variable} ${inter.variable} antialiased`}
      >
        {children}
        <BG />
      </body>
    </html>
  );
}
