import MainWindow from "../../../components/main-window";
import WindowBg from "../../../components/window-bg/window-bg";
const features = [
  "Full Stack with Next",
  "Optimistic Frontend",
  "Next-Auth",
  "Prisma and Postgres",
];
export default function Home() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <MainWindow>
        <div>
          <h1 className="Text-primary font-bold">TEST TEesfesXT</h1>
          <h1 className="Text-secondary font-bold">TEST TEsesfXT</h1>
          <h1 className="Text-tertiary font-bold">TEST TEsefesfXT</h1>
          <ul className="flex gap-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <img src="/pokeballs/pokeballs-09.svg" width={10} height={10} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <WindowBg image="Charizard" />
      </MainWindow>
    </div>
  );
}
