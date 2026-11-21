import DesktopIcons from "@/components/DesktopIcons";
import RetroWindow from "@/components/RetroWindow";

export default function Home() {
  return (
    <main className="grid min-h-screen place-items-center overflow-x-hidden p-4 pb-10 sm:p-12 sm:pb-16">
      <div className="relative w-full max-w-[920px]">
        <DesktopIcons />
        <RetroWindow />
      </div>
    </main>
  );
}
