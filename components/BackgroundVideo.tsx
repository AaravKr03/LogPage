"use client";

import { useEffect, useRef } from "react";

/** Full-screen looping gradient video. Falls back to the poster frame if the
 *  visitor prefers reduced motion or autoplay is blocked. */
export default function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src="/bg.mp4"
      poster="/bg-poster.jpg"
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full object-cover"
    />
  );
}
