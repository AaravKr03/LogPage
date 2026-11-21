import { Icon } from "./icons";

function Prompt() {
  return <span className="font-bold">V1YKsBuilds@web:~$</span>;
}

export default function RetroWindow() {
  return (
    <section
      aria-label="V1YKsBuilds"
      className="flex h-[min(78vh,640px)] min-h-[460px] flex-col overflow-hidden rounded-[22px] border-4 border-ink bg-cream shadow-[20px_20px_0_0_#1d1d1b]"
    >
      {/* Title bar */}
      <header className="relative flex h-14 shrink-0 items-center border-b-4 border-ink px-4">
        <div className="flex gap-1" aria-hidden="true">
          <span className="h-6 w-6 rounded-full border-[3px] border-ink bg-ink" />
          <span className="h-6 w-6 rounded-full border-[3px] border-ink" />
          <span className="h-6 w-6 rounded-full border-[3px] border-ink" />
        </div>
        <h1 className="pointer-events-none absolute inset-x-0 text-center text-2xl font-bold tracking-tight">
          V1YKsBuilds
        </h1>
      </header>

      {/* Status row */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b-[3px] border-ink px-5 font-bold">
        <span className="truncate"># terminal</span>
        <span className="flex items-center gap-4">
          <span className="hidden text-sm sm:inline">Session: [guest]</span>
          <Icon name="gear" />
          <Icon name="star" />
        </span>
      </div>

      {/* Terminal */}
      <div className="flex-1 overflow-y-auto px-6 py-5 text-[17px] leading-7">
        <Prompt />
        <p className="mt-5">Welcome to V1YKsBuilds.</p>
        <ul className="mt-5">
          <li>[1] Register</li>
          <li>[2] Login</li>
        </ul>
        <p className="mt-5">
          <Prompt />{" "}
          <span className="cursor inline-block h-[1.15em] w-[0.6em] translate-y-[3px] bg-ink" />
        </p>
      </div>

      {/* Input bar (static for now) */}
      <div className="flex h-16 shrink-0 items-center gap-4 border-t-[3px] border-ink px-5">
        <span className="min-w-0 flex-1 truncate font-bold text-ink-mute">Type 1 or 2…</span>
        <button
          type="button"
          disabled
          className="rounded-lg border-[3px] border-ink bg-cream px-8 py-1.5 font-bold shadow-[3px_3px_0_0_#1d1d1b]"
        >
          Enter
        </button>
      </div>
    </section>
  );
}
