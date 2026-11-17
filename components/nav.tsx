"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useId, useState, type ReactNode } from "react";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

const links = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
] as const;

interface NavProps {
  delay?: number;
}

const BODY =
  "M2808.74,1663.21h-.06c-64.7-37.23-143.67-24.39-213.25-13.09l-14.08,2.28c-179.11,28.77-335.31,16.3-464.54-36.67-104.34-42.72-231.71-125.89-340.81-222.51-160.77-142.37-276.41-264.13-388.22-381.86-123.67-130.27-240.48-253.32-406.38-391.93-20.5-17.29-47.91-24.45-74.21-19.2-27.47,5.19-50.94,22.23-64.33,46.74-78.23,142.5-120.7,264.06-137.8,394.09-37.79,287.9,47.73,569.31,228.69,752.8,155.59,157.75,369.02,237.08,575.36,313.77l46.8,17.53c207.26,77.67,439.72,176.82,573.94,371.06,73.47,106.19,111.07,179.17,126.07,305.99,2,16,10,16,25.5,10.62,253.44-199.92,524.05-455.15,609.44-833.25,12.6-55.88,44.02-243.87-82.11-316.36Z";
const HEAD =
  "M2231.78,1254.92c249.37,0,452.25-202.88,452.25-452.25s-202.88-452.25-452.25-452.25-452.25,202.88-452.25,452.25,202.88,452.25,452.25,452.25Z";
const TAIL =
  "M1551.9,2498.15c-3.89-2.1-8.52-2.47-12.72-.99-4.14,1.48-7.53,4.69-9.26,8.77-20.44,48.53-36.98,98.91-52.97,147.68l-1.23,3.95c-71.68,218.81-288.2,557.89-377.91,693.47-14.69,22.1-14.26,50.38,1.05,71.87,12.16,17.04,31.24,26.67,51.49,26.67,5.37,0,10.8-.74,16.24-2.1,216.46-56.06,647.16-196.95,888.45-369.33,5.99-4.32,8.21-12.1,5.37-19.02-124.22-295.37-378.04-491.58-508.49-560.97Z";

export function PtflowMark({ className = "" }: { className?: string }): ReactNode {
  return (
    <svg viewBox="171 270 3260 3260" className={className} aria-hidden="true">
      <path d={BODY} fill="#5ec29c" />
      <path d={HEAD} fill="#242424" />
      <path d={TAIL} fill="#242424" />
    </svg>
  );
}

export function FillablePtflowMark({
  className = "",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}): ReactNode {
  const uid = useId().replace(/:/g, "");
  const rise = (delay: string): React.CSSProperties => ({
    transform: filled ? "translateY(0)" : "translateY(110%)",
    transformBox: "fill-box",
    transformOrigin: "center bottom",
    transition: `transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}`,
  });

  return (
    <svg viewBox="171 270 3260 3260" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${uid}-body`}>
          <path d={BODY} />
        </clipPath>
        <clipPath id={`${uid}-head`}>
          <path d={HEAD} />
        </clipPath>
        <clipPath id={`${uid}-tail`}>
          <path d={TAIL} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-body)`}>
        <rect x="0" y="200" width="3600" height="3400" fill="#5ec29c" style={rise("0s")} />
      </g>
      <g clipPath={`url(#${uid}-head)`}>
        <rect x="1600" y="200" width="1400" height="1400" fill="#242424" style={rise("0.12s")} />
      </g>
      <g clipPath={`url(#${uid}-tail)`}>
        <rect x="900" y="2100" width="1600" height="1600" fill="#242424" style={rise("0.22s")} />
      </g>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="136"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          opacity: filled ? 0 : 1,
          transition: filled ? "opacity 0.35s ease 0.28s" : "opacity 0.25s ease",
        }}
      >
        <path d={BODY} />
        <path d={HEAD} />
        <path d={TAIL} />
      </g>
    </svg>
  );
}

