import { Icon, type IconName } from "./icons";

const tile =
  "grid place-items-center rounded-2xl border-[3px] border-ink bg-cream shadow-[5px_5px_0_0_#1d1d1b]";

function AppIcon({
  icon,
  label,
  className,
}: {
  icon: IconName;
  label: string;
  className: string;
}) {
  return (
    <div className={`absolute flex w-20 flex-col items-center gap-1.5 ${className}`}>
      <div className={`${tile} h-[76px] w-[76px]`}>
        <Icon name={icon} className="h-10 w-10" />
      </div>
      <span className="text-sm font-bold">{label}</span>
    </div>
  );
}

function FolderIcon({
  label,
  className,
  size,
}: {
  label?: string;
  className: string;
  size: string;
}) {
  return (
    <div className={`absolute flex flex-col items-center gap-1.5 ${className}`}>
      <div className="drop-shadow-[5px_5px_0_#1d1d1b]">
        <Icon name="folder" className={`${size} fill-cream text-ink`} />
      </div>
      {label && <span className="text-sm font-bold">{label}</span>}
    </div>
  );
}

/* Desktop clutter behind the window. Hidden on small screens. */
export default function DesktopIcons() {
  return (
    <div aria-hidden="true" className="pointer-events-none hidden md:block">
      <AppIcon icon="face" label="Home" className="-left-[62px] -top-[72px]" />
      <AppIcon icon="compass" label="Radar" className="-left-[62px] top-[78px]" />
      <AppIcon icon="grid" label="Apps" className="-left-[62px] top-[218px]" />
      <FolderIcon size="h-14 w-14" className="right-[130px] -top-[58px]" />
      <FolderIcon size="h-20 w-20" label="docs" className="-right-[78px] -top-[84px]" />
    </div>
  );
}
