"use client";

import { useReducedMotion } from "@/lib/motion";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { motion, useInView } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;
const MOBILE_QUERY = "(max-width: 850px)";

interface Clip {
  src: string;
  poster: string;
  title: string;
  body: string;
  alt: string;
  rate: number;
}

const STREAM = "https://customer-8g7cy0djek05hzgw.cloudflarestream.com";

function clip(id: string, title: string, body: string, alt: string): Clip {
  return {
    src: `${STREAM}/${id}/manifest/video.m3u8`,
    poster: `${STREAM}/${id}/thumbnails/thumbnail.jpg`,
    title,
    body,
    alt,
    rate: 1,
  };
}

const CLIPS: readonly Clip[] = [
  clip(
    "51446fc739201fb2a743929a96cbc0b8",
    "Program sessions in minutes",
    "Another part of the workflow, in the same place as the rest of the work.",
    "Product walkthrough",
  ),
  clip(
    "c359b8239e76fb7077e542a594e9183b",
    "Monitor progress with ease",
    "Recent workouts, the check-in waiting on you, and the lift that just moved, open together.",
    "A client's overview in PTFlow, with recent workouts and a strength chart",
  ),
  clip(
    "dfefcce0e9abfbcfaf2d8c7dda7790ec",
    "Sales made simple",
    "From first interest to a signed client, without adding another tool.",
    "Sales made simple",
  ),
  clip(
    "5444bae43f94584cc712f3e465ed9176",
    "Unlimited custom intelligence",
    "Library, sets, notes, and block order sit together, so a workout comes together without the tab shuffle.",
    "The workout builder, with the exercise library, sets, and notes",
  ),
  clip(
    "05e4debe8556669e10f3069768c44a94",
    "Build advanced marketing funnels",
    "Find a session and place it on the week, so the program stays the one place the work lives.",
    "Building a training week in PTFlow, from the workout finder onto the program",
  ),
];

const COUNT = CLIPS.length;

function highestLevelIndex(levels: readonly { height: number; bitrate: number }[]): number {
  let best = 0;
  for (let index = 1; index < levels.length; index += 1) {
    const level = levels[index];
    const winner = levels[best];
    if (!level || !winner) continue;
    if (level.height > winner.height || (level.height === winner.height && level.bitrate > winner.bitrate)) {
      best = index;
    }
  }
  return best;
}

async function highestNativePlaylist(masterUrl: string): Promise<string> {
  try {
    const body = await fetch(masterUrl).then((response) => {
      if (!response.ok) throw new Error("playlist failed");
      return response.text();
    });
    const lines = body.split(/\r?\n/);
    let bestBandwidth = -1;
    let bestUri = "";
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      if (!line.startsWith("#EXT-X-STREAM-INF")) continue;
      const bandwidth = Number(/BANDWIDTH=(\d+)/.exec(line)?.[1] ?? 0);
      const uri = lines[index + 1]?.trim() ?? "";
      if (!uri || uri.startsWith("#") || bandwidth <= bestBandwidth) continue;
      bestBandwidth = bandwidth;
      bestUri = uri;
    }
    return bestUri ? new URL(bestUri, masterUrl).href : masterUrl;
  } catch {
    return masterUrl;
  }
}

function attachStream(
  video: HTMLVideoElement,
  src: string,
  bufferSeconds?: number,
): Promise<() => void> {
  const releaseNative = (): void => {
    video.pause();
    video.removeAttribute("src");
    video.load();
  };

  return import("hls.js").then(async ({ default: Hls }) => {
    if (!Hls.isSupported()) {
      video.src = await highestNativePlaylist(src);
      return releaseNative;
    }
    const hls = new Hls({
      enableWorker: false,
      capLevelToPlayerSize: false,
      testBandwidth: false,
      abrEwmaDefaultEstimate: 100_000_000,
      ...(bufferSeconds
        ? { maxBufferLength: bufferSeconds, maxMaxBufferLength: bufferSeconds }
        : {}),
    });
    const lockHighest = (levels: readonly { height: number; bitrate: number }[]): void => {
      if (levels.length === 0) return;
      hls.loadLevel = highestLevelIndex(levels);
    };
    hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
      lockHighest(data.levels);
    });
    hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
      const levels = hls.levels;
      const highest = highestLevelIndex(levels);
      if (data.level !== highest) hls.nextLevel = highest;
    });
    hls.loadSource(src);
    hls.attachMedia(video);
    return () => {
      hls.destroy();
    };
  });
}

function ScreenShell({ children }: { children: ReactNode }): ReactNode {
  return (
    <div className="@container w-full">
      <div className="relative aspect-video overflow-hidden rounded-[2.35cqw] bg-black">
        {children}
      </div>
    </div>
  );
}

const ARROW_EASE = "duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]";

function SlideArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}): ReactNode {
  const next = direction === "next";
  const Icon = next ? ArrowRight : ArrowLeft;
  const slide = next ? "group-hover:translate-x-full" : "group-hover:-translate-x-full";
  const incoming = next ? "right-full" : "left-full";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={next ? "Next screen" : "Previous screen"}
      className="group focus-ring bg-foreground/10 text-foreground hover:bg-foreground hover:text-background relative flex size-14 items-center justify-center overflow-hidden rounded-md transition-colors duration-300 disabled:pointer-events-none disabled:opacity-30"
    >
      <span
        className={`absolute inset-0 transition-transform will-change-transform ${ARROW_EASE} ${slide}`}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <Icon width={18} height={18} strokeWidth={1.75} />
        </span>
        <span className={`absolute inset-y-0 ${incoming} flex w-full items-center justify-center`}>
          <Icon width={18} height={18} strokeWidth={1.75} />
        </span>
      </span>
    </button>
  );
}

function ArrowPair({
  active,
  onSelect,
  className = "mt-8",
}: {
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}): ReactNode {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <SlideArrow
        direction="prev"
        disabled={active === 0}
        onClick={() => onSelect(active - 1)}
      />
      <SlideArrow
        direction="next"
        disabled={active === COUNT - 1}
        onClick={() => onSelect(active + 1)}
      />
    </div>
  );
}

function cheatProgress(ratio: number): number {
  const t = Math.min(1, Math.max(0, ratio));
  return Math.pow(t, 0.42);
}

function paintPlayback(node: HTMLSpanElement | null, ratio: number): void {
  if (!node) return;
  const eased = cheatProgress(ratio);
  node.style.transform = `scaleX(${eased})`;
  node.parentElement?.setAttribute("aria-valuenow", String(Math.round(eased * 100)));
}

function holdPlaybackRate(video: HTMLVideoElement, rate: number): () => void {
  const apply = (): void => {
    if (video.playbackRate !== rate) video.playbackRate = rate;
  };
  apply();
  video.addEventListener("loadedmetadata", apply);
  video.addEventListener("play", apply);
  return () => {
    video.removeEventListener("loadedmetadata", apply);
    video.removeEventListener("play", apply);
  };
}

function ChapterBar({
  clip: item,
  index,
  active,
  onSelect,
  onFill,
}: {
  clip: Clip;
  index: number;
  active: number;
  onSelect: (index: number) => void;
  onFill: (index: number, node: HTMLSpanElement | null) => void;
}): ReactNode {
  const selected = index === active;

  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      aria-current={selected ? "true" : undefined}
      className="focus-ring w-full min-w-0 overflow-hidden rounded-md text-left min-[851px]:overflow-visible"
    >
      <span
        className={`block min-h-[2.5em] text-center text-[1.45rem] leading-tight font-medium tracking-tight transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] min-[851px]:min-h-[2.6em] min-[851px]:text-left min-[851px]:text-base min-[1200px]:text-lg ${
          selected ? "text-foreground" : "text-foreground/40"
        }`}
      >
        {item.title}
      </span>
      <span
        className="relative mt-3 block h-[3px]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-label={`${item.title} playback`}
      >
        <span className="bg-foreground/20 absolute inset-x-0 top-1/2 h-px -translate-y-1/2" />
        <span
          ref={(node) => onFill(index, node)}
          className="bg-foreground absolute inset-y-0 left-0 w-full origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </span>
    </button>
  );
}

function Caption({ clip: item, className = "mt-6" }: { clip: Clip; className?: string }): ReactNode {
  return (
    <p
      className={`text-foreground/65 mx-auto max-w-[52ch] text-center text-sm leading-relaxed min-[851px]:text-base ${className}`}
    >
      {item.body}
    </p>
  );
}

function alignChapter(rail: HTMLElement, index: number, behavior: ScrollBehavior): void {
  if (!window.matchMedia(MOBILE_QUERY).matches) {
    rail.scrollLeft = 0;
    return;
  }
  const item = rail.querySelector<HTMLElement>(`[data-chapter="${index}"]`);
  const first = rail.querySelector<HTMLElement>('[data-chapter="0"]');
  if (!item || !first) return;
  const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
  const left = index === COUNT - 1 ? max : Math.max(0, item.offsetLeft - first.offsetLeft);
  rail.scrollTo({ left, behavior });
}

