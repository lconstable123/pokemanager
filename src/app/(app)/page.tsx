import Features from "../../../components/features";
import MainWindow from "../../../components/main-window";
import WindowBg from "../../../components/window-bg/window-bg";
import Nav from "../../../components/nav";
import AppPreview from "../../../components/app-preview";

const features = [
  "Full Stack with Next",
  "Optimistic Frontend",
  "Next-Auth",
  "Prisma and Postgres",
];
const navItems = [
  { name: "Login", ball: "02", href: "/login" },
  { name: "Sign Up", ball: "05", href: "/sign-up" },
];

export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <MainWindow>
        <div className="relative pt-12 pb-7 px-0 md:px-50 flex flex-col justify-center items-center h-full w-full">
          <div className=" text-center flex px-10 flex-col  items-center justify-center md:flex-row gap-0 lg:gap-1 -translate-y-0 z-10">
            <WelcomeText />
            <AppPreview isMobile={false} />
          </div>
        </div>
        <div className="mt-auto w-full flex flex-col items-center justify-center">
          <Features features={features} />
          <div className="pb-1 mx-5 text-center sm:pb-3 text-gray-950/80 font-medium  Text-secondary text-[6pt] tracking-[2.5pt]">
            Designed and developed by Luke Constable 2025
          </div>
          <AppPreview isMobile={true} />
        </div>
        <WindowBg image="Snorlax" />
      </MainWindow>
    </div>
  );
}

function WelcomeText() {
  return (
    <section className=" w-full sm:w-full flex flex-col mx-6 justify-center items-center">
      <h1 className=" my-0 py-0">POKEMON MANAGER</h1>
      <div className="pb-1 mx-5 text-center sm:pb-3 text-gray-950/80 font-medium  Text-secondary text-[9pt] tracking-[2.5pt]">
        Designed and developed by Luke Constable
      </div>
      <h2 className=" my-0 pt-3 sm:pt-2 pb-6 ">
        Take care of your ultimate lineup.
      </h2>
      <Nav items={navItems} />
    </section>
  );
}
