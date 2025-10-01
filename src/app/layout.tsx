import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist, Inter } from "next/font/google";
import "./globals.css";
import BG from "../../components/bg";
import { Toaster } from "react-hot-toast";
import PokeAppContextProvider from "@/lib/contexts/PokeAppContext";
import MainWindow from "../../components/main-window";
import Canvas from "../../components/canvas";
import NavBar from "../../components/nav-bar";

import DexContextProvider from "@/lib/contexts/DexContext";

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

//immediate loads
// <link rel="preload" href="/new-images/bg/BG16.jpg" as="image" />;

export const metadata: Metadata = {
  title: "PokeManager",
  description: "Created by Luke Constable",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={` ${geistSans.variable}  ${urbanist.variable} ${inter.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <PokeAppContextProvider>
          <DexContextProvider>
            <Canvas>
              <MainWindow>
                <NavBar Navlink="/" />
                <div className="flex-grow">{children}</div>
              </MainWindow>
            </Canvas>
          </DexContextProvider>
        </PokeAppContextProvider>
        <BG />
      </body>
    </html>
  );
}
