"use client";

import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { MotionValue } from "motion/react";
import { ArrowChip } from "@/components/arrow-chip";
import { DownloadCard } from "@/components/download-card";
import { ShaderCanvas } from "@/components/shader-canvas";
import { Nav } from "@/components/nav";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

const START_W = 110;
const START_H = 60;
const FINAL_RADIUS = 40;
const FRAME_INSET = 20;
const BOTTOM_INSET = 0;
const REST_DIM = 0.34;
const DEEP_DIM = 0.78;
const EXPAND_RANGE = 460;
const REVEAL_RANGE = 840;

const PERSIST_WORDS = [
  "The",
  "strategies",
  "that",
  "built",
  "your",
  "business",
  "won't",
  "scale",
  "it",
];

function RevealWord({
  word,
  index,
  count,
  revealStart,
  scrollY,
}: {
  word: string;
  index: number;
  count: number;
  revealStart: number;
  scrollY: MotionValue<number>;
}): ReactNode {
  const step = REVEAL_RANGE / count;
  const start = revealStart + index * step;
  const end = start + step * 1.2;
  const opacity = useTransform(
    scrollY,
    [start, start + step * 0.4, end],
    [0, 0.55, 1],
    { clamp: true }
  );
  const blur = useTransform(scrollY, [start, end], [16, 0], { clamp: true });
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return (
    <motion.span
      className="inline-block will-change-[filter,opacity]"
      style={{ opacity, filter }}
    >
      {word}
    </motion.span>
  );
}

