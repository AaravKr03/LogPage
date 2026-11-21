const paths = {
  gear: (
    <>
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2 2M16.7 16.7l2 2M18.7 5.3l-2 2M7.3 16.7l-2 2" />
    </>
  ),
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
};

export function Icon({ name, className = "h-6 w-6" }: { name: keyof typeof paths; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
