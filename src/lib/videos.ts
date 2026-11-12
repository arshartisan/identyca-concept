/**
 * Video sources. Deliberately NOT in components/site/video-player.tsx: that file
 * is "use client", and a Server Component importing plain values from a client
 * module receives client references, not the values, so every `VIDEOS.x` was
 * `undefined` on the server and the players rendered with no file at all.
 */
export const R2 = "https://pub-ef4926f03e79462ab0c0771d4c95c635.r2.dev/";

export const VIDEOS = {
  realtime: `${R2}Identyca%20Real%20Time%20product%20explainer%20video.mp4`,
  intelligence: `${R2}Identyca%20Event%20Intelligence%20product%20explainer%20video.mp4`,
  organizerWalkthrough: `${R2}Identyca%20-%20Event%20Organizer%20Intelligence%20Explainer_1080p.mp4`,
  inAction: `${R2}Identyca%20draft%20video%20%232%20ver1-%20Google%20Flow.mp4`,
  avatar: `${R2}Identyca%20avatar%20style%20video.mp4`,
} as const;

/**
 * WebM (VP9 + Opus) twins, served from /public. Listed before the MP4 in
 * <source> order, so Chrome/Edge/Firefox take the (smaller) WebM and Safari
 * falls back to the MP4. Also lets the videos play in Chromium builds that ship
 * without H.264 (editor/Electron preview panes).
 */
export const WEBM = {
  realtime: "/videos/identyca-realtime-explainer.webm",
} as const;

export const POSTERS = {
  inAction: `${R2}identyca-poster_2.png`,
  avatar: `${R2}identyca-poster.png`,
} as const;
