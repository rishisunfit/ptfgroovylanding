"use client";

import { motion, useInView } from "motion/react";
import { Check, Info } from "lucide-react";
import { ArrowChip } from "@/components/arrow-chip";
import Link from "next/link";
import { useId, useRef, type ReactNode } from "react";
import { RevealHeadline } from "./reveal-headline";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

function HollowCheck(): ReactNode {
  const id = useId().replace(/:/g, "");

  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0" aria-hidden>
      <mask id={id}>
        <circle cx="12" cy="12" r="11" fill="white" />
        <path
          d="M7.2 12.4 10.4 15.5 16.8 8.6"
          fill="none"
          stroke="black"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <circle cx="12" cy="12" r="11" fill="white" mask={`url(#${id})`} />
    </svg>
  );
}

type Accent = "mint" | "black";

interface FeatureNote {
  label: string;
  note: string;
}

type Feature = string | FeatureNote;

interface Tier {
  name: string;
  price: string;
  unit?: string;
  body: string;
  cta: { label: string; href: string };
  features: Feature[];
  accent?: Accent;
}

interface CardSurface {
  card: string;
  muted: string;
  body: string;
  feature: string;
  button: string;
  inverted: boolean;
}

const FREE_TIER: Tier = {
  name: "Free tier",
  price: "$0",
  unit: "/ Free forever / Together for a lifetime 🫶🏼",
  body: "The PTFlow platform, ready when you are.",
  cta: { label: "Get started", href: "#get-started" },
  features: [
    "Unlimited Clients",
    "Unlimited Programs & Workouts",
    "Unlimited PTFlow AI Tokens",
    "Web (or mobile) app for clients",
    "Cloud add-on available for $27/mo",
  ],
};

const PRO_SUITE: Tier = {
  name: "Pro Suite",
  price: "$127",
  unit: "/mo",
  body: "The suites and a branded mobile app.",
  cta: { label: "Get started", href: "#get-started" },
  accent: "black",
  features: [
    "Branded mobile app",
    "Custom video uploads",
    "Mobility/movement analysis suite",
    "Video call suite",
    "Nutrition suite",
    "Recovery suite",
    "Marketing & sales suite",
  ],
};

const CUSTOM_APP: Tier = {
  name: "Custom app",
  price: "25+ Clients",
  unit: "/ Minimum / Application only",
  body: "Turn your small business into the biggest, boldest, baddest brand imagineable.",
  cta: { label: "Apply now", href: "mailto:sales@ptflow.io" },
  features: [
    "Everything in Free tier",
    "Custom mobile app",
    "Custom web app",
    "Customized automations + workflows",
    "Custom video player",
    "Video review suite",
    "Mobility analysis suite",
    "Live/video call features",
    "Literally everything else you'll ever need to offer an amazing PT experience",
  ],
};

const WEB_FREE: Tier = {
  ...FREE_TIER,
  features: [
    "Unlimited clients",
    "Unlimited programs & workouts",
    "Unlimited PTFlow AI tokens",
    "Client check-in suite",
    "Form review suite",
    "AI agent suite (unlimited use)",
    "Web (or mobile) app for clients",
    "Cloud add-on available for $27/mo",
  ],
};

const TIERS: Tier[] = [FREE_TIER, { ...CUSTOM_APP, accent: "mint" }];
const WEB_TIERS: Tier[] = [
  PRO_SUITE,
  WEB_FREE,
  {
    ...CUSTOM_APP,
    accent: "mint",
    features: [
      "Everything in Pro Suite",
      {
        label: "Custom mobile app",
        note: "A branded app is PTFlow with your name on it. A custom app is built around how your business runs.",
      },
      "Custom web app",
      "Custom TV app",
      "DFY proven automations & workflows",
      "Direct phone access to the PTF team",
      "An extra $10k a month, guaranteed.",
    ],
  },
];

const HEADLINE = "Two plans. One simple promise, software that ships.";

const BODY =
  "Start on the free tier. When you need a PTFlow built around your team, the custom app is a conversation with sales.";

function featureLabel(feature: Feature): string {
  return typeof feature === "string" ? feature : feature.label;
}

function FeatureInfo({ note, inverted }: { note: string; inverted: boolean }): ReactNode {
  return (
    <span className="group/note relative inline-flex">
      <button
        type="button"
        className={[
          "focus-ring inline-flex size-4 items-center justify-center rounded-full",
          inverted ? "text-white/75 hover:text-white" : "text-foreground/45 hover:text-foreground/70",
        ].join(" ")}
        aria-label="How a custom app differs from a branded app"
      >
        <Info className="size-3.5" strokeWidth={2} aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+10px)] left-0 z-30 w-64 rounded-lg bg-[#173028] px-3 py-2.5 text-left text-[13px] leading-snug font-normal text-white opacity-0 shadow-[0_16px_40px_rgba(20,20,20,0.28)] transition-opacity duration-200 group-focus-within/note:opacity-100 group-hover/note:opacity-100"
      >
        {note}
      </span>
    </span>
  );
}

