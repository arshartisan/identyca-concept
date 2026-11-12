"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { RiExternalLinkLine, RiPlayFill } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Poster-first video: loads nothing until play is pressed.
 * Pass `webm` (VP9/AV1 + Opus) to support Chromium builds without H.264/AAC
 * (Electron/editor preview panes). If loading fails, an "open in a new tab" fallback shows.
 */
export function VideoPlayer({
  src,
  webm,
  poster,
  title,
  className,
}: {
  src: string;
  webm?: string;
  poster?: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [unsupported, setUnsupported] = useState(false);

  // Start playback as soon as the <video> is actually mounted (the click gave us user activation).
  // Calling play() from a rAF raced React's commit, so the ref was often still null.
  const startOnMount = useCallback((el: HTMLVideoElement | null) => {
    if (!el) return;
    el.play().catch(() => {
      // Sound-on autoplay refused (e.g. Safari power saving): retry muted rather than sit at 0:00.
      el.muted = true;
      el.play().catch(() => {});
    });
  }, []);

  const play = () => setPlaying(true);

  return (
    <figure
      className={cx(
        "group relative aspect-video overflow-hidden rounded-3xl border border-border-hairline-strong bg-surface-ink",
        "shadow-[0_30px_80px_-30px_rgb(0_0_0/0.35)]",
        className,
      )}
    >
      {playing && unsupported ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/70 p-6 text-center text-white">
          <p className="text-body-medium max-w-sm text-white/80">This video couldn&apos;t load here.</p>
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-body-medium text-neutral-950"
          >
            Open video in a new tab
            <RiExternalLinkLine className="size-4" aria-hidden />
          </a>
        </div>
      ) : playing ? (
        <video
          ref={startOnMount}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="auto"
          className="absolute inset-0 size-full object-cover"
          title={title}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          {/* With <source> children, load failures fire on the source, not the video. */}
          <source src={src} type="video/mp4" onError={() => setUnsupported(true)} />
        </video>
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
