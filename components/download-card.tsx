"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const easeOutExpo = [0.33, 1, 0.68, 1] as const;

function DownloadButton({
  children,
  compact = false,
}: {
  children: string;
  compact?: boolean;
}): ReactNode {
  return (
    <button
      type="button"
      className={`focus-ring w-full cursor-pointer rounded-xl bg-[#161616] px-3 font-bold leading-tight tracking-[-0.02em] text-white transition-[background-color,transform] duration-200 hover:bg-[#2a2a2a] active:scale-[0.99] ${compact ? "min-h-[52px] py-3 text-[13px]" : "h-[52px] text-[13px] min-[1100px]:h-14 min-[1100px]:text-[15px]"}`}
    >
      {children}
    </button>
  );
}

const DESKTOP_PLATFORMS = [
  {
    logo: "/logos/apple.png",
    name: "macOS",
    button: "Download for Apple",
    note: "macOS 12.6 or higher is recommended",
    compactLogo: "h-12 w-auto",
    wideLogo: "h-11 w-auto min-[1100px]:h-14",
  },
  {
    logo: "/logos/windows.png",
    name: "Windows",
    button: "Download for Windows",
    note: "Windows 10 or higher is recommended",
    compactLogo: "h-10 w-auto",
    wideLogo: "h-9 w-auto min-[1100px]:h-12",
  },
] as const;

const PHONE_PLATFORMS = [
  {
    logo: "/logos/apple.png",
    name: "iPhone",
    button: "Download for iPhone",
    note: "iOS 16 or later",
    compactLogo: "h-12 w-auto",
    wideLogo: "h-12 w-auto",
  },
  {
    logo: "/logos/android.png",
    name: "Android",
    button: "Download for Android",
    note: "Android 8 or later",
    compactLogo: "h-12 w-auto",
    wideLogo: "h-12 w-auto",
  },
] as const;

export function DownloadCard({
  delay = 2.2,
  compact = false,
  className = "hidden w-full min-[850px]:block",
  client = false,
}: {
  delay?: number;
  compact?: boolean;
  className?: string;
  client?: boolean;
}): ReactNode {
  const platforms = client ? PHONE_PLATFORMS : DESKTOP_PLATFORMS;
  return (
    <motion.aside
      aria-label="Download PTFlow"
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay, ease: easeOutExpo }}
    >
      <div
        className={`bg-[#f4f1ea] text-[#1a1a1a] shadow-[0_24px_60px_-16px_rgba(24,8,12,0.42)] ring-1 ring-white/80 ${compact ? "rounded-[28px] px-6 pt-6 pb-5" : "rounded-[30px] px-5 pt-6 pb-5 min-[1100px]:px-8 min-[1100px]:pt-8 min-[1100px]:pb-6"}`}
      >
        <div className="text-center">
          <h2
            className={`leading-none font-bold tracking-[-0.04em] ${compact ? "text-[1.7rem]" : "text-[1.65rem] min-[1100px]:text-[2rem]"}`}
          >
            {client ? "Get the app" : "Download for free"}
          </h2>
          <p
            className={`text-center leading-snug text-balance text-[#5c5c5c] ${compact ? "mt-2.5 text-[14px]" : "mt-3 text-[13px] min-[1100px]:text-[15px] min-[1100px]:text-nowrap"}`}
          >
            {client
              ? "Your coach's plan, on your phone. If something breaks, "
              : "If you encounter any issues, "}
            just{" "}
            <a
              href="mailto:hello@ptflow.io"
              className="focus-ring font-semibold whitespace-nowrap text-[#5ec29c] underline decoration-[#5ec29c]/40 underline-offset-[3px] transition-colors hover:text-[#3e9a74] hover:decoration-[#3e9a74]"
            >
              let us know
            </a>
            . We&apos;re always here to help.
          </p>
        </div>

        <div className={`grid grid-cols-2 ${compact ? "mt-5 gap-x-4" : "mt-6 gap-x-4 min-[1100px]:mt-8 min-[1100px]:gap-x-8"}`}>
          {platforms.map((platform) => (
            <div key={platform.name} className="flex flex-col">
              <div className={`flex items-center justify-center ${compact ? "h-14" : "h-12 min-[1100px]:h-16"}`}>
                <img
                  src={platform.logo}
                  alt=""
                  className={compact ? platform.compactLogo : platform.wideLogo}
                />
              </div>
              <p className={`text-center leading-none font-bold tracking-[-0.04em] ${compact ? "mt-2 text-[1.35rem]" : "mt-2 text-[1.45rem] min-[1100px]:mt-3 min-[1100px]:text-[1.7rem]"}`}>
                {platform.name}
              </p>
              <div className={compact ? "mt-4" : "mt-4 min-[1100px]:mt-6"}>
                <DownloadButton compact={compact}>{platform.button}</DownloadButton>
              </div>
              <p className={`text-center leading-snug text-[#6d6d6d] ${compact ? "mt-3 text-[12px]" : "mt-3 text-[12px] min-[1100px]:mt-4 min-[1100px]:text-sm"}`}>
                {platform.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
