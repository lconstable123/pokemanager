import type { Metadata } from "next";
import { Geist, Geist_Mono, Urbanist, Inter } from "next/font/google";
import "./globals.css";
import BG from "../../components/bg";
import { Toaster } from "react-hot-toast";
import PokeAppContextProvider from "@/lib/contexts/PokeAppContext";
import MainWindow from "../../components/main-window";
import Canvas from "../../components/canvas";
import NavBar from "../../components/nav-bar";
import TrainerContextProvider, {
  TrainerContext,
} from "@/lib/contexts/TrainerContext";
import DexContextProvider from "@/lib/contexts/DexContext";
import { FetchTrainerById } from "@/lib/actions";
import { auth } from "@/lib/auth";
import PsyduckServer from "../../components/psyduck-server";
import { redirect } from "next/navigation";

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
  const session = await auth();
  console.log("Auth session:", session);
  // console.log("Session in layout:", session);

  if (!session?.user) {
    // redirect("/login");
  }
  const trainer = await FetchTrainerById(session?.user?.id || "");
  // console.log("Trainer in layout:", trainer);
  return (
    <html lang="en" className="">
      <body
        className={` ${geistSans.variable}  ${urbanist.variable} ${inter.variable} antialiased`}
      >
        <Toaster position="top-center" />
        <PokeAppContextProvider>
          <DexContextProvider>
            <TrainerContextProvider trainerFromServer={trainer?.trainer}>
              <Canvas>
                <MainWindow>
                  <NavBar
                    isBackEnabled={true}
                    isProfileEnabled={true}
                    Navlink="/"
                  />
                  <div className="flex-grow">{children}</div>
                </MainWindow>
              </Canvas>
            </TrainerContextProvider>
          </DexContextProvider>
        </PokeAppContextProvider>
        <BG />
      </body>
    </html>
  );
}