function useHideDock(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;

    const measure = (): void => {
      const desktop = window.matchMedia("(min-width: 850px)").matches;
      const demo = document.getElementById("demo");
      if (!desktop || !demo) {
        setHidden(false);
        return;
      }
      setHidden(demo.getBoundingClientRect().top < window.innerHeight * 0.92);
    };

    const onScroll = (): void => {
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

  return hidden;
}

function useLogoFill(): boolean {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const cta = document.querySelector("#get-started");
    let frame = 0;

    const measure = () => {
      const nav = document.querySelector("nav");
      const mobile = window.innerWidth < 850;
      const target = mobile
        ? document.querySelector('[aria-label="But PTFlow helps you deliver with speed"]')
        : document.getElementById("before-mark");
      if (!target) return;
      const line = nav?.getBoundingClientRect().bottom ?? 160;
      const top = target.getBoundingClientRect().top;
      const ctaTop = cta?.getBoundingClientRect().top ?? Infinity;
      setFilled(top <= line && ctaTop > line);
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

  return filled;
}

function Wordmark({
  className = "",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}): ReactNode {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <FillablePtflowMark filled={filled} className="size-[34px] shrink-0 text-foreground/70" />
      <span className="text-[16px] font-semibold tracking-[-0.03em]">
        PTFlow
      </span>
    </span>
  );
}

function Avatar(): ReactNode {
  return (
    <svg
      viewBox="0 0 60 60"
      className="size-[60px] shrink-0"
      aria-hidden="true"
    >
      <rect width="60" height="60" fill="#d7ebe3" />
      <circle cx="30" cy="24" r="10" fill="#242424" />
      <path
        d="M8 62c2-16 10-24 22-24s20 8 22 24"
        fill="#242424"
      />
    </svg>
  );
}

export function Nav({ delay = 1.4 }: NavProps): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const logoFilled = useLogoFill();
  const dockHidden = useHideDock();
  const dock = dockHidden
    ? { opacity: 0, y: -18 }
    : { opacity: 1, y: 0 };

  useEffect(() => {
    const id = window.setTimeout(() => setEntered(true), delay * 1000 + 900);
    return () => window.clearTimeout(id);
  }, [delay]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const enter = {
    hidden: { opacity: 0, y: -12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-8 pt-9 min-[850px]:px-5 min-[850px]:pt-5 min-[1200px]:px-[30px] min-[1200px]:pt-[30px]"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.08, delayChildren: delay }}
    >
      <div className="flex items-center justify-between gap-4">
        <motion.div
          className={`hidden h-[60px] items-center gap-5 rounded-full bg-white pr-2 pl-[17px] text-[#242424] shadow-[0_10px_30px_rgba(20,20,20,0.08)] min-[850px]:flex ${dockHidden ? "pointer-events-none" : "pointer-events-auto"}`}
          initial={{ opacity: 0, y: -12 }}
          animate={dock}
          aria-hidden={dockHidden}
          inert={dockHidden}
          transition={{ duration: dockHidden ? 0.4 : 0.7, ease: easeOutExpo, delay: entered || dockHidden ? 0 : delay }}
        >
          <a
            href="/"
            aria-label="PTFlow home"
            className="focus-ring rounded-full"
          >
            <Wordmark filled={logoFilled} />
          </a>
          <div className="flex items-center">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="focus-ring rounded-full px-3.5 py-2 text-[14px] font-semibold tracking-[-0.03em] text-[#242424] transition-colors duration-200 hover:bg-[#5dc39b]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          aria-hidden={dockHidden}
          inert={dockHidden}
          className={`hidden min-[850px]:inline-flex ${dockHidden ? "pointer-events-none" : "pointer-events-auto"}`}
          initial={{ opacity: 0, y: -12 }}
          animate={dock}
          transition={{ duration: dockHidden ? 0.4 : 0.7, ease: easeOutExpo, delay: entered || dockHidden ? 0 : delay + 0.08 }}
        >
          <Link
            href="/login"
            className="focus-ring inline-flex h-[60px] items-center rounded-full bg-[#242424] pr-0 pl-7 text-[14px] font-semibold tracking-[-0.03em] text-[#fafaf7] transition-colors duration-200 hover:bg-[#5dc39b] hover:text-[#242424]"
          >
            Sign in now
            <span className="ml-5 overflow-hidden rounded-full">
              <Avatar />
            </span>
          </Link>
        </motion.div>

        <motion.div
          className="pointer-events-auto w-full min-[850px]:hidden"
          variants={enter}
          transition={{ duration: 0.7, ease: easeOutExpo }}
        >
          <div className="flex h-[60px] items-center justify-between rounded-full bg-white pr-3 pl-[17px] text-[#242424] shadow-[0_10px_30px_rgba(20,20,20,0.08)]">
            <a
              href="/"
              aria-label="PTFlow home"
              className="focus-ring rounded-full"
            >
              <Wordmark filled={logoFilled} />
            </a>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="focus-ring relative flex size-9 items-center justify-center rounded-full bg-[#f7f7ed]"
            >
              <span className="relative block h-[13px] w-5" aria-hidden="true">
                <motion.span
                  className="absolute left-0 h-0.5 w-5 rounded-full bg-[#292929]"
                  animate={menuOpen ? { top: 5.5, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={{ duration: 0.25, ease: easeOutExpo }}
                />
                <motion.span
                  className="absolute top-[5.5px] left-0 h-0.5 w-5 rounded-full bg-[#292929]"
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute left-0 h-0.5 w-5 rounded-full bg-[#292929]"
                  animate={
                    menuOpen
                      ? { top: 5.5, rotate: -45 }
                      : { top: 11, rotate: 0 }
                  }
                  transition={{ duration: 0.25, ease: easeOutExpo }}
                />
              </span>
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="mobile-menu"
                className="mt-2 overflow-hidden rounded-[30px] bg-white text-[#242424] shadow-[0_10px_30px_rgba(20,20,20,0.08)]"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: easeOutExpo }}
              >
                <ul className="flex flex-col gap-5 border-t border-[#e3e3e3]/45 px-[17px] py-5">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="focus-ring block rounded-lg text-[25px] leading-none font-semibold tracking-[-0.03em]"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="focus-ring mt-1 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#242424] text-[14px] font-semibold tracking-[-0.03em] text-[#fafaf7]"
                    >
                      Sign in now
                    </Link>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.nav>
  );
}
