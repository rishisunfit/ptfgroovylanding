"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { FillablePtflowMark, PtflowMark } from "@/components/nav";

interface Card {
  label: string;
  title: string;
  points: string[];
  mark: "x" | "check";
  surface: string;
  ink: string;
  muted: string;
  chip: string;
}

const CARDS: Card[] = [
  {
    label: "Before",
    title: "Spread thin across docs, apps, and naps",
    points: [
      "Great programming takes too long.",
      "Zero customization over tools.",
      "Expensive AI integrations.",
      "Locked into workflows.",
    ],
    mark: "x",
    surface: "bg-[#f5f5e9] dark:bg-[#23231e]",
    ink: "text-[#242424] dark:text-[#f4f1e8]",
    muted: "text-[#242424]/60 dark:text-[#f4f1e8]/60",
    chip: "bg-[#242424] text-white",
  },
  {
    label: "After",
    title: "Better programs. More clients. YOUR platform.",
    points: [
      "Training plans built in minutes.",
      "121+ custom tools.",
      "Ethical AI, free forever.",
      "Build a workflow for YOUR style.",
    ],
    mark: "check",
    surface: "bg-[#5ec29c] dark:bg-[#3e9a74]",
    ink: "text-white",
    muted: "text-white/80",
    chip: "bg-white text-[#173028]",
  },
];

const CYCLE_WORDS = ["speed", "style", "soul"] as const;
const CYCLE_MS = 1250;

