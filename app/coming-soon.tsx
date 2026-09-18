"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  type Variants,
} from "motion/react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 56, rotateX: 12, transformPerspective: 1000 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

function AnimatedTitle({ text }: { text: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(titleRef, { margin: "100px" });
  const words = text.split(" ");

  return (
    <motion.h1
      ref={titleRef}
      initial={{ scale: 1.25, rotateX: 16 }}
      animate={{ scale: 1, rotateX: 0 }}
      transition={{ delay: 0.65, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      className="launch-title flex flex-col items-center gap-1 font-display text-7xl font-bold tracking-tight sm:flex-row sm:gap-[0.35em] sm:text-8xl lg:text-9xl"
      style={{ perspective: 1100 }}
      data-active={inView}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span
          key={wi}
          className="launch-word relative inline-block"
          style={{
            "--word-delay": `${0.65 + wi * 0.15}s`,
            "--echo-delay": `${5 + wi * 0.15}s`,
          } as CSSProperties}
          aria-hidden="true"
        >
          <span className="invisible">{word}</span>
          {["top", "middle", "bottom"].map((slice) => (
            <span key={slice} className={`launch-slice launch-slice--${slice}`}>
              <span className="launch-slice-fill">{word}</span>
            </span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

// Adjust the launch date here
const LAUNCH_DATE = new Date("2026-11-01T00:00:00+11:00");

function getTimeLeft() {
  const diff = Math.max(0, LAUNCH_DATE.getTime() - Date.now());
  return {
    Days: Math.floor(diff / 86_400_000),
    Hours: Math.floor(diff / 3_600_000) % 24,
    Minutes: Math.floor(diff / 60_000) % 60,
    Seconds: Math.floor(diff / 1_000) % 60,
  };
}

function Countdown() {
  const reducedMotion = useReducedMotion();
  const countdownRef = useRef<HTMLDivElement>(null);
  const inView = useInView(countdownRef, { margin: "100px" });
  // null until mounted so the server and first client render match
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    if (!inView) return;
    const firstTick = setTimeout(() => setTime(getTimeLeft()), 0);
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => {
      clearTimeout(firstTick);
      clearInterval(id);
    };
  }, [inView]);

  const entries = time
    ? Object.entries(time)
    : (["Days", "Hours", "Minutes", "Seconds"] as const).map(
        (label) => [label, null] as const,
      );

  return (
    <div ref={countdownRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5" style={{ perspective: 1000 }}>
      {entries.map(([label, value], i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 55, rotateX: -65, scale: 0.88 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            delay: i * 0.12,
            type: "spring",
            damping: 16,
            stiffness: 110,
          }}
          className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white px-6 py-6 text-center shadow-[0_8px_30px_-12px_rgba(139,92,246,0.25)] sm:px-8"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />
          <div className="relative h-12 sm:h-14" style={{ perspective: 450 }}>
            <motion.span
              key={value ?? "placeholder"}
              initial={reducedMotion ? false : { y: -10, rotateX: -85, opacity: 0 }}
              animate={{ y: 0, rotateX: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 180 }}
              style={{ transformOrigin: "50% 50% -16px", backfaceVisibility: "hidden" }}
              className="block bg-gradient-to-b from-zinc-900 to-zinc-500 bg-clip-text font-mono text-4xl font-black tabular-nums text-transparent sm:text-5xl"
            >
              {value === null ? "--" : String(value).padStart(2, "0")}
            </motion.span>
          </div>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
            {label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function NotifyForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 160 }}
        className="flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-8 py-3.5 text-sm font-medium text-emerald-700"
      >
        <motion.span
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", damping: 12 }}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
        You&apos;re on the list — we&apos;ll ping you at launch!
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <input
        type="email"
        required
        placeholder="you@example.com"
        className="flex-1 rounded-full border border-zinc-200 bg-white px-6 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition-all focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
      />
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        type="submit"
        className="animate-glow-pulse rounded-full bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 px-8 py-3.5 text-sm font-semibold text-white"
      >
        Notify Me
      </motion.button>
    </motion.form>
  );
}

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M6.94 5a2 2 0 11-4-.002 2 2 0 014 .002zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.4L6.47 22H3.34l7.24-8.28L2.8 2h6.4l4.42 5.85L18.9 2zm-1.1 18.1h1.73L7.28 3.8H5.42L17.8 20.1z" />
      </svg>
    ),
  },
];

function Marquee() {
  const items = Array.from({ length: 8 });
  return (
    <div data-ambient-section className="relative z-10 overflow-hidden border-y border-zinc-200/70 bg-zinc-50/80 py-5">
      <div
        className="ambient-loop marquee-track flex w-max whitespace-nowrap"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {items.map((_, i) => (
              <span
                key={i}
                className="mx-6 flex items-center gap-6 text-sm font-bold uppercase tracking-[0.35em]"
              >
                <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Launching Soon
                </span>
                <span className="text-pink-500/60">✦</span>
                <span className="text-zinc-300">Gemini Jobs</span>
                <span className="text-orange-500/60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fbfaff] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fbfaff] to-transparent" />
    </div>
  );
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"
          fill="currentColor"
        />
      </svg>
    ),
    title: "AI-Powered",
    desc: "Smart matching that connects your skills to the right opportunities, faster.",
    glow: "group-hover:bg-violet-400/25",
    iconColor: "text-violet-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3.5 19c.6-3 2.9-4.5 5.5-4.5s4.9 1.5 5.5 4.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M16 5.5a3 3 0 010 5.5M18.5 14.8c1.4.8 2.3 2.1 2.6 3.7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Human-Supported",
    desc: "Real people in your corner whenever you need guidance on your journey.",
    glow: "group-hover:bg-pink-400/25",
    iconColor: "text-pink-500",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
        <path
          d="M12 21s-6.5-5.2-6.5-10.2A6.5 6.5 0 0112 4.5a6.5 6.5 0 016.5 6.3C18.5 15.8 12 21 12 21z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="10.8"
          r="2.4"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    ),
    title: "Built for Australia",
    desc: "Connecting Aussies to opportunities — locally and globally.",
    glow: "group-hover:bg-orange-400/25",
    iconColor: "text-orange-500",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Normalised mouse position inside the card (0 → 1)
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [9, -9]), {
    damping: 20,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-9, 9]), {
    damping: 20,
    stiffness: 200,
  });

  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${useTransform(
    mx,
    (v) => v * 100,
  )}% ${useTransform(my, (v) => v * 100)}%, rgba(236,72,153,0.08), transparent 70%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: (index - 1) * 35, y: 85, rotateX: 30, rotateY: (1 - index) * 12, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotateX: 0, rotateY: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.18,
        type: "spring",
        damping: 22,
        stiffness: 95,
      }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group relative h-full overflow-hidden rounded-2xl p-px"
      >
        {/* Spinning conic gradient border */}
        <div
          className="ambient-loop feature-border absolute left-1/2 top-1/2 aspect-square w-[220%] -translate-x-1/2 -translate-y-1/2 opacity-25 transition-opacity duration-500 [background:conic-gradient(from_0deg,transparent_0%,#8b5cf6_12%,#ec4899_25%,#f97316_38%,transparent_50%)] group-hover:opacity-90"
        />

        {/* Card body */}
        <div className="relative h-full rounded-2xl bg-white p-8 shadow-[0_10px_40px_-15px_rgba(139,92,246,0.2)]">
          {/* Mouse-tracking spotlight */}
          <motion.div
            style={{ background: spotlight }}
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          {/* Corner glow */}
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-transparent blur-[70px] transition-colors duration-500 ${feature.glow}`}
          />

          <div style={{ transform: "translateZ(40px)" }}>
            <div
              style={{ animationDelay: `${index * 0.5}s` }}
              className={`ambient-loop feature-icon mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white shadow-sm ${feature.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[6deg]`}
            >
              {feature.icon}
            </div>
            <h3 className="mb-2.5 font-display text-xl font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-500">
              {feature.desc}
            </p>
          </div>

          {/* Bottom accent line that draws in on hover */}
          <div className="absolute inset-x-8 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 transition-transform duration-500 group-hover:scale-x-100" />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ComingSoon() {
  return (
    <MotionConfig reducedMotion="user">
      <ComingSoonContent />
    </MotionConfig>
  );
}

function ComingSoonContent() {
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);

  // One observer pauses decorative CSS loops without re-rendering the page on scroll.
  useEffect(() => {
    const sections = pageRef.current?.querySelectorAll<HTMLElement>("[data-ambient-section]");
    if (!sections) return;
    const visibleSections = new Map<HTMLElement, boolean>();
    const updatePlayback = () => {
      visibleSections.forEach((visible, section) => {
        section.dataset.ambientActive = String(visible && !document.hidden);
      });
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visibleSections.set(entry.target as HTMLElement, entry.isIntersecting);
      });
      updatePlayback();
    }, { rootMargin: "100px" });
    sections.forEach((section) => observer.observe(section));
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
    };
  }, []);

  // Page-wide scroll progress bar
  const { scrollYProgress: pageProgress } = useScroll();
  const progressScale = useSpring(pageProgress, {
    damping: 25,
    stiffness: 180,
  });

  // Hero: as you scroll away, text drifts up and background parallaxes
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroProgress, [0, 1], [0, -180]);
  const heroTextOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(heroProgress, [0, 1], [0.82, 0.9]);
  const bgY = useTransform(heroProgress, [0, 1], ["0%", "10%"]);

  // Sneak peek: card tilts up from 3D.
  const { scrollYProgress: peekProgress } = useScroll({
    target: peekRef,
    offset: ["start end", "center center"],
  });
  const smoothPeek = useSpring(peekProgress, { damping: 20, stiffness: 90 });
  const peekRotateX = useTransform(smoothPeek, [0, 1], [52, 0]);
  const peekRotateY = useTransform(smoothPeek, [0, 1], [-8, 0]);
  const peekY = useTransform(smoothPeek, [0, 1], [75, 0]);
  const peekScale = useTransform(smoothPeek, [0, 1], [0.78, 1]);
  const peekOpacity = useTransform(smoothPeek, [0, 0.4], [0, 1]);

  return (
    <div ref={pageRef} className="relative w-full overflow-x-clip bg-[#fbfaff] text-zinc-900">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progressScale }}
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500"
      />

      {/* ============ HERO ============ */}
      <section
        ref={heroRef}
        data-ambient-section
        className="launch-hero relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      >
        {/* Fixed blur on the hero background image. */}
        <motion.div
          style={{ scale: reducedMotion ? 0.82 : bgScale, y: reducedMotion ? 0 : bgY }}
          className="scroll-image-layer absolute inset-0"
        >
          <div className="launch-backdrop absolute inset-0">
          <Image
            src="/website.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="transform-gpu object-cover blur-[12px] brightness-[1.02] saturate-[1.15]"
          />
          </div>
        </motion.div>

        {/* Overlays: soft white tint + vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/25 to-[#fbfaff] opacity-30" />
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_40%,#fbfaff_92%)]" />

        {/* Hero content */}
        <motion.div
          style={{ y: reducedMotion ? 0 : heroTextY, opacity: reducedMotion ? 1 : heroTextOpacity }}
          className="relative z-10 flex flex-col items-center gap-8 px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: -24, rotateX: 65, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 800 }}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-5 py-2 shadow-sm backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <Image
              src="/logo-cropped.png"
              alt="Gemini Jobs"
              width={566}
              height={80}
              loading="eager"
              className="h-5 w-auto object-contain"
            />
          </motion.div>

          <AnimatedTitle text="COMING SOON" />

          <motion.p
            initial={{ opacity: 0, y: 24, clipPath: "inset(100% 0 0 0)" }}
            animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
            transition={{ delay: 1.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-lg leading-relaxed text-zinc-600 sm:text-xl"
          >
            Your next career move starts here. AI-powered, human-supported —
            built for Australia.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 2, duration: 0.9, ease: "easeOut" }}
            className="launch-accent h-px w-48 bg-gradient-to-r from-transparent via-pink-500/70 to-transparent"
          />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
          className="absolute bottom-10 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-zinc-400">
            Scroll
          </span>
          <div
            className="ambient-loop scroll-cue flex h-10 w-6 items-start justify-center rounded-full border border-zinc-300 p-1.5"
          >
            <div
              className="ambient-loop scroll-cue-dot h-2 w-1 rounded-full bg-gradient-to-b from-pink-400 to-orange-400"
            />
          </div>
        </motion.div>
      </section>

      {/* ============ MARQUEE ============ */}
      <Marquee />

      {/* ============ SNEAK PEEK (still under wraps) ============ */}
      <section
        ref={peekRef}
        data-ambient-section
        className="relative z-10 flex flex-col items-center px-6 py-32"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-pink-500">
            Sneak Peek
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Still under{" "}
            <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              wraps
            </span>
          </h2>
        </motion.div>

        <div style={{ perspective: 1200 }} className="w-full max-w-5xl">
          <motion.div
            className="scroll-image-layer"
            style={{
              rotateX: reducedMotion ? 0 : peekRotateX,
              rotateY: reducedMotion ? 0 : peekRotateY,
              y: reducedMotion ? 0 : peekY,
              scale: reducedMotion ? 1 : peekScale,
              opacity: reducedMotion ? 1 : peekOpacity,
              transformStyle: "preserve-3d",
            }}
          >
            {/* gentle continuous float */}
            <div
              className="ambient-loop preview-float relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_40px_120px_-20px_rgba(168,85,247,0.3)]"
            >
              {/* Browser chrome bar */}
              <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-100 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <div className="mx-auto flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-1 text-xs text-zinc-400">
                  <span className="text-emerald-500">🔒</span> geminijobs.com.au
                </div>
              </div>

              {/* Keep the preview blurred beneath the clear lock badge. */}
              <div className="relative">
                <Image
                  src="/website.png"
                  alt="Gemini Jobs website preview (blurred)"
                  width={2048}
                  height={1142}
                  sizes="(min-width: 1072px) 1024px, calc(100vw - 48px)"
                  className="w-full scale-105 transform-gpu blur-lg"
                />

                {/* Light sweep across the card */}
                <div
                  className="ambient-loop preview-sweep pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                />

                {/* Frosted lock badge in the centre */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white/70 px-10 py-8 text-center shadow-lg backdrop-blur-xl"
                  >
                    <span
                      className="ambient-loop preview-lock text-4xl"
                    >
                      🔒
                    </span>
                    <p className="font-display text-lg font-semibold">
                      Unlocking soon
                    </p>
                    <p className="max-w-xs text-sm text-zinc-500">
                      The full experience is almost ready. Hang tight!
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section data-ambient-section className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-violet-500">
            Why Gemini Jobs
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Made to get you{" "}
            <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
              hired
            </span>
          </h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-3" style={{ perspective: 1200 }}>
          {features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </section>

      {/* ============ CTA / FOOTER ============ */}
      <section data-ambient-section className="relative z-10 overflow-hidden px-6 py-32">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-600/15 via-pink-500/15 to-orange-500/15 blur-[120px]" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mx-auto flex max-w-2xl flex-col items-center gap-10 text-center"
        >
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-orange-500">
              The wait is almost over
            </p>
            <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
              Launching{" "}
              <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                in
              </span>
            </h2>
          </div>

          <Countdown />

          <div className="flex w-full flex-col items-center gap-3">
            <p className="text-sm text-zinc-500">
              Get notified the moment we go live
            </p>
            <NotifyForm />
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-zinc-400">Follow the journey</p>
            <div className="flex gap-4">
              {socials.map((s, i) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + i * 0.1,
                    type: "spring",
                    damping: 14,
                    stiffness: 160,
                  }}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm transition-colors hover:border-pink-400/60 hover:text-zinc-900"
                >
                  {s.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="relative mt-28 flex flex-col items-center gap-5 border-t border-zinc-200/70 pt-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            className="rounded-full border border-zinc-200 bg-white px-7 py-3 shadow-[0_8px_35px_-10px_rgba(236,72,153,0.45)]"
          >
            <Image
              src="/logo-cropped.png"
              alt="Gemini Jobs"
              width={566}
              height={80}
              className="h-7 w-auto object-contain"
            />
          </motion.div>
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} Gemini Jobs. Built for Australia.
          </p>
        </div>
      </section>
    </div>
  );
}
