import { Icon } from "./icons";

const channels = [
  { name: "welcome", active: true },
  { name: "register" },
  { name: "login" },
  { name: "contracts" },
];

const hardShadow = "shadow-[3px_3px_0_0_#1d1d1b]";

function Prompt() {
  return <span className="font-bold">V1YKsBuilds@web:~$</span>;
}

export default function RetroWindow() {
  return (
    <section
      aria-label="V1YKsBuilds"
      className="relative z-10 flex h-[min(78vh,640px)] min-h-[480px] flex-col overflow-hidden rounded-[22px] border-4 border-ink bg-cream shadow-[20px_20px_0_0_#1d1d1b]"
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

      {/* Toolbar */}
      <div className="flex h-12 shrink-0 border-b-[3px] border-ink">
        <div className="flex w-[34%] max-w-[280px] min-w-[150px] items-center gap-5 border-r-[3px] border-ink px-5 sm:w-[calc(34%+20px)]">
          <Icon name="plus" />
          <Icon name="folderPlus" />
          <Icon name="userPlus" />
          <Icon name="mail" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-4 font-bold">
          <span className="truncate"># terminal</span>
          <span className="flex items-center gap-4">
            <span className="hidden text-sm sm:inline">Session: [guest]</span>
            <Icon name="gear" />
            <Icon name="star" />
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Sidebar */}
        <aside className="hidden w-[34%] max-w-[260px] shrink-0 overflow-hidden p-4 sm:block">
          <div
            className={`flex items-center justify-between rounded-lg border-[3px] border-ink py-1.5 pl-3 pr-1.5 font-bold ${hardShadow}`}
          >
            <span>V1YKsBuilds</span>
            <span className="grid h-7 w-7 place-items-center rounded-[4px] bg-ink text-[10px] text-cream">
              ▼
            </span>
          </div>

          <div className="mt-6 flex items-center gap-2.5 font-bold">
            <Icon name="chat" />
            Session
          </div>

          <div className="mt-5 flex items-center gap-2.5 font-bold">
            <span className="grid h-5 w-5 place-items-center rounded-[4px] border-[3px] border-ink bg-ink text-cream">
              <span className="h-[3px] w-2.5 bg-cream" />
            </span>
            <Icon name="folder" />
            Channels
          </div>
          <ul className="mt-1 ml-[9px]">
            {channels.map((c) => (
              <li
                key={c.name}
                className="relative py-1.5 pl-10 font-bold before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:bg-ink after:absolute after:left-0 after:top-1/2 after:h-[3px] after:w-8 after:-translate-y-1/2 after:bg-ink last:before:h-1/2"
              >
                <span className={c.active ? "" : "text-ink-mute"}># {c.name}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-2.5 font-bold">
            <span className="grid h-5 w-5 place-items-center rounded-[4px] border-[3px] border-ink">
              <Icon name="plus" className="h-3 w-3" />
            </span>
            <Icon name="user" />
            Contracts
          </div>
        </aside>

        {/* Scrollbar column (decorative) */}
        <div
          aria-hidden="true"
          className="hidden w-5 shrink-0 flex-col border-x-[3px] border-ink sm:flex"
        >
          <span className="grid h-4 place-items-center bg-ink text-[8px] text-cream">▲</span>
          <div className="dither relative flex-1">
            <span className="absolute inset-x-0 top-0 h-10 border-b-[3px] border-ink bg-cream" />
          </div>
          <span className="grid h-4 place-items-center bg-ink text-[8px] text-cream">▼</span>
        </div>

        {/* Terminal pane */}
        <div className="flex min-w-0 flex-1 flex-col">
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

          {/* Input bar (static for Phase 1) */}
          <div className="flex h-16 shrink-0 items-center gap-4 border-t-[3px] border-ink px-5">
            <span className="min-w-0 flex-1 truncate font-bold text-ink-mute">
              Type 1 or 2…
            </span>
            <button
              type="button"
              disabled
              className={`rounded-lg border-[3px] border-ink bg-cream px-8 py-1.5 font-bold ${hardShadow}`}
            >
              Enter
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
