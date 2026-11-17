"use client";

import { motion, useInView } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowChip } from "./arrow-chip";
import { LaptopShowcase } from "./product-laptop";
import { RevealHeadline } from "./reveal-headline";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;
const webStill = "min-[850px]:transform-none! min-[850px]:opacity-100!";

function DemoIntro(): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div
      ref={ref}
      className="mx-auto max-w-[1680px] px-10 pt-24 pb-6 max-[850px]:px-6 max-[850px]:pt-16 max-[850px]:pb-10"
    >
      <div className="grid grid-cols-12 gap-x-10 gap-y-6 max-[850px]:grid-cols-1">
        <div className="col-span-3 pt-2 max-[1100px]:col-span-12 max-[850px]:col-span-1">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
            className="inline-flex items-center rounded-md border border-accent-foreground/[0.12] px-3.5 py-1.5 font-mono text-xs tracking-widest uppercase text-accent-foreground/70"
          >
            Product demo
          </motion.span>
        </div>

        <div className="col-span-7 col-start-6 max-[1100px]:col-span-12 max-[1100px]:col-start-1 max-[850px]:col-span-1">
          <RevealHeadline
            id="demo-heading"
            delay={0.05}
            stillOnDesktop
            className="text-[clamp(2rem,4.2vw,4rem)] leading-[0.9] font-medium tracking-tight text-balance"
          >
            See how it works.
          </RevealHeadline>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.16 }}
            className={`mt-6 max-w-[46ch] text-xl leading-snug font-light text-balance text-accent-foreground/65 max-[850px]:text-lg ${webStill}`}
          >
            From the week you plan, to the session you build, to the client you
            stay close to.
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export function Product(): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);

  const inView = useInView(sectionRef, { once: true, amount: 0 });

  return (
    <section
      ref={sectionRef}
      id="product"
      className="bg-background text-foreground relative w-full pt-32 pb-0 max-[850px]:pt-24"
      aria-labelledby="product-heading"
    >
      <div className="mx-auto max-w-[1680px] px-10 max-[850px]:px-6">
        <div className="grid grid-cols-12 gap-x-10 gap-y-6 max-[850px]:grid-cols-1">
          <div className="col-span-3 pt-2 max-[1100px]:col-span-12 max-[850px]:col-span-1">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="border-foreground/[0.08] text-foreground/70 inline-flex items-center rounded-md border px-3.5 py-1.5 font-mono text-xs tracking-widest uppercase"
            >
              Our offer
            </motion.span>
          </div>

          <div id="product-heading" className="col-span-7 col-start-6 max-[1100px]:col-span-12 max-[1100px]:col-start-1 max-[850px]:col-span-1">
            <RevealHeadline
              delay={0.05}
              accentFrom={8}
              className="text-[clamp(2rem,4.2vw,4rem)] leading-[0.85] font-medium tracking-tight text-balance min-[850px]:hidden"
            >
              Build everything your business needs to actually move clients
              forward
            </RevealHeadline>
            <RevealHeadline
              delay={0.05}
              accentFrom={7}
              className="hidden text-[clamp(2rem,4.2vw,4rem)] leading-[0.85] font-medium tracking-tight text-balance min-[850px]:block"
            >
              Build everything your business needs to move clients forward
            </RevealHeadline>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.18 }}
              className="text-foreground/65 mt-8 max-w-[60ch] text-base leading-relaxed text-balance max-[850px]:text-sm"
            >
              <span className="font-bold">
                90% of online fitness coaches will never have more than 8 clients at a
                time.
              </span>
              <span className="block">
                But PTFlow is made for the 10% of coaches that dream a little
                bit bigger.
              </span>
              <span className="mt-4 block">Build better programs.</span>
              <span className="block">Close more clients.</span>
              <span className="block">
                And do it on a platform you're proud to stamp your name on.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.28 }}
              className="mt-10"
            >
              <Link
                href="#demo"
                className="group inline-flex items-stretch gap-1"
              >
                <span className="bg-foreground text-background rounded-md px-5 py-3 text-xs font-medium tracking-widest uppercase">
                  Discover the platform
                </span>
                <ArrowChip className="bg-foreground text-background" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-24 max-[850px]:mt-16">
        <div
          id="demo"
          aria-labelledby="demo-heading"
          className="relative w-full rounded-[50px] bg-accent text-accent-foreground [--background:var(--accent)] [--foreground:var(--accent-foreground)] [--ring:var(--accent-foreground)] max-[850px]:pb-12"
        >
          <DemoIntro />
          <LaptopShowcase />
        </div>
      </div>
    </section>
  );
}