export function Hero(): ReactNode {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const desktopAnchorRef = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const introDim = useMotionValue(0);
  const { scrollY } = useScroll();
  const [travel, setTravel] = useState(720);

  const expand = useTransform(
    scrollY,
    [travel, travel + EXPAND_RANGE],
    [0, 1],
    { clamp: true }
  );

  const insetTop = useTransform(expand, [0, 1], [FRAME_INSET, 0]);
  const insetX = useTransform(expand, [0, 1], [FRAME_INSET, 0]);
  const insetBottom = useTransform(expand, [0, 1], [BOTTOM_INSET, 0]);

  const borderRadius = useTransform([progress, expand], (latest) => {
    const [p, e] = latest as [number, number];
    const viewportH =
      typeof window !== "undefined"
        ? window.innerHeight - FRAME_INSET - BOTTOM_INSET
        : 800;
    const h = START_H + (viewportH - START_H) * p;
    const pillRadius = h / 2;
    const PILL_HOLD = 0.4;
    const t = Math.max(0, (p - PILL_HOLD) / (1 - PILL_HOLD));
    const eased = t * t * (3 - 2 * t);
    const entranceRadius = pillRadius * (1 - eased) + FINAL_RADIUS * eased;
    return entranceRadius * (1 - e);
  });

  const width = useTransform(
    progress,
    (p) => `calc(${START_W}px + (100% - ${START_W}px) * ${p})`
  );
  const height = useTransform(
    progress,
    (p) => `calc(${START_H}px + (100% - ${START_H}px) * ${p})`
  );

  const textY = useTransform(scrollY, (value) => -value);
  const overlay = useTransform([introDim, expand], (latest) => {
    const [dim, expanded] = latest as [number, number];
    return dim + (DEEP_DIM - dim) * expanded;
  });
  const revealStart = travel + EXPAND_RANGE * 0.65;

  useEffect(() => {
    const entrance = animate(progress, 1, {
      duration: 1.8,
      ease: easeOutExpo,
    });
    const dim = animate(introDim, REST_DIM, {
      delay: 1.4,
      duration: 1 / 0.75,
      ease: easeOutExpo,
    });
    return () => {
      entrance.stop();
      dim.stop();
    };
  }, [progress, introDim]);

  useLayoutEffect(() => {
    const measure = () => {
      const button = buttonRef.current;
      const anchor = desktopAnchorRef.current;
      const nav = document.querySelector("nav");
      const mobile = window.innerWidth < 850;
      const target = mobile ? button : anchor;
      if (!target || !nav) return;
      const rect = target.getBoundingClientRect();
      const layoutTop = (mobile ? rect.top : rect.bottom) + window.scrollY;
      const navBottom = nav.getBoundingClientRect().bottom;
      const next = Math.max(120, Math.round(layoutTop - navBottom - 16));
      setTravel((current) => (Math.abs(current - next) < 2 ? current : next));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
  }, [travel]);

  const tail = Math.round(revealStart + REVEAL_RANGE);

  return (
    <>
      <Nav delay={1.3} />

      <section
        className="relative"
        style={{ height: `calc(200vh + ${tail}px)` }}
        aria-label="Introduction"
      >
        <div className="sticky top-0 z-0 h-screen">
          <motion.div
            className="pointer-events-none absolute flex items-center justify-center"
            style={{
              top: insetTop,
              right: insetX,
              bottom: insetBottom,
              left: insetX,
            }}
          >
            <motion.div
              className="relative overflow-hidden bg-[#3a1818]"
              style={{ width, height, borderRadius }}
            >
              <div aria-hidden="true" className="absolute inset-0">
                <ShaderCanvas />
              </div>
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-[#12080c]"
                style={{ opacity: overlay }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0 z-10 flex flex-col justify-between px-[60px] pt-40 pb-10 text-white max-[850px]:px-11 max-[850px]:pt-32 max-[850px]:pb-6"
            style={{ y: textY }}
          >
            <motion.h1
              className="max-w-[18ch] text-[clamp(2.75rem,7.75vw,7.75rem)] leading-[0.95] font-medium tracking-tight"
              initial="hidden"
              animate="visible"
              transition={{ staggerChildren: 0.12, delayChildren: 1.4 }}
            >
              {["Disgustingly good", "PT software."].map((line) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block pb-[0.14em] will-change-transform"
                    variants={{
                      hidden: { y: "110%" },
                      visible: { y: "0%" },
                    }}
                    transition={{ duration: 1, ease: easeOutExpo }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            <div
              ref={desktopAnchorRef}
              className="flex items-end gap-6 max-[850px]:flex-col max-[850px]:items-start min-[850px]:grid min-[850px]:grid-cols-[minmax(10rem,1fr)_min(720px,62%)] min-[850px]:items-start min-[850px]:gap-10"
            >
              <motion.p
                className="max-w-2xl text-2xl leading-snug font-medium tracking-tight text-white/90 min-[850px]:max-w-none"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.55, ease: easeOutExpo }}
              >
                All the tools you need to run your{" "}
                <span className="min-[850px]:hidden">fitness/rehab</span>
                <span className="max-[850px]:hidden">coaching/rehab</span>{" "}
                business.
                <span className="mt-2 block">
                  <span className="line-through decoration-2">None</span>{" "}
                  <span className="font-[family-name:var(--font-schoolbell)] text-[1.35em] leading-none">
                    Some
                  </span>{" "}
                  of the nonsense you don't.
                </span>
              </motion.p>

              <DownloadCard />

              <motion.button
                ref={buttonRef}
                type="button"
                className="group pointer-events-auto inline-flex cursor-pointer items-stretch gap-1 min-[850px]:hidden"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.7, ease: easeOutExpo }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="rounded-md border border-neutral-900/[0.08] bg-white px-5 py-3 text-xs font-medium tracking-widest text-neutral-900 uppercase">
                  Explore the Platform
                </span>
                <ArrowChip className="bg-accent text-accent-foreground" />
              </motion.button>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8">
            <h2 className="max-w-[14ch] text-center text-[clamp(2.6rem,6.4vw,5.75rem)] leading-[0.95] font-medium tracking-tight text-white">
              {PERSIST_WORDS.map((word, index) => (
                <span key={`${word}-${index}`}>
                  <RevealWord
                    word={word}
                    index={index}
                    count={PERSIST_WORDS.length}
                    revealStart={revealStart}
                    scrollY={scrollY}
                  />
                  {index < PERSIST_WORDS.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </section>
    </>
  );
}
