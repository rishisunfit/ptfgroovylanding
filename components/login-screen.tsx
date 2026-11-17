"use client";

import { DownloadCard } from "@/components/download-card";
import { PtflowMark } from "@/components/nav";
import { ShaderCanvas } from "@/components/shader-canvas";
import {
  ChartLine,
  ClipboardCheck,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  Magnet,
  Mail,
  MessageSquare,
  Smartphone,
  Sparkles,
  Star,
  TrendingUp,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState, type FormEvent, type ReactNode } from "react";

const ACCENT = "#5ec29c";
const INK = "#242424";
const EASING = "cubic-bezier(0.16, 1, 0.3, 1)";
const DURATION = 700;
const FRAME_INSET = 20;
const FRAME_RADIUS = 40;
const easeOutExpo = [0.33, 1, 0.68, 1] as const;

export function LoginScreen(): ReactNode {
  const [isSignUp, setIsSignUp] = useState(false);
  const slide = `left ${DURATION}ms ${EASING}, right ${DURATION}ms ${EASING}`;

  return (
    <div id="main" className="relative min-h-screen overflow-hidden bg-white">
      <AuthPanel isSignUp={isSignUp} onToggle={setIsSignUp} slide={slide} />
      <MarketingPanel isSignUp={isSignUp} slide={slide} />
    </div>
  );
}

const FEATURES = [
  {
    Icon: Magnet,
    label: "Lead capture",
    desc: "Turn cold traffic into hot leads",
  },
  {
    Icon: Dumbbell,
    label: "Program builder",
    desc: "Drag-and-drop periodization",
  },
  {
    Icon: ChartLine,
    label: "Reports",
    desc: "Data-driven check-ins without lifting a finger",
  },
  {
    Icon: ClipboardCheck,
    label: "Assessments",
    desc: "Automated movement screens",
  },
  {
    Icon: TrendingUp,
    label: "Sales tracking",
    desc: "Pipeline visibility",
  },
  {
    Icon: Smartphone,
    label: "Mobile app",
    desc: "Your brand, their pocket",
  },
  {
    Icon: Sparkles,
    label: "AI agents",
    desc: "Knows how you coach",
  },
  {
    Icon: MessageSquare,
    label: "Messaging",
    desc: "Threads that build trust",
  },
] as const;

function BrandLockup(): ReactNode {
  return (
    <div className="mb-8 flex items-center gap-2.5">
      <PtflowMark className="size-8" />
      <span
        className="text-2xl font-semibold tracking-[-0.04em]"
        style={{ color: INK }}
      >
        PTFlow
      </span>
    </div>
  );
}

function AuthPanel({
  isSignUp,
  onToggle,
  slide,
}: {
  isSignUp: boolean;
  onToggle: (next: boolean) => void;
  slide: string;
}): ReactNode {
  return (
    <div
      className="absolute top-0 bottom-0 z-10 flex w-full items-center justify-center overflow-y-auto bg-white p-6 lg:w-1/2 lg:p-12"
      style={{ left: isSignUp ? "50%" : "0%", transition: slide }}
    >
      <div className="relative w-full max-w-md py-8">
        <div
          style={{
            opacity: isSignUp ? 0 : 1,
            pointerEvents: isSignUp ? "none" : "auto",
            position: isSignUp ? "absolute" : "relative",
            inset: isSignUp ? 0 : undefined,
            visibility: isSignUp ? "hidden" : "visible",
            transition: `opacity 500ms ${EASING}`,
          }}
        >
          <SignInForm onSignUp={() => onToggle(true)} />
        </div>
        <div
          style={{
            opacity: isSignUp ? 1 : 0,
            pointerEvents: isSignUp ? "auto" : "none",
            position: isSignUp ? "relative" : "absolute",
            inset: isSignUp ? undefined : 0,
            visibility: isSignUp ? "visible" : "hidden",
            transition: `opacity 500ms ${EASING}`,
          }}
        >
          <SignUpForm onSignIn={() => onToggle(false)} />
        </div>
        <DownloadCard
          delay={0.45}
          compact
          className="mt-8 block w-full lg:hidden"
        />
      </div>
    </div>
  );
}

