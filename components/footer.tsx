"use client";

import Link from "next/link";
import { ArrowChip } from "@/components/arrow-chip";
import { PtflowMark } from "@/components/nav";
import type { ReactNode } from "react";

const PRODUCT_LINKS = [
  { label: "Platform", href: "#product" },
  { label: "Workflows", href: "#product" },
  { label: "Integrations", href: "#product" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#" },
];

const COMPANY_LINKS = [
  { label: "About", href: "#" },
  { label: "Demo", href: "#demo" },
  { label: "Careers", href: "#" },
  { label: "Press", href: "#" },
  { label: "Contact", href: "#" },
];

const RESOURCES_LINKS = [
  { label: "Documentation", href: "#" },
  { label: "API reference", href: "#" },
  { label: "Status", href: "#" },
  { label: "Security", href: "#" },
  { label: "Trust center", href: "#" },
];

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Cookies", href: "#" },
];

export function Footer(): ReactNode {
  return (
    <footer
      id="contact"

      className="min-[851px]:sticky min-[851px]:bottom-0 z-0 bg-background text-foreground flex flex-col"
    >
      <div className="mx-auto w-full max-w-[1680px] px-6 lg:px-10 pt-24 lg:pt-32">
        <span className="inline-flex items-center rounded-md border border-foreground/[0.08] px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-foreground/70">
          Get in touch
        </span>
        <div className="mt-6 text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tighter leading-[0.95] max-w-5xl">
          <p className="block">
            Build with intent.
          </p>
          <p

            className="block text-foreground/55"
          >
            Ship without limits.
          </p>
        </div>

        <div className="mt-12">
          <Link
            href="mailto:hello@ptflow.io"
            className="group inline-flex items-stretch gap-1"
          >
            <span className="rounded-md bg-foreground px-5 py-3 text-xs font-medium uppercase tracking-widest text-background">
              hello@ptflow.io
            </span>
            <ArrowChip className="bg-foreground text-background" />
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1680px] px-6 lg:px-10 mt-24 lg:mt-32 py-16 lg:py-20 grid grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        <div className="col-span-2 lg:col-span-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-xl font-medium tracking-tight"
          >
            <PtflowMark className="size-8 shrink-0" />
            PTFlow
          </Link>
          <p className="mt-4 text-foreground/55 max-w-xs leading-relaxed">
            The shared surface where teams design, deploy, and scale
            modern software — without the seams between tools.
          </p>
        </div>

        <FooterColumn title="Product" links={PRODUCT_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
        <FooterColumn title="Resources" links={RESOURCES_LINKS} />
        <FooterColumn title="Connect" links={SOCIAL_LINKS} external />
      </div>

      <div className="mt-auto">
        <div className="mx-auto w-full max-w-[1680px] px-6 lg:px-10 py-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between text-sm text-foreground/55">
          <p>© 2026 PTFlow Labs, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterColumnProps {
  title: string;
  links: ReadonlyArray<{ label: string; href: string }>;

  external?: boolean;
}

function FooterColumn({ title, links, external }: FooterColumnProps): ReactNode {
  return (
    <div className="col-span-1 lg:col-span-2">
      <h4 className="font-mono text-xs uppercase tracking-widest text-foreground/55 mb-5">
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-foreground/85 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
