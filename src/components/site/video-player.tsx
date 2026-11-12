"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RiPlayFill } from "@remixicon/react";
import { cx } from "@/utils/cx";

export const R2 = "https://pub-ef4926f03e79462ab0c0771d4c95c635.r2.dev/";

export const VIDEOS = {
  realtime: `${R2}Identyca%20Real%20Time%20product%20explainer%20video.mp4`,
  intelligence: `${R2}Identyca%20Event%20Intelligence%20product%20explainer%20video.mp4`,
  organizerWalkthrough: `${R2}Identyca%20-%20Event%20Organizer%20Intelligence%20Explainer_1080p.mp4`,
  inAction: `${R2}Identyca%20draft%20video%20%232%20ver1-%20Google%20Flow.mp4`,
  avatar: `${R2}Identyca%20avatar%20style%20video.mp4`,
} as const;

export const POSTERS = {
  inAction: `${R2}identyca-poster_2.png`,
  avatar: `${R2}identyca-poster.png`,
} as const;

/** Poster-first video: loads nothing until play is pressed. */
export function VideoPlayer({
  src,
  poster,
  title,
  className,
}: {
  src: string;
  poster?: string;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setPlaying(true);
    requestAnimationFrame(() => ref.current?.play().catch(() => {}));
  };

  return (
    <figure
      className={cx(
        "group relative aspect-video overflow-hidden rounded-3xl border border-border-hairline-strong bg-surface-ink",
        "shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)]",
        className,
      )}
    >
      {playing ? (
        <video ref={ref} src={src} poster={poster} controls playsInline className="absolute inset-0 size-full object-cover" title={title} />
      ) : (
        <button
          type="button"
          onClick={play}
          className="absolute inset-0 flex size-full items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring focus-visible:ring-inset"
          aria-label={`Play video: ${title}`}
        >
          {poster ? (
            <Image
              src={poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              unoptimized={poster.startsWith("http")}
            />
          ) : (
            <span aria-hidden className="bg-grid absolute inset-0 opacity-40 [--color-grid-line:rgb(255_255_255/0.06)]" />
          )}
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-white/90 text-neutral-950 shadow-lg backdrop-blur transition-transform duration-200 ease-out group-hover:scale-105 sm:size-20">
            <RiPlayFill className="size-7 translate-x-0.5 sm:size-8" aria-hidden />
          </span>
          <figcaption className="absolute start-5 bottom-5 text-start text-headline-medium text-white sm:start-6 sm:bottom-6">{title}</figcaption>
        </button>
      )}
    </figure>
  );
}