function CyclingWord(): ReactNode {
  const [autoIndex, setAutoIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [arrival, setArrival] = useState<"mid" | "settle" | "run">("mid");
  const rootRef = useRef<HTMLSpanElement>(null);
  const current = autoIndex;
  const intro = desktop && arrival !== "run";

  useLayoutEffect(() => {
    const media = window.matchMedia("(min-width: 850px)");
    const apply = () => setDesktop(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) {
      setAutoIndex(0);
      setArrival("mid");
      return;
    }
    if (!desktop) {
      setArrival("run");
      const id = window.setInterval(() => {
        setAutoIndex((value) => (value + 1) % CYCLE_WORDS.length);
      }, CYCLE_MS);
      return () => window.clearInterval(id);
    }
    setArrival("settle");
    const settle = window.setTimeout(() => setArrival("run"), 230);
    const id = window.setInterval(() => {
      setAutoIndex((value) => (value + 1) % CYCLE_WORDS.length);
    }, CYCLE_MS);
    return () => {
      window.clearTimeout(settle);
      window.clearInterval(id);
    };
  }, [inView, desktop]);

  return (
    <span
      ref={rootRef}
      className="inline-grid overflow-hidden align-baseline text-left text-[#5ec29c]"
    >
      {CYCLE_WORDS.map((word, i) => {
        const active = i === current;
        const previous = i === (current + CYCLE_WORDS.length - 1) % CYCLE_WORDS.length;
        const entering = word === "speed";
        const leaving = word === "soul";
        let y = "110%";
        let opacity = 0;
        if (intro && current === 0) {
          if (entering) {
            y = arrival === "mid" ? "55%" : "0%";
            opacity = arrival === "mid" ? 0.55 : 1;
          } else if (leaving) {
            y = arrival === "mid" ? "-55%" : "-110%";
            opacity = arrival === "mid" ? 0.55 : 0;
          }
        } else {
          y = active ? "0%" : previous ? "-110%" : "110%";
          opacity = active ? 1 : 0;
        }
        const moving = intro ? entering || leaving : active || previous;
        return (
          <motion.span
            key={word}
            aria-hidden={intro ? word !== "speed" : !active}
            className="col-start-1 row-start-1 pb-[0.08em]"
            initial={false}
            animate={{ y, opacity }}
            transition={{
              duration: !moving || arrival === "mid" ? 0 : intro ? 0.23 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </span>
  );
}

function BeforeLogo(): ReactNode {
  const ref = useRef<HTMLSpanElement>(null);
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let frame = 0;
    const measure = () => {
      setFilled(node.getBoundingClientRect().top <= window.innerHeight * 0.46);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <span ref={ref} className="flex size-11 items-center justify-center rounded-full bg-white text-[#242424]">
      <FillablePtflowMark filled={filled} className="size-8" />
    </span>
  );
}

function ComparisonCard({
  card,
  className,
  id,
  ref,
}: {
  card: Card;
  className: string;
  id?: string;
  ref?: (el: HTMLElement | null) => void;
}): ReactNode {
  return (
    <article ref={ref} id={id} className={`${className} ${card.surface} ${card.ink}`}>
      <p className={`text-[15px] font-medium tracking-[-0.01em] ${card.muted}`}>
        {card.label}
      </p>
      <div className={card.label === "Before" ? "mt-4 hidden items-center min-[850px]:flex" : "mt-4 flex items-center"}>
        {card.label === "Before" ? (
          <BeforeLogo />
        ) : (
          <span className="flex size-11 items-center justify-center rounded-full bg-white">
            <PtflowMark className="size-8" />
          </span>
        )}
      </div>
      <h3 className="mt-7 max-w-[18ch] text-[clamp(1.7rem,2.2vw,2.35rem)] font-medium leading-[1.08] tracking-tight">
        {card.title}
      </h3>
      <ul className="mt-auto flex flex-col gap-3.5 pt-8">
        {card.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-[15px] leading-snug">
            <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${card.chip}`}>
              {card.mark === "x" ? (
                <X className="size-3.5" strokeWidth={2.6} />
              ) : (
                <Check className="size-3.5" strokeWidth={2.6} />
              )}
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

const metrics = {
  mobile: false,
  cardW: 440,
  cardH: 600,
  gap: 28,
};

function measure(pin: HTMLElement): void {
  const w = pin.clientWidth;
  const h = pin.clientHeight;
  metrics.mobile = w < 850;
  metrics.gap = 28;
  const side = metrics.mobile ? 40 : 80;
  metrics.cardW = Math.min(480, Math.floor((w - side - metrics.gap) / 2));
  metrics.cardH = Math.round(Math.min(h * 0.76, 700));
}

function slot(index: number): number {
  const { cardW, gap } = metrics;
  const total = cardW * 2 + gap;
  const start = -total / 2 + cardW / 2;
  return start + index * (cardW + gap);
}

export function ValueProp(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const headline = headlineRef.current;
    const cards = cardRefs.current.filter((el): el is HTMLElement => el !== null);
    if (!section || !pin || !headline || cards.length !== CARDS.length) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    const [before, after] = cards as [HTMLElement, HTMLElement];
    let timeline: gsap.core.Timeline | null = null;

    const applySize = () => {
      cards.forEach((el) => {
        gsap.set(el, { width: metrics.cardW, height: metrics.cardH });
      });
    };

    const build = () => {
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
      timeline = null;
      measure(pin);
      if (metrics.mobile) {
        gsap.set(cards, { clearProps: "all" });
        gsap.set(headline, { clearProps: "all" });
        return;
      }
      applySize();

      const rise = () => Math.round(pin.clientHeight * 0.92);
      gsap.set(cards, {
        xPercent: -50,
        yPercent: -50,
        left: "50%",
        top: "48%",
        x: 0,
        y: rise,
        scale: 1,
        opacity: 0,
        zIndex: 24,
      });
      gsap.set(before, { opacity: 1, zIndex: 30, force3d: true });
      gsap.set(after, { opacity: 1, zIndex: 24, force3d: true });
      gsap.set(headline, { autoAlpha: 1 });

      timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
          scrub: true,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: () => {
            measure(pin);
            applySize();
          },
        },
      });

      const tl = timeline;
      tl.to(before, { y: 0, duration: 1, ease: "none" }, 0);
      tl.to(after, { y: 0, duration: 1, ease: "none" }, 0);
      tl.to(headline, { autoAlpha: 0, duration: 0.28, ease: "none" }, 0.62);
      tl.to(before, { x: () => slot(0), duration: 1, ease: "power2.inOut" }, 1);
      tl.to(after, { x: () => slot(1), duration: 1, ease: "power2.inOut" }, 1);
      tl.to({}, { duration: 0.15 }, 2);
    };

    build();
    const onResize = () => {
      const wasMobile = metrics.mobile;
      measure(pin);
      if (wasMobile !== metrics.mobile) {
        build();
        return;
      }
      if (metrics.mobile) return;
      applySize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      timeline?.scrollTrigger?.kill();
      timeline?.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-30 -mt-[100vh] bg-background text-foreground"
      aria-label="But PTFlow helps you deliver with speed"
    >
      <div
        ref={pinRef}
        className="relative w-full bg-background max-[849px]:overflow-visible max-[849px]:px-5 max-[849px]:pb-16 min-[850px]:h-screen min-[850px]:overflow-hidden"
      >
        <h2
          ref={headlineRef}
          className="pointer-events-none z-20 flex items-center justify-center px-6 max-[849px]:relative max-[849px]:px-1 max-[849px]:pt-28 max-[849px]:pb-8 min-[850px]:absolute min-[850px]:inset-0"
        >
          <motion.span
            className="block max-w-[26ch] text-center text-[clamp(2.7rem,6.2vw,5.15rem)] font-medium leading-[1.02] tracking-tight text-[#2a2a2a] dark:text-foreground"
            initial={{ y: -48, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block">But PTFlow helps you</span>
            <span className="block">
              deliver with <CyclingWord />
            </span>
          </motion.span>
        </h2>

        {CARDS.map((card, index) => (
          <ComparisonCard
            key={card.label}
            card={card}
            {...(card.label === "Before" ? { id: "before-mark" } : {})}
            className="flex flex-col rounded-[32px] px-8 pt-8 pb-8 max-[849px]:relative max-[849px]:mb-4 max-[849px]:w-full sm:px-10 sm:pt-9 min-[850px]:absolute min-[850px]:z-30 min-[850px]:opacity-0"
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
          />
        ))}
      </div>
    </section>
  );
}