function SignInForm({ onSignUp }: { onSignUp: () => void }): ReactNode {
  const [showPass, setShowPass] = useState(false);

  const submit = (e: FormEvent): void => {
    e.preventDefault();
  };

  return (
    <>
      <ClipLine delay={0.05}>
        <BrandLockup />
      </ClipLine>
      <div className="mb-8">
        <ClipLine delay={0.18}>
          <h1
            className="mb-2 text-3xl font-semibold tracking-[-0.04em]"
            style={{ color: INK }}
          >
            Welcome back
          </h1>
        </ClipLine>
        <ClipLine delay={0.3}>
          <p className="text-[15px] text-[#242424]/55">
            Please enter your details to sign in
          </p>
        </ClipLine>
      </div>

      <motion.form
        onSubmit={submit}
        className="space-y-5"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.38, ease: easeOutExpo }}
      >
        <Field
          label="Email"
          icon={<Mail size={18} />}
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
        />
        <Field
          label="Password"
          icon={<Lock size={18} />}
          type={showPass ? "text" : "password"}
          placeholder="Enter your password"
          autoComplete="current-password"
          showToggle
          shown={showPass}
          onToggle={() => setShowPass((v) => !v)}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="size-4 rounded border-[#d8d8d4]"
              style={{ accentColor: ACCENT }}
            />
            <span className="text-sm text-[#242424]/70">Remember me</span>
          </label>
          <button
            type="button"
            className="text-sm font-semibold hover:opacity-80"
            style={{ color: ACCENT }}
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(36,36,36,0.12)] transition-colors duration-200 hover:bg-[#5ec29c] hover:text-[#242424]"
          style={{ backgroundColor: INK }}
        >
          Sign in
        </button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.48, ease: easeOutExpo }}
      >
        <Divider label="or continue with Google" />
        <GoogleButton label="Continue with Google" />

        <p className="mt-8 text-center text-sm text-[#242424]/70">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onSignUp}
            className="font-semibold hover:opacity-80"
            style={{ color: ACCENT }}
          >
            Sign up
          </button>
        </p>
      </motion.div>
    </>
  );
}

function SignUpForm({ onSignIn }: { onSignIn: () => void }): ReactNode {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const submit = (e: FormEvent): void => {
    e.preventDefault();
  };

  return (
    <>
      <ClipLine delay={0.05}>
        <BrandLockup />
      </ClipLine>
      <div className="mb-8">
        <ClipLine delay={0.18}>
          <h1
            className="mb-2 text-3xl font-semibold tracking-[-0.04em]"
            style={{ color: INK }}
          >
            Create an account
          </h1>
        </ClipLine>
        <ClipLine delay={0.3}>
          <p className="text-[15px] text-[#242424]/55">
            Get started with your free account
          </p>
        </ClipLine>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Field
          label="Full name"
          icon={<User size={18} />}
          placeholder="Enter your full name"
          autoComplete="name"
        />
        <Field
          label="Email"
          icon={<Mail size={18} />}
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
        />
        <Field
          label="Password"
          icon={<Lock size={18} />}
          type={showPass ? "text" : "password"}
          placeholder="Create a password"
          autoComplete="new-password"
          showToggle
          shown={showPass}
          onToggle={() => setShowPass((v) => !v)}
        />
        <Field
          label="Confirm password"
          icon={<Lock size={18} />}
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm your password"
          autoComplete="new-password"
          showToggle
          shown={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />

        <label className="flex cursor-pointer items-start gap-2">
          <input
            type="checkbox"
            className="mt-0.5 size-4 rounded border-[#d8d8d4]"
            style={{ accentColor: ACCENT }}
          />
          <span className="text-sm text-[#242424]/70">
            I agree to the{" "}
            <span className="font-semibold" style={{ color: ACCENT }}>
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="font-semibold" style={{ color: ACCENT }}>
              Privacy Policy
            </span>
          </span>
        </label>

        <button
          type="submit"
          className="w-full rounded-xl py-3 text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(36,36,36,0.12)] transition-colors duration-200 hover:bg-[#5ec29c] hover:text-[#242424]"
          style={{ backgroundColor: INK }}
        >
          Create account
        </button>
      </form>

      <Divider label="or continue with Google" />
      <GoogleButton label="Sign up with Google" />

      <p className="mt-8 text-center text-sm text-[#242424]/70">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSignIn}
          className="font-semibold hover:opacity-80"
          style={{ color: ACCENT }}
        >
          Sign in
        </button>
      </p>
    </>
  );
}

