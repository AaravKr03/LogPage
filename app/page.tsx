import BackgroundVideo from "@/components/BackgroundVideo";
import RetroWindow from "@/components/RetroWindow";
import ViewportFit from "@/components/ViewportFit";

export default function Home() {
  return (
    <>
      <BackgroundVideo />
      <ViewportFit />
      {/* Phones: window fills the visible screen (shrinks with the keyboard). sm+: centered window. */}
      <main className="fixed inset-x-0 top-[var(--vvt,0px)] h-[var(--vvh,100dvh)] p-2 sm:static sm:grid sm:h-auto sm:min-h-screen sm:place-items-center sm:p-10">
        <div className="h-full w-full sm:h-auto sm:max-w-[860px]">
          <RetroWindow />
        </div>
      </main>
    </>
  );
}
