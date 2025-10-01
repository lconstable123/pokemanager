import React from "react";
import { AddPkModal } from "../../../../components/add-pk-modal";
import { EditPkModal } from "../../../../components/edit-pk-modal";
import WindowBg from "../../../../components/window-bg/window-bg";
import TrainerContextProvider from "@/lib/contexts/TrainerContext";
import { FetchTrainerById } from "@/lib/actions";
import { checkAuth } from "@/lib/server-utlils";
import NavBar from "../../../../components/nav-bar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(
    "fetching trainer in account layout---------------------------------------------------------"
  );

  const session = await checkAuth();
  console.log("Auth session:", session);
  if (!session?.user) {
    console.log("No user session");
  }
  const trainer = await FetchTrainerById(session?.user?.id || "");
  return (
    <>
      <TrainerContextProvider
        key={session?.user?.id || "guest"}
        trainerFromServer={trainer?.trainer}
      >
        <AddPkModal mode="add" />
        <EditPkModal />
        <WindowBg image="Charizard" pos="mid" />
        {/* <NavBar isBackEnabled={false} isProfileEnabled={true} Navlink="/" /> */}
        {children}
      </TrainerContextProvider>
    </>
  );
}
