"use client";

import { motion, useInView } from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ArrowChip } from "@/components/arrow-chip";
import { ShaderCanvas } from "@/components/shader-canvas";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

const HEADLINE_LINES = ["Ship the work,", "skip the waiting."] as const;

const fieldLabel =
  "mb-2.5 block text-[15px] font-medium tracking-[-0.02em] text-[#242424]";

const control =
  "w-full bg-white/55 text-[15px] tracking-[-0.015em] text-[#242424] outline-none placeholder:text-[#5c5c5c] focus-visible:bg-white/80 focus-visible:ring-2 focus-visible:ring-[#242424]/15";

function RequiredMark(): ReactNode {
  return (
    <span className="text-[#e5484d]" aria-hidden>
      {" "}
      *
    </span>
  );
}

function ClientSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}): ReactNode {
  const max = 100;
  const fill = (value / max) * 100;
  const display = value >= max ? "100+" : String(value);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="text-[15px] font-medium tracking-[-0.02em] text-[#242424]">
          How many clients?
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.02em] tabular-nums">
          {display}
        </span>
      </div>
      <div className="relative flex h-8 items-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full bg-[#242424]"
          style={{ width: `${fill}%` }}
        />
        <input
          type="range"
          name="clients"
          min={0}
          max={max}
          step={1}
          value={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={display}
          onChange={(event) => onChange(Number(event.target.value))}
          className="relative z-10 h-6 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none [&::-moz-range-thumb]:size-[22px] [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[#242424] [&::-webkit-slider-thumb]:size-[22px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[#242424] [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
        />
      </div>
      <div className="mt-1 flex justify-between text-[12px] tracking-[-0.01em] text-[#242424]/55">
        <span>0</span>
        <span>100+</span>
      </div>
    </div>
  );
}

function MobileDownloadForm(): ReactNode {
  const [clients, setClients] = useState(20);
  const [agreed, setAgreed] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sentTo) return;
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [sentTo]);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSentTo(String(data.get("email") ?? ""));
  }

  if (sentTo) {
    return (
      <div
        ref={cardRef}
        className="overflow-hidden rounded-[26px] border border-white/60 bg-white/30 px-6 py-7 text-[#242424] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl"
      >
        <h2 className="max-w-[14ch] text-[1.7rem] leading-[1.12] font-medium tracking-[-0.035em]">
          Check your inbox.
        </h2>
        <p className="mt-4 max-w-[32ch] text-[16px] leading-snug tracking-[-0.02em] text-[#242424]/75">
          We&apos;ll send the download link to {sentTo}. Open it on a computer
          to install PTFlow for Mac or Windows.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-[26px] border border-white/60 bg-white/30 text-[#242424] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-2xl"
    >
      <div className="px-6 pt-7 pb-5">
        <h2 className="text-[1.55rem] leading-[1.18] font-medium tracking-[-0.035em]">
          This is the only PT software worth using. Pinky promise. Yours in 10
          seconds.
        </h2>

        <div className="mt-8 flex flex-col gap-6">
          <label>
            <span className={fieldLabel}>
              Name
              <RequiredMark />
            </span>
            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              className={`${control} h-[52px] rounded-full px-5`}
            />
          </label>

          <label>
            <span className={fieldLabel}>
              Email
              <RequiredMark />
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="you@studio.com"
              className={`${control} h-[52px] rounded-full px-5`}
            />
          </label>

          <label>
            <span className={fieldLabel}>Social Media Handle</span>
            <input
              name="social"
              type="text"
              autoComplete="off"
              placeholder="@yourstudio"
              className={`${control} h-[52px] rounded-full px-5`}
            />
          </label>

          <ClientSlider value={clients} onChange={setClients} />

          <label className="flex cursor-pointer items-center gap-3 text-[15px] leading-snug tracking-[-0.015em] has-[:focus-visible]:outline-none">
            <input
              type="checkbox"
              name="terms"
              required
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={[
                "flex size-[18px] shrink-0 items-center justify-center rounded-full border bg-white/50",
                agreed ? "border-[#242424]" : "border-[#242424]/35",
              ].join(" ")}
            >
              <span
                className={[
                  "size-2 rounded-full bg-[#242424]",
                  agreed ? "opacity-100" : "opacity-0",
                ].join(" ")}
              />
            </span>
            By submitting, you agree to our terms of service.
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-[#242424]/10 px-6 py-5">
        <button
          type="submit"
          className="group inline-flex shrink-0 cursor-pointer items-stretch gap-1"
        >
          <span className="rounded-md bg-[#242424] px-5 py-3 text-xs font-medium tracking-widest text-white uppercase">
            Send the link
          </span>
          <ArrowChip className="bg-[#242424] text-white" />
        </button>
      </div>
    </form>
  );
}

export function FinalCta(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      id="get-started"
      className="bg-background text-foreground relative w-full scroll-mt-28"
      aria-label="Get the PTFlow download"
    >
      <div className="mx-auto max-w-[1680px] px-10 pb-32 max-[850px]:px-4 max-[850px]:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 1, ease: easeOutExpo }}
          className="relative min-h-[520px] overflow-hidden rounded-3xl bg-[#3a1818] max-[850px]:min-h-0 max-[850px]:rounded-[28px]"
        >
          <div aria-hidden className="absolute inset-0">
            <ShaderCanvas />
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10 max-[850px]:hidden"
          />

          <div className="relative z-10 hidden h-full min-h-[inherit] flex-col justify-between p-14 text-white min-[850px]:flex">
            <motion.h2
              id="final-cta-heading"
              className="max-w-[16ch] text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-medium tracking-tight"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              transition={{ staggerChildren: 0.12, delayChildren: 0.15 }}
            >
              {HEADLINE_LINES.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.05em]">
                  <motion.span
                    className="block will-change-transform"
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
            </motion.h2>

            <div className="mt-10 flex items-end justify-between gap-8">
              <motion.p
                className="font-regular max-w-xl text-3xl leading-snug tracking-tighter text-white/75"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.6 }}
              >
                Spin up a workspace in under a minute. The free tier is ready
                when you are, no card, no calls, no friction.
              </motion.p>

              <motion.button
                type="button"
                className="group inline-flex shrink-0 cursor-pointer items-stretch gap-1"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="rounded-md border border-neutral-900/[0.08] bg-white px-5 py-3 text-xs font-medium tracking-widest text-neutral-900 uppercase">
                  Get PTFlow
                </span>
                <ArrowChip className="bg-white text-neutral-900" />
              </motion.button>
            </div>
          </div>

          <div className="relative z-10 px-2.5 py-9 min-[850px]:hidden">
            <MobileDownloadForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
