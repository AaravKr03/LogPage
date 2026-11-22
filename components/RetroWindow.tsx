import Terminal from "./Terminal";

function Glyph({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 10 10" className="h-[10px] w-[10px] overflow-visible" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

/* Thin, blurred "acrylic" terminal window. Tweak bg-black/50 to change the tint. */
export default function RetroWindow() {
  return (
    <section
      aria-label="V1YKsBuilds"
      className="flex h-full min-h-0 flex-col sm:h-[min(70vh,560px)] sm:min-h-[340px] overflow-hidden rounded-md border border-white/20 bg-black/50 text-white shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150 [color-scheme:dark]"
    >
      <header className="flex h-10 shrink-0 select-none items-end bg-black/30 text-[13px]">
        <div className="flex h-9 items-center gap-2 rounded-t-md bg-white/10 pl-3 pr-2">
          <Glyph d="M1 2l4 3-4 3M6 8.5h3.5" />
          <h1 className="font-normal">V1YKsBuilds</h1>
          <span className="ml-3 grid h-5 w-5 place-items-center text-white/70">
            <Glyph d="M2 2l6 6M8 2l-6 6" />
          </span>
        </div>
        <span className="hidden h-9 w-9 place-items-center text-white/70 sm:grid">
          <Glyph d="M5 1v8M1 5h8" />
        </span>
        <span className="hidden h-9 w-7 place-items-center text-white/70 sm:grid">
          <Glyph d="M2 3.5l3 3 3-3" />
        </span>
        <div className="ml-auto hidden h-full text-white/80 sm:flex">
          <span className="grid w-12 place-items-center"><Glyph d="M0 5h10" /></span>
          <span className="grid w-12 place-items-center"><Glyph d="M.5 .5h9v9h-9z" /></span>
          <span className="grid w-12 place-items-center"><Glyph d="M0 0l10 10M10 0L0 10" /></span>
        </div>
      </header>
      <Terminal />
    </section>
  );
}