function ProductPlayer({ reduced }: { reduced: boolean }): ReactNode {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fills = useRef<Array<HTMLSpanElement | null>>([]);
  const indexRef = useRef(0);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduced);
  const inView = useInView(frameRef, { amount: 0.35 });
  const shouldLoad = useInView(frameRef, { once: true, margin: "600px 0px" });
  const clip = CLIPS[index] ?? CLIPS[0];

  const onFill = useCallback((barIndex: number, node: HTMLSpanElement | null) => {
    fills.current[barIndex] = node;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !clip || !shouldLoad) return;
    let cancelled = false;
    let detach = (): void => {};
    void attachStream(video, clip.src).then((release) => {
      if (cancelled) release();
      else detach = release;
    });
    const releaseRate = holdPlaybackRate(video, clip.rate);
    return () => {
      cancelled = true;
      detach();
      releaseRate();
    };
  }, [clip, shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || !inView || !playing) return;
    const nextClip = CLIPS[(index + 1) % COUNT];
    if (!nextClip) return;
    const current = videoRef.current;
    const warm = document.createElement("video");
    warm.muted = true;
    warm.playsInline = true;
    warm.preload = "auto";
    warm.setAttribute("aria-hidden", "true");
    warm.tabIndex = -1;
    warm.style.cssText = "position:absolute;width:0;height:0;opacity:0;pointer-events:none";
    frameRef.current?.appendChild(warm);

    let cancelled = false;
    let detach = (): void => {};
    let timer = 0;
    const start = (): void => {
      timer = window.setTimeout(() => {
        void attachStream(warm, nextClip.src, 8).then((release) => {
          if (cancelled) release();
          else detach = release;
        });
      }, 1500);
    };
    if (current && current.readyState >= 3) start();
    else current?.addEventListener("canplay", start, { once: true });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      current?.removeEventListener("canplay", start);
      detach();
      warm.remove();
    };
  }, [shouldLoad, inView, playing, index]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    fills.current.forEach((node, barIndex) => {
      if (barIndex !== index) paintPlayback(node, 0);
    });

    if (!inView || !playing) {
      video.pause();
      paintPlayback(fills.current[index] ?? null, 0);
      return;
    }

    video.loop = false;
    const start = (): void => {
      video.currentTime = 0;
      void video.play().catch(() => {});
    };
    if (video.readyState >= 1) start();
    else video.addEventListener("loadedmetadata", start, { once: true });

    let advanced = false;
    const onEnded = (): void => {
      if (advanced || indexRef.current !== index) return;
      advanced = true;
      const next = (index + 1) % COUNT;
      fills.current.forEach((node) => paintPlayback(node, 0));
      indexRef.current = next;
      setIndex(next);
    };

    let frame = 0;
    const tick = (): void => {
      const duration = video.duration;
      paintPlayback(
        fills.current[index] ?? null,
        Number.isFinite(duration) && duration > 0 ? video.currentTime / duration : 0,
      );
      if (video.ended) onEnded();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    video.addEventListener("ended", onEnded);

    return () => {
      cancelAnimationFrame(frame);
      video.removeEventListener("loadedmetadata", start);
      video.removeEventListener("ended", onEnded);
    };
  }, [inView, playing, index]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    alignChapter(rail, index, reduced ? "auto" : "smooth");
    const onResize = (): void => alignChapter(rail, index, "auto");
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [index, reduced]);

  const goTo = (next: number): void => {
    const clamped = Math.max(0, Math.min(COUNT - 1, next));
    if (clamped === indexRef.current) return;
    fills.current.forEach((node) => paintPlayback(node, 0));
    indexRef.current = clamped;
    setIndex(clamped);
    if (reduced) setPlaying(false);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>): void => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    goTo(indexRef.current + (dx < 0 ? 1 : -1));
  };

  const onTabsKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    goTo(indexRef.current + (event.key === "ArrowRight" ? 1 : -1));
  };

  if (!clip) return null;

  return (
    <div
      ref={frameRef}
      onKeyDown={onTabsKeyDown}
      className="mx-auto w-full max-w-[1240px] pb-16 min-[851px]:px-10 min-[851px]:pb-24"
    >
      <div className="px-6 min-[851px]:px-0">
        <ScreenShell>
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              drag.current = null;
            }}
            className="absolute inset-0 touch-pan-y"
          >
            <motion.div
              key={clip.src}
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <video
                ref={videoRef}
                className="pointer-events-none h-full w-full object-cover"
                poster={clip.poster}
                muted
                playsInline
                preload={shouldLoad ? "metadata" : "none"}
                disablePictureInPicture
                aria-label={clip.alt}
              />
            </motion.div>
          </div>
          {reduced && !playing ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="focus-ring bg-foreground text-background absolute top-1/2 left-1/2 z-20 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md"
              aria-label={`Play ${clip.title}`}
            >
              <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" />
            </button>
          ) : null}
        </ScreenShell>
      </div>

      <div
        ref={railRef}
        className="relative mt-8 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] min-[851px]:mt-10 min-[851px]:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max gap-4 px-6 min-[851px]:grid min-[851px]:w-full min-[851px]:grid-cols-5 min-[851px]:gap-6 min-[851px]:px-0">
          {CLIPS.map((item, itemIndex) => (
            <div
              key={item.src}
              data-chapter={itemIndex}
              className="w-[calc((100vw-2.5rem)/1.5)] shrink-0 overflow-hidden min-[851px]:w-full min-[851px]:overflow-visible"
            >
              <ChapterBar
                clip={item}
                index={itemIndex}
                active={index}
                onFill={onFill}
                onSelect={goTo}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 min-[851px]:px-0">
        <ArrowPair className="mt-6 min-[851px]:mt-8" active={index} onSelect={goTo} />
        <motion.div
          key={clip.src}
          aria-live="polite"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOutExpo }}
        >
          <Caption clip={clip} />
        </motion.div>
      </div>
    </div>
  );
}

export function LaptopShowcase(): ReactNode {
  const reduced = useReducedMotion();
  return <ProductPlayer reduced={reduced} />;
}