function Field({
  label,
  icon,
  type = "text",
  placeholder,
  autoComplete,
  showToggle,
  shown,
  onToggle,
}: {
  label: string;
  icon: ReactNode;
  type?: string;
  placeholder: string;
  autoComplete?: string;
  showToggle?: boolean;
  shown?: boolean;
  onToggle?: () => void;
}): ReactNode {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#242424]/80">
        {label}
      </label>
      <div className="relative">
        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-[#242424]/35">
          {icon}
        </span>
        <input
          type={type}
          placeholder={placeholder}
          required
          autoComplete={autoComplete}
          className="w-full rounded-xl border border-[#e6e6e2] bg-white py-3 pr-4 pl-12 text-[15px] text-[#242424] transition-shadow outline-none placeholder:text-[#242424]/35 focus:border-transparent focus:ring-2 focus:ring-[#5ec29c]"
          style={showToggle ? { paddingRight: "3rem" } : undefined}
        />
        {showToggle ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={shown ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-[#242424]/35 hover:text-[#242424]/70"
          >
            {shown ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Divider({ label }: { label: string }): ReactNode {
  return (
    <div className="relative my-5 text-center text-sm text-[#242424]/45">
      <span className="relative z-10 bg-white px-3">{label}</span>
      <div className="absolute inset-x-0 top-1/2 h-px bg-[#e6e6e2]" aria-hidden />
    </div>
  );
}

function GoogleButton({ label }: { label: string }): ReactNode {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#e6e6e2] bg-white py-3 text-[15px] font-medium text-[#242424] shadow-[0_1px_2px_rgba(36,36,36,0.04)] transition-colors hover:bg-[#f7f7f4]"
    >
      <GoogleMark />
      {label}
    </button>
  );
}

function GoogleMark(): ReactNode {
  return (
    <svg viewBox="0 0 18 18" className="size-[18px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

function ClipLine({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}): ReactNode {
  return (
    <span className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, delay, ease: easeOutExpo }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function RevealLines({
  lines,
  className,
}: {
  lines: readonly string[];
  className?: string;
}): ReactNode {
  return (
    <motion.h2
      className={className}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.12, delayChildren: 0.12 }}
    >
      {lines.map((line) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block pb-[0.12em]"
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
  );
}

function MarketingPanel({
  isSignUp,
  slide,
}: {
  isSignUp: boolean;
  slide: string;
}): ReactNode {
  const fade = `opacity 500ms ${EASING}, transform ${DURATION}ms ${EASING}`;

  return (
    <div
      className="absolute hidden overflow-hidden bg-[#141416] lg:block"
      style={{
        top: FRAME_INSET,
        bottom: 0,
        left: isSignUp ? FRAME_INSET : "50%",
        right: isSignUp ? "50%" : FRAME_INSET,
        borderRadius: FRAME_RADIUS,
        transition: slide,
      }}
    >
      <ShaderCanvas variantId="mint" />
      <div className="pointer-events-none absolute inset-0 bg-[#121214]/35" aria-hidden />

      <div className="relative z-10 h-full overflow-y-auto px-8 pt-8 pb-6 xl:px-10 xl:pt-10">
        <div
          style={{
            opacity: isSignUp ? 0 : 1,
            pointerEvents: isSignUp ? "none" : "auto",
            position: isSignUp ? "absolute" : "relative",
            inset: isSignUp ? 0 : undefined,
            visibility: isSignUp ? "hidden" : "visible",
            transition: fade,
          }}
          aria-hidden={isSignUp}
        >
          <RevealLines
            lines={["Everything you need", "to run your coaching business"]}
            className="text-[1.7rem] leading-[1.05] font-semibold tracking-[-0.04em] text-white xl:text-3xl"
          />

          <motion.div
            className="mt-4 grid grid-cols-2 gap-2.5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: easeOutExpo }}
          >
            {FEATURES.map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 rounded-xl border border-white/15 bg-[#121214]/45 px-3.5 py-3 backdrop-blur-[2px]"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white">
                  <f.Icon className="size-3.5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] leading-tight font-semibold text-white">
                    {f.label}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/60">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          <DownloadCard delay={0.5} compact className="mt-4 block w-full" />
        </div>

        <div
          className="flex h-full items-center"
          style={{
            opacity: isSignUp ? 1 : 0,
            pointerEvents: isSignUp ? "auto" : "none",
            position: isSignUp ? "relative" : "absolute",
            inset: isSignUp ? undefined : 0,
            visibility: isSignUp ? "visible" : "hidden",
            transition: fade,
          }}
          aria-hidden={!isSignUp}
        >
          <div className="max-w-md text-white">
            <RevealLines
              lines={["Start your journey", "with us"]}
              className="text-4xl font-semibold tracking-[-0.04em]"
            />
            <p className="mt-4 text-lg text-white/75">
              Join thousands of coaches already using PTFlow to streamline their
              workflow and boost productivity.
            </p>
            <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[
                    { bg: "#5ec29c", initials: "JR" },
                    { bg: "#242424", initials: "KT" },
                    { bg: "#8a8a8a", initials: "AM" },
                  ].map((u) => (
                    <div
                      key={u.initials}
                      className="flex size-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
                      style={{ backgroundColor: u.bg }}
                    >
                      {u.initials}
                    </div>
                  ))}
                </div>
                <div className="flex gap-0.5 text-[#5ec29c]" aria-label="5 stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-current" aria-hidden />
                  ))}
                </div>
              </div>
              <p className="text-sm text-white/90">
                &quot;PTFlow has transformed how I manage my clients. Highly
                recommended!&quot;
              </p>
              <p className="mt-2 text-xs text-white/60">
                - Sarah Johnson, Fitness Coach
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
