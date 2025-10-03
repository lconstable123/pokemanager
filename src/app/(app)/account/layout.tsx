import React, { Suspense } from "react";
import { AddPkModal } from "../../../../components/add-pk-modal";
import { EditPkModal } from "../../../../components/edit-pk-modal";
import WindowBg from "../../../../components/window-bg/window-bg";
import TrainerContextProvider from "@/lib/contexts/TrainerContext";
import { FetchTrainerById } from "@/lib/actions";
import { checkAuth } from "@/lib/server-utlils";
import NavBar from "../../../../components/nav-bar";
import { sleep } from "@/lib/utils";
import LoadingContent from "../../../../components/loading-content";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense
        fallback={
          <div className=" flex justify-center items-center h-full z-60 w-full  ">
            <LoadingContent />
          </div>
        }
      >
        <TrainerLoader>{children}</TrainerLoader>
      </Suspense>
      <WindowBg image="Charizard" pos="mid" duration={2} />
    </>
  );
}

async function TrainerLoader({ children }: { children: React.ReactNode }) {
  console.log(
    "fetching trainer in account layout---------------------------------------------------------"
  );

  const session = await checkAuth();
  console.log("Auth session:", session);
  if (!session?.user) {
    console.log("No user session");
  }
  await sleep(1000);
  const trainer = await FetchTrainerById(session?.user?.id || "");

  return (
    <TrainerContextProvider
      key={session?.user?.id || "guest"}
      trainerFromServer={trainer?.trainer}
    >
      <AddPkModal mode="add" />
      <EditPkModal />

      {children}
    </TrainerContextProvider>
  );
}