function TierCard({
  tier,
  index,
  inView,
  forward = false,
}: {
  tier: Tier;
  index: number;
  inView: boolean;
  forward?: boolean;
}): ReactNode {
  const tone = surface(tier.accent);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.8,
        ease: easeOutExpo,
        delay: 0.25 + index * 0.08,
      }}
      className={forward ? "relative z-10 flex" : "relative flex"}
    >
      <div
        className={[
          "group relative flex flex-1 flex-col",
          "rounded-2xl p-7 min-[1200px]:p-10",
          "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          forward
            ? "bg-background shadow-[0_28px_64px_rgba(20,20,20,0.14)] ring-1 ring-foreground/[0.06] min-[850px]:origin-center min-[850px]:scale-[1.05]"
            : tone.card,
        ].join(" ")}
      >
        <div>
          <h3 className="flex flex-wrap items-center gap-3 text-3xl leading-tight font-medium tracking-tight max-[850px]:text-2xl">
            {tier.name}
            {tier.name === "Free tier" ? (
              <span className="hidden items-center rounded-md bg-[#5ec29c] px-3 py-1.5 font-mono text-xs tracking-widest text-white uppercase min-[850px]:inline-flex">
                Start here
              </span>
            ) : null}
          </h3>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-5xl font-medium tracking-tight max-[850px]:text-4xl">
              {tier.price}
            </span>
            {tier.unit ? <span className={tone.muted}>{tier.unit}</span> : null}
          </div>

          <p className={["mt-6 max-w-[42ch] text-sm leading-relaxed", tone.body].join(" ")}>
            {tier.body}
          </p>
        </div>

        <ul className="mt-10 space-y-4">
          {tier.features.map((feature) => {
            const label = featureLabel(feature);
            const note = typeof feature === "string" ? undefined : feature.note;
            return (
              <li key={label} className="flex items-start gap-3 text-sm">
                {tone.inverted ? (
                  <HollowCheck />
                ) : (
                  <Check
                    className="text-foreground/60 mt-0.5 h-4 w-4 shrink-0"
                    strokeWidth={1.6}
                    aria-hidden
                  />
                )}
                <span className={["inline-flex items-center gap-1.5 leading-snug", tone.feature].join(" ")}>
                  {label}
                  {note ? <FeatureInfo note={note} inverted={tone.inverted} /> : null}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto pt-12">
          <Link href={tier.cta.href} className="group/cta inline-flex items-stretch gap-1">
            <span
              className={[
                "rounded-md px-5 py-3 text-xs font-medium tracking-widest uppercase",
                tone.button,
              ].join(" ")}
            >
              {tier.cta.label}
            </span>
            <ArrowChip className={tone.button} name="cta" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function surface(accent: Accent | undefined): CardSurface {
  if (accent === "mint") {
    return {
      card: "bg-[#5ec29c] text-white",
      muted: "text-sm text-white/70",
      body: "text-white/80",
      feature: "text-white/90",
      button: "bg-[#173028] text-white",
      inverted: true,
    };
  }

  if (accent === "black") {
    return {
      card: "bg-black text-white ring-1 ring-inset ring-white/15",
      muted: "text-sm text-white/70",
      body: "text-white/80",
      feature: "text-white/90",
      button: "bg-white text-black",
      inverted: true,
    };
  }

  return {
    card: "bg-foreground/[0.04] text-foreground hover:bg-foreground/[0.06]",
    muted: "text-sm text-foreground/55",
    body: "text-foreground/60",
    feature: "text-foreground/85",
    button: "bg-foreground text-background",
    inverted: false,
  };
}

export function Pricing(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);

  const inView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="bg-background text-foreground relative w-full"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-[1680px] px-10 py-32 max-[850px]:px-6 max-[850px]:py-24">
        <div className="grid grid-cols-12 gap-x-10 gap-y-6 max-[850px]:grid-cols-1">
          <div className="col-span-3 pt-2 max-[1100px]:col-span-12 max-[850px]:col-span-1">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="border-foreground/[0.08] text-foreground/70 inline-flex items-center rounded-md border px-3.5 py-1.5 font-mono text-xs tracking-widest uppercase"
            >
              Pricing
            </motion.span>
          </div>

          <div id="pricing-heading" className="col-span-7 col-start-6 max-[1100px]:col-span-12 max-[1100px]:col-start-1 max-[850px]:col-span-1">
            <RevealHeadline
              delay={0.05}
              className="text-[clamp(2rem,4.2vw,4rem)] leading-[0.85] font-medium tracking-tight text-balance min-[850px]:hidden"
            >
              {HEADLINE}
            </RevealHeadline>
            <RevealHeadline
              delay={0.05}
              className="hidden text-[clamp(2rem,4.2vw,4rem)] leading-[0.85] font-medium tracking-tight text-balance min-[850px]:block"
            >
              Three plans. One simple promise, software that ships.
            </RevealHeadline>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.18 }}
              className="text-foreground/60 mt-6 max-w-[60ch] text-xl leading-snug font-light text-balance max-[850px]:text-lg"
            >
              {BODY}
            </motion.p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 min-[850px]:hidden">
          {TIERS.map((tier, index) => (
            <TierCard key={tier.name} tier={tier} index={index} inView={inView} />
          ))}
        </div>
        <div className="mt-20 hidden grid-cols-3 gap-5 py-8 min-[850px]:grid">
          {WEB_TIERS.map((tier, index) => (
            <TierCard
              key={tier.name}
              tier={tier}
              index={index}
              inView={inView}
              forward={tier.name === "Free tier"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
