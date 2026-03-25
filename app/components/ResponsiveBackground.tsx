"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";

import Hero3DCarousel from "./Hero3DCarousel";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

// ─── COLLABORATORS DATA ────────────────────────────────────────────────────

interface Collaborator {
  name: string;
  role: string;
  linkedin: string | null;
  img: string | null;
}

const DRIVERS: Collaborator[] = [
  { name: "Dinh Ho", role: "AI", linkedin: "https://www.linkedin.com/in/dinh-ho/", img: "/assets/Dinh.jpeg" },
  { name: "Harsimran Singh", role: "Social Media", linkedin: "https://www.linkedin.com/in/harsimran-singh-6466aa165/", img: "/assets/Harsimran.jpeg" },
  { name: "Joyce Okore", role: "Web", linkedin: "https://www.linkedin.com/in/joyce-okore-747551296/", img: "/assets/Joyce.jpeg" },
  { name: "Lorena Ramirez", role: "Legals", linkedin: "https://www.linkedin.com/in/lorenaramirezrothbadi/", img: "/assets/lorena.jpeg" },
  { name: "Maryam Taghiyeva", role: "Tokenisation", linkedin: "https://www.linkedin.com/in/maryam-taghiyeva-prince2-3a3a6b89/", img: "/assets/Maryam.jpeg" },
  { name: "Olayimika Oyebanji", role: "Coms", linkedin: "https://www.linkedin.com/in/olayimika-oyebanji-68385b1a9", img: "/assets/Olayimika.jpeg" },
  { name: "Sajin Abdu", role: "Payments", linkedin: "https://www.linkedin.com/in/sajin-abdu/", img: "/assets/Sajin.jpeg" },
  { name: "Tarisai Mukunga", role: "Interoperability", linkedin: "https://www.linkedin.com/in/tarisai-merenciana-mukunga", img: "/assets/Tarisai.jpeg" },
];

const COLLAB_PROJECTS: Collaborator[] = [
  { name: "Alawi Swabury", role: "EV Minerals", linkedin: "https://www.linkedin.com/in/alawi-swabury-48582b26b/", img: "/assets/Alawi.jpeg" },
  { name: "Billy Mwangi", role: "Bean You", linkedin: "https://www.linkedin.com/in/billy-mwangi-a00b671b8/", img: "/assets/Billy.jpeg" },
  { name: "Ivan Mazi-Markov", role: "Zut Island", linkedin: "https://www.linkedin.com/in/ivan-mazi-markov-97319418b/", img: "/assets/Ivan-Mazi.jpeg" },
  { name: "Tomeu Lamo", role: "Dalí", linkedin: "http://www.tomeulamo.com", img: "/assets/Tomeu.jpeg" },
];

const THOUGHT_LEADERS: Collaborator[] = [
  { name: "Barbara T.", role: "Corporate", linkedin: "https://www.linkedin.com/in/barbara-t-a3671a16/", img: "/assets/Barbara-T.jpeg" },
  { name: "Birame Boye", role: "Dalí / Gold", linkedin: "https://www.linkedin.com/in/birame-boye-6079269a/", img: "/assets/Biraam.jpeg" },
  { name: "G. John Okoro", role: "Operations", linkedin: "https://www.linkedin.com/in/gjohnokoro/", img: "/assets/John.jpg" },
  { name: "Jonathan Hine", role: "TBC", linkedin: null, img: "/assets/Jonathan.jpeg" },
  { name: "Olinga Taeed", role: "Founder", linkedin: "https://www.linkedin.com/in/olingataeed/", img: "/assets/OLINGA.png" },
  { name: "Terry Tudor", role: "ESG", linkedin: "https://www.linkedin.com/in/terry-tudor-05ba993/", img: "/assets/terry.jpeg" },
];

// ── COLLABORATOR CARD ACCENT COLOURS ──────────────────────────────────────
const ACCENT_COLORS = [
  "#D42B27", "#7B4B9E", "#4E83B8", "#059669", "#f97316",
  "#7C3AED", "#06b6d4", "#D42B27", "#4E83B8",
];

// ── DRIVER CARD — portrait, full-bleed, name overlaid ─────────────────────
function DriverCard({ name, role, linkedin, img, index }: Collaborator & { index: number }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const color = ACCENT_COLORS[index % ACCENT_COLORS.length];

  const inner = (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 340, damping: 22 }}
      className="relative overflow-hidden rounded-2xl cursor-pointer group"
      style={{ aspectRatio: "2/3", boxShadow: "0 2px 14px rgba(0,0,0,0.09)" }}
    >
      {/* Photo */}
      <div className="absolute inset-0 bg-slate-200">
        {img ? (
          <Image src={img} alt={name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 20vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(160deg, ${color}50, ${color}20)` }}>
            <span className="font-black text-4xl" style={{ color: `${color}bb` }}>{initials}</span>
          </div>
        )}
      </div>
      {/* Gradient overlay bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
      {/* Top colour bar */}
      <div className="absolute top-0 inset-x-0 h-1" style={{ background: color }} />
      {/* Name + role */}
      <div className="absolute inset-x-0 bottom-0 p-3.5">
        <p className="text-white font-bold text-[13px] leading-tight drop-shadow">{name}</p>
        <span className="inline-block mt-1.5 px-2 py-[3px] rounded-full text-[9px] font-bold uppercase tracking-wider text-white" style={{ background: color }}>
          {role}
        </span>
      </div>
      {/* LinkedIn on hover */}
      {linkedin && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
            </svg>
          </div>
        </div>
      )}
    </motion.div>
  );

  if (linkedin) return <a href={linkedin} target="_blank" rel="noreferrer" className="block">{inner}</a>;
  return inner;
}

// ── PROJECT PERSON CARD — horizontal, clean ───────────────────────────────
function ProjectPersonCard({ name, role, linkedin, img }: Collaborator) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const inner = (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/[0.07] shadow-sm hover:shadow-md hover:border-[#4E83B8]/30 transition-all cursor-pointer group"
    >
      <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[#4E83B8]/20">
        {img ? (
          <Image src={img} alt={name} fill className="object-cover object-top" sizes="56px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-white text-base" style={{ background: "linear-gradient(135deg, #4E83B8, #7B4B9E)" }}>
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-black/90 leading-tight">{name}</p>
        <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide text-[#4E83B8] bg-[#4E83B8]/10 border border-[#4E83B8]/20 px-2.5 py-0.5 rounded-full">
          {role}
        </span>
      </div>
      {linkedin && (
        <svg className="flex-shrink-0 text-black/20 group-hover:text-[#4E83B8] transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </motion.div>
  );

  if (linkedin) return <a href={linkedin} target="_blank" rel="noreferrer" className="block">{inner}</a>;
  return inner;
}

// ── THOUGHT LEADER CARD — premium editorial ────────────────────────────────
function ThoughtLeaderCard({ name, role, linkedin, img }: Collaborator) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const inner = (
    <motion.div
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-black/[0.07] shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group"
    >
      <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-amber-200/60">
        {img ? (
          <Image src={img} alt={name} fill className="object-cover object-top" sizes="56px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-white text-base" style={{ background: "linear-gradient(135deg, #D97706, #D42B27)" }}>
            {initials}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-black/90 leading-tight">{name}</p>
        <span className="inline-block mt-1.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
          {role}
        </span>
      </div>
      {linkedin && (
        <svg className="flex-shrink-0 text-black/20 group-hover:text-amber-500 transition-colors" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </motion.div>
  );

  if (linkedin) return <a href={linkedin} target="_blank" rel="noreferrer" className="block">{inner}</a>;
  return inner;
}

const imgZutIsland = "/assets/Zutproject.webp";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};


const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

const viewportOnce = { once: true, amount: 0.25 } as const;
const viewportCards = { once: true, amount: 0.35 } as const;

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const steps = 40;
          const interval = 1200 / steps;
          let step = 0;
          const timer = setInterval(() => {
            step++;
            setVal(Math.round((step / steps) * to));
            if (step >= steps) clearInterval(timer);
          }, interval);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

export default function ResponsiveBackground() {
  const reduceMotion = useReducedMotion();

  const heroRef = useRef<HTMLElement | null>(null);
  const [heroInView, setHeroInView] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => setHeroInView(entries[0]?.isIntersecting ?? true),
      { root: null, threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const CYCLING_WORDS = [
    "love", "belief", "culture", "passion", "belonging", "identity",
    "ideology", "faith", "opinion", "values", "happiness", "empowerment",
    "joy", "kindness", "heritage", "trust", "community", "purpose",
  ];
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setWordIndex((i) => (i + 1) % CYCLING_WORDS.length),
      3000
    );
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start", dragFree: false });
  const [emblaIndex, setEmblaIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setEmblaIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return;
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch {
        // fail silently — still show confirmation to user
      }
      setEmailSent(true);
    },
    [email]
  );

  const PROJECTS = [
    {
      tag: "ESG",
      topColor: "#6ee7b7",
      badgeGradient: "from-emerald-500 to-teal-600",
      img: "/assets/bean-you.jpg",
      title: "Bean You",
      label: "Our pilot iRWA",
      icon: "☕",
      labelGradient: "linear-gradient(135deg, #064e3b, #059669)",
      desc: "Connecting coffee drinkers to Kenyan farmers. 15,000 acres of emotional connection.",
      impact: "Health, education, tech centres",
      href: "https://beanyou.com",
      benefits: [
        "Farm visit experience in Kenya",
        "Coffee subscription discounts",
        "Direct farmer impact updates",
        "Tier-based brand partner perks",
      ],
    },
    {
      tag: "Peace",
      topColor: "#7dd3fc",
      badgeGradient: "from-sky-500 to-indigo-600",
      img: imgZutIsland,
      title: "Zut Island",
      label: "Our smallest iRWA",
      icon: "🏝",
      labelGradient: "linear-gradient(135deg, #0c4a6e, #0284c7)",
      desc: "Olive trees on a Croatian island. Meditation and wellbeing through nature.",
      impact: "Meditation & wellbeing centres",
      href: "https://zut.digital",
      benefits: [
        "Island meditation retreat access",
        "Wellbeing centre membership",
        "Olive oil harvest participation",
        "Tier-based island experiences",
      ],
    },
    {
      tag: "Coming soon",
      topColor: "#D97706",
      badgeGradient: "from-amber-500 to-yellow-600",
      img: "/assets/Dali.jpeg",
      title: "Dalí",
      label: "Most prestigious iRWA",
      icon: "✦",
      labelGradient: "linear-gradient(135deg, #78350f, #d97706)",
      desc: "A painting bought for €150 from a Spanish antique shop, later authenticated as Salvador Dalí's earliest surrealist work — painted in 1921 at age 17.",
      impact: "Cultural heritage & art access",
      href: "https://intrauterinebirth.com/",
      benefits: [
        "Co-ownership of authenticated art provenance",
        "Private exhibition & gallery access",
        "Surrealist cultural event invitations",
        "Tier-based art loan programme access",
      ],
    },
    {
      tag: "Coming soon",
      topColor: "#94a3b8",
      badgeGradient: "from-slate-400 to-slate-500",
      img: "/assets/ev-mineral.jpg",
      title: "EV Minerals",
      label: "Our largest iRWA",
      icon: "⚡",
      labelGradient: "linear-gradient(135deg, #1e293b, #475569)",
      desc: "Connecting EV drivers to ethical mineral sourcing across 770,400 km².",
      impact: "Child education & health centres",
      href: "",
      benefits: [
        "Ethical sourcing certificates",
        "EV partner charging discounts",
        "Community governance voting",
        "Education centre access",
      ],
    },
  ];

  const rewards = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: "Instant Rewards",
      desc: "Brand discounts, partner perks, and prize draws activate the moment you participate. Your conviction pays off immediately.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: "Real Experiences",
      desc: "On-site farm visits, island retreats, and immersive brand encounters. Participation earns access, not just points.",
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      ),
      title: "Tier Recognition",
      desc: "Entry, Mid, and VIP tiers unlock deeper access and status. The more you believe, the more the ecosystem gives back.",
    },
  ];

  const faqs = [
    {
      q: "What is an iRWA token?",
      a: "An iRWA token represents your emotional connection to a project — a coffee farm, an island, a cause. It's not equity or debt. It's a tokenized belief that earns you real benefits.",
    },
    {
      q: "How is this different from a loyalty programme?",
      a: "Loyalty points expire, stay locked in one brand, and can't be traded. iRWA tokens are on-chain, transferable, and work across multiple projects in the ecosystem.",
    },
    {
      q: "How is iRWA different from traditional RWA?",
      a: "Traditional RWAs represent physical ownership and financial returns — property, bonds, commodities. iRWAs tokenize emotional value and access rights. No ownership, no speculation, just rewarded participation.",
    },
    {
      q: "Is iRWA regulated?",
      a: "iRWA tokens represent soft assets and emotional connections — not financial instruments. This makes them generally outside the scope of traditional financial regulation.",
    },
    {
      q: "How do I participate in a project?",
      a: "Connect a wallet, choose a project you believe in, and hold its token. Benefits activate automatically based on your tier. No trading required.",
    },
    {
      q: "Can I build my own iRWA project?",
      a: "Yes. If you have a community, cause, or brand with genuine belief behind it, we can help you define and mint your token. Reach out via the demo request below.",
    },
  ];

  const stickyLabel = heroInView ? "Explore Projects" : "Request a demo";
  const stickyHref = heroInView ? "#projects" : "#cta";

  return (
    <div className="bg-white relative w-full min-h-screen text-[#0b0f19]">
      <SiteHeader currentPath="/" />

      {/* Contextual sticky CTA (mobile) */}
      <div
        className="md:hidden fixed left-0 right-0 z-40 px-4"
        style={{ bottom: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        <div className="mx-auto max-w-md">
          <a
            href={stickyHref}
            className="group flex items-center justify-between rounded-2xl bg-white border border-black/10 shadow-xl shadow-black/10 px-5 py-4"
          >
            <span className="font-bold text-[#0b0f19]">{stickyLabel}</span>
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm transition group-hover:scale-105"
              style={{ background: "#D42B27" }}
            >
              →
            </span>
          </a>
        </div>
      </div>

      {/* ─── HERO ────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative flex flex-col overflow-hidden bg-[#fafafa]"
        style={{ minHeight: "calc(100vh - 64px)" }}
      >
        {/* Soft warm orb — top left */}
        <div className="absolute pointer-events-none"
          style={{ top: -60, left: -80, width: 480, height: 380,
            background: "radial-gradient(circle, #D42B27 0%, transparent 68%)",
            opacity: 0.11, filter: "blur(80px)" }} />
        {/* Soft cool orb — right */}
        <div className="absolute pointer-events-none"
          style={{ top: -20, right: -80, width: 520, height: 440,
            background: "radial-gradient(circle, #4E83B8 0%, transparent 68%)",
            opacity: 0.09, filter: "blur(100px)" }} />

        {/* ── Two-column grid ── */}
        <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 max-w-7xl mx-auto w-full">

          {/* LEFT — text, below carousel on mobile */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11 } } }}
            className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-10 lg:pl-12 lg:pr-6 pt-4 pb-12 lg:py-0 order-2 lg:order-1"
          >
            {/* Cycling word */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className="overflow-hidden mb-3 w-full"
              style={{ height: "clamp(68px, 14.4vw, 108px)" }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={CYCLING_WORDS[wordIndex]}
                  className="block font-black tracking-tighter select-none"
                  style={{
                    fontSize: "clamp(56px, 12vw, 88px)",
                    lineHeight: 1.2,
                    paddingRight: "0.08em",
                    background: "linear-gradient(90deg, #D42B27 0%, #7B4B9E 50%, #4E83B8 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-110%", opacity: 0 }}
                  transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
                >
                  {CYCLING_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            {/* Supporting line */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              className="text-slate-500 text-lg leading-snug mb-8 max-w-[300px] lg:max-w-xs"
            >
              has value. We put it on&#8209;chain.
            </motion.p>

            {/* CTA */}
            <motion.a
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
              href="#cta"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white hover:opacity-90 hover:scale-[1.02] transition-all active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)", boxShadow: "0 4px 14px rgba(212,43,39,0.22)" }}
            >
              Get Started →
            </motion.a>
          </motion.div>

          {/* RIGHT — carousel, top on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center px-6 sm:px-10 lg:px-8 pt-16 sm:pt-12 lg:pt-0 pb-10 lg:pb-0 order-1 lg:order-2"
          >
            <div
              className="relative w-full max-w-[520px] overflow-hidden rounded-[36px] p-5 sm:p-7"
              style={{
                background: "rgba(255,255,255,0.75)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.85)",
                boxShadow: "0 30px 80px rgba(212,43,39,0.14), 0 8px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none rounded-[36px]"
                style={{
                  background: "linear-gradient(135deg, rgba(212,43,39,0.07) 0%, transparent 50%, rgba(78,131,184,0.05) 100%)",
                }}
              />
              <div className="relative">
                <Hero3DCarousel />
              </div>
            </div>
          </motion.div>

        </div>

        {/* ── Tagline divider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="relative z-10 border-t border-gray-100 bg-white px-6 sm:px-10 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full"
        >
          <p className="text-base sm:text-lg font-semibold text-gray-900 text-center sm:text-left">
            Tokenize the <span className="text-[#D42B27]">connection</span> — not the asset.
          </p>
          <a
            href="#cta"
            className="shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)" }}
          >
            Build with us
          </a>
        </motion.div>
      </section>

      {/* ─── BREAKOUT QUOTE ──────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: reduceMotion ? 0 : 0.9 }}
        className="bg-[#D42B27] px-6 lg:px-24 py-16 md:py-20 overflow-hidden relative"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
          >
            "You can't tax love."
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.3 }}
            className="text-white/75 text-lg md:text-xl max-w-xl mx-auto"
          >
            Intangible assets already shape the world. We make them measurable,
            transactable, and rewarding.
          </motion.p>
        </div>
      </motion.section>

      {/* ─── LIVE PROJECTS STRIP ─────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-8 md:py-10 border-b border-black/5"
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Live on exchange
          </span>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "BeanYou", holders: "847", tag: "ESG", href: "https://beanyou.com", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
              { name: "Zut Island", holders: "212", tag: "Peace", href: "https://zut.digital", cls: "bg-sky-50 text-sky-700 border-sky-200" },
              { name: "Dalí", holders: null, tag: "Coming soon", href: "https://intrauterinebirth.com/", cls: "bg-amber-50 text-amber-700 border-amber-200" },
              { name: "EV Minerals", holders: null, tag: "Coming Q3", href: "#projects", cls: "bg-slate-50 text-slate-500 border-slate-200" },
            ].map((p) => (
              <a
                key={p.name}
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel={p.href.startsWith("http") ? "noreferrer" : undefined}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition hover:opacity-80 ${p.cls}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                {p.name}
                {p.holders && (
                  <span className="opacity-60 font-normal">
                    · <CountUp to={parseInt(p.holders)} /> holders
                  </span>
                )}
                {!p.holders && <span className="opacity-50 font-normal text-xs">{p.tag}</span>}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-500">
            <span><span className="font-bold text-[#0b0f19]">16+</span> impact initiatives</span>
            <span><span className="font-bold text-[#0b0f19]">IRL</span> real-world benefits</span>
          </div>
        </div>
      </motion.section>

      {/* ─── PROJECTS ────────────────────────────────────────────────────── */}
      <motion.section
        id="projects"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-white px-6 lg:px-24 py-20 border-t border-black/[0.04]"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#D42B27]">
              A sample of our 16 projects
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Projects people believe in
            </h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto italic">
              Each of these started as a belief. Now it's an exchange-traded token.
            </p>
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden">
            <div ref={emblaRef} className="overflow-hidden -mx-4 px-4">
              <div className="flex gap-3">
                {PROJECTS.map((p) => (
                  <div
                    key={p.title}
                    className="flex-[0_0_78%] rounded-2xl bg-white border border-slate-200 shadow-md overflow-hidden flex flex-col"
                    style={{ borderTopWidth: "3px", borderTopColor: p.topColor }}
                  >
                    {/* Compact photo */}
                    <div className="relative h-40 overflow-hidden bg-slate-100 flex-shrink-0">
                      <Image src={p.img} alt={p.title} fill className="object-cover" />
                      {/* Gradient vignette + label */}
                      <div className="absolute inset-x-0 bottom-0 z-10 pt-8 pb-3 px-3" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)` }}>
                        <div className="flex items-end justify-between">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white text-[11px] font-black tracking-wide backdrop-blur-sm" style={{ background: p.labelGradient }}>
                            <span>{p.icon}</span>{p.label}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/30 ${p.tag === "Coming soon" ? "text-white/60" : "text-emerald-300"}`}>
                            {p.tag === "Coming soon" ? "Soon" : "Live"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Compact content */}
                    <div className="p-4 flex flex-col gap-2 flex-1">
                      <h3 className="text-base font-bold leading-tight">{p.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{p.desc}</p>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-[#D42B27]">{p.impact}</span>
                        {p.href ? (
                          <a href={p.href} target="_blank" rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg text-white text-[11px] font-bold"
                            style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)" }}>
                            View →
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400">Coming soon</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-5">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === emblaIndex ? "w-6 bg-[#D42B27]" : "w-1.5 bg-slate-300"}`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-4 gap-6">
            {PROJECTS.map((p) => (
              <div
                key={p.title}
                className="group rounded-[32px] bg-white/70 backdrop-blur-xl border border-slate-200 shadow-xl hover:shadow-2xl transition overflow-hidden"
                style={{ borderTopWidth: "4px", borderTopColor: p.topColor }}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  {/* Gradient vignette + creative label */}
                  <div className="absolute inset-x-0 bottom-0 z-10 pt-16 pb-4 px-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
                    <div className="flex items-end justify-between">
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-black tracking-wide shadow-lg" style={{ background: p.labelGradient }}>
                        <span className="text-base">{p.icon}</span>
                        {p.label}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/25 backdrop-blur-sm ${p.tag === "Coming soon" ? "text-white/55" : "text-emerald-300"}`}>
                        {p.tag === "Coming soon" ? "Coming soon" : "● Live"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 space-y-6">
                  <h3 className="text-2xl font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                  <div className="space-y-3 text-sm text-slate-600">
                    {p.benefits.map((b) => (
                      <div key={b} className="flex gap-2 items-start">
                        <span className="w-2 h-2 mt-2 bg-[#4E83B8] rounded-full flex-shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-slate-200 text-sm text-slate-500">
                    Impact focus:{" "}
                    <span className="font-medium text-[#D42B27]">{p.impact}</span>
                  </div>
                  <div className="pt-4 flex items-center justify-between">
                    {p.href ? (
                      <>
                        <a href={p.href} target="_blank" rel="noreferrer" className="text-sm text-slate-500 hover:text-slate-900 underline underline-offset-4">
                          Visit project →
                        </a>
                        <a href="#cta" className="px-5 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition" style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)" }}>
                          Get involved
                        </a>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400 italic">Coming soon</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── WHAT BELIEF EARNS YOU (was Participation Engine) ───────────── */}
      <motion.section
        id="participation"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-16 md:py-20 lg:py-24"
      >
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#D42B27]">
              What you get
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              What belief earns you
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Hold a token. Earn real access, real rewards, and real recognition — not just points.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {rewards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D42B27] to-[#4E83B8] flex items-center justify-center shadow-sm">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── TESTIMONIAL ─────────────────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-[#f8fafc] px-6 lg:px-24 py-16 md:py-20"
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#D42B27] text-center">
            From the community
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                quote: "Holding BeanYou tokens changed how I think about my morning coffee. I know exactly where it came from — and I earned my way to an on-site visit in Kenya.",
                name: "Sarah M.",
                role: "BeanYou token holder",
                color: "linear-gradient(135deg, #6ee7b7, #059669)",
              },
              {
                quote: "I thought blockchain was just for speculation. iRWA showed me it can mean something real — my Zut Island token gets me access to a meditation retreat I genuinely care about.",
                name: "James T.",
                role: "Zut Island token holder",
                color: "linear-gradient(135deg, #7dd3fc, #2563eb)",
              },
            ].map((t) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between gap-6"
              >
                <div className="relative">
                  <span
                    className="absolute -top-3 -left-1 text-7xl font-serif leading-none select-none pointer-events-none"
                    style={{ color: "#D42B2712" }}
                  >
                    &ldquo;
                  </span>
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed pt-5 relative z-10">
                    {t.quote}
                  </p>
                </div>
                <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                    style={{ background: t.color }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-black">{t.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── CONCEPT — human rewrite, no formula ─────────────────────────── */}
      <motion.section
        id="concept"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#D42B27]">
              The philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Markets forgot something
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              For thousands of years, people have built movements around belief — religions, football clubs, cultural icons. Markets never found a way to reward the people who believed first. iRWA does.
            </p>
          </motion.div>

          {/* Old way / New way — human contrast */}
          <div className="relative grid md:grid-cols-2 gap-6">
            {/* VS connector — desktop only */}
            <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center justify-center z-10 pointer-events-none">
              <div className="flex flex-col items-center gap-1">
                <div className="w-px h-12 bg-gradient-to-b from-transparent to-slate-300" />
                <span className="w-9 h-9 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 shadow-sm">
                  VS
                </span>
                <div className="w-px h-12 bg-gradient-to-b from-slate-300 to-transparent" />
              </div>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportCards}
              variants={fadeInUpVariants}
              transition={{ duration: reduceMotion ? 0 : 0.6 }}
              className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">The old way</p>
              <div className="space-y-4">
                {[
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
                    text: "You love a brand. You buy their products. You get nothing back.",
                  },
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
                    text: "Value flows to shareholders and executives, not believers.",
                  },
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
                    text: "Your loyalty is invisible — unmeasured, unrecognised, unrewarded.",
                  },
                ].map((item) => (
                  <div key={item.text} className="flex gap-3 items-start">
                    <span className="mt-0.5 text-slate-400 flex-shrink-0">{item.icon}</span>
                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportCards}
              variants={fadeInUpVariants}
              transition={{ duration: reduceMotion ? 0 : 0.6, delay: reduceMotion ? 0 : 0.1 }}
              className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8 border border-rose-200 space-y-5"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#D42B27]">The iRWA way</p>
              <div className="space-y-4">
                {[
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
                    text: "You love a project. You hold a token. Your belief earns you real benefits.",
                  },
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
                    text: "Rewards flow to participants — discounts, experiences, and access.",
                  },
                  {
                    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
                    text: "Your conviction is on-chain, transferable, and permanently yours.",
                  },
                ].map((item) => (
                  <div key={item.text} className="flex gap-3 items-start">
                    <span className="mt-0.5 text-[#D42B27] flex-shrink-0">{item.icon}</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ─── THE SYSTEM ──────────────────────────────────────────────────── */}
      <motion.section
        id="system"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#f8fafc] px-6 lg:px-24 py-20"
      >
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-4">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#D42B27]">
              How it works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              From belief to benefit
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Four steps from emotional connection to rewarded participation.
            </p>
          </div>

          <div className="relative">
            <svg className="hidden md:block absolute top-1/2 left-0 w-full h-2 -translate-y-1/2" viewBox="0 0 1000 10" fill="none">
              <motion.path
                d="M50 5 H950"
                stroke="#7B4B9E"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            </svg>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "Define Connection", desc: "Name what you stand for — your community, cause, or culture. That becomes your token's identity." },
                { step: "02", title: "Mint Token", desc: "Connection rights are issued on-chain. Tradeable, verifiable, and interoperable across the ecosystem." },
                { step: "03", title: "Participate", desc: "Supporters hold tokens to signal alignment. Their conviction is measured and rewarded — not just held." },
                { step: "04", title: "Benefits Flow", desc: "Discounts, experiences, and access activate for token holders. The more you participate, the more you earn." },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="relative z-10 bg-white rounded-3xl border border-black/5 p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D42B27] to-[#4E83B8] mb-4 leading-none">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── COLLABORATORS ───────────────────────────────────────────────── */}
      <motion.section
        id="collaborators"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#f8fafc] px-4 md:px-8 lg:px-24 py-20 md:py-28 relative overflow-hidden"
      >
        {/* Brand blobs */}
        <div className="absolute -top-48 right-0 w-[700px] h-[700px] rounded-full bg-[#D42B27]/[0.04] blur-[160px] pointer-events-none" />
        <div className="absolute -bottom-48 -left-24 w-[600px] h-[600px] rounded-full bg-[#4E83B8]/[0.05] blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#7B4B9E]/[0.03] blur-[130px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* ── SECTION HEADER ── */}
          <div className="mb-14 md:mb-20">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#D42B27] mb-3">The people</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight text-black leading-none mb-4">
              Collaborators
            </h2>
            <p className="text-black/45 text-base md:text-lg max-w-xl mb-8">
              The humans turning ideas into real-world assets.
            </p>
            {/* Stats row */}
            <div className="flex flex-wrap gap-6">
              {[
                { n: DRIVERS.length, label: "Drivers", color: "#D42B27" },
                { n: COLLAB_PROJECTS.length, label: "Project leads", color: "#4E83B8" },
                { n: THOUGHT_LEADERS.length, label: "Thought Leaders", color: "#D97706" },
              ].map(({ n, label, color }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <span className="text-2xl font-black" style={{ color }}>{n}</span>
                  <span className="text-sm font-medium text-black/40">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── DRIVERS ── */}
          <div className="mb-16 md:mb-20">
            {/* Section divider label */}
            <div className="flex items-center gap-4 mb-8 md:mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-[#D42B27]/25 to-transparent" />
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D42B27] px-4 py-1.5 rounded-full bg-[#D42B27]/[0.07] border border-[#D42B27]/15 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D42B27] inline-block" />
                Drivers — The Builders
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#7B4B9E]/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {DRIVERS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                >
                  <DriverCard {...p} index={i} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── PROJECTS + THOUGHT LEADERS ── */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-12">

            {/* Projects */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-[#4E83B8]/25 to-transparent" />
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4E83B8] px-4 py-1.5 rounded-full bg-[#4E83B8]/[0.07] border border-[#4E83B8]/15 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4E83B8] inline-block" />
                  Projects
                </span>
                <div className="h-px w-6 bg-[#4E83B8]/15" />
              </div>
              <div className="space-y-3">
                {COLLAB_PROJECTS.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: i * 0.07, ease: "easeOut" }}
                  >
                    <ProjectPersonCard {...p} />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Thought Leaders */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-amber-400/25 to-transparent" />
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-700 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  Thought Leaders
                </span>
                <div className="h-px w-6 bg-amber-200/30" />
              </div>
              <div className="space-y-3">
                {THOUGHT_LEADERS.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.35, delay: i * 0.06, ease: "easeOut" }}
                  >
                    <ThoughtLeaderCard {...p} />
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <motion.section
        id="faq"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-white px-4 md:px-8 lg:px-24 py-12 md:py-20 lg:py-28"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInUpVariants}
            transition={{ duration: reduceMotion ? 0 : 0.6 }}
            className="text-center space-y-4"
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#D42B27]">
              Common questions
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.q}
                className="bg-[#f8fafc] rounded-2xl border border-black/5 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left"
                >
                  <h3 className="text-lg md:text-xl font-bold pr-4">{faq.q}</h3>
                  <motion.span
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex-shrink-0 text-[#D42B27]"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 md:px-8 pb-6 md:pb-8 text-slate-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ─── CTA — email input, no legal line ────────────────────────────── */}
      <motion.section
        id="cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={sectionVariants}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="scroll-mt-24 bg-[#0b0f19] px-4 md:px-8 lg:px-24 py-16 md:py-24 lg:py-28 relative overflow-hidden"
      >
        <div className="absolute -top-48 right-0 w-[600px] h-[600px] bg-[#D42B27]/[0.07] blur-[120px] rounded-full pointer-events-none" />

        {/* Scrolling token ticker */}
        <div className="absolute top-0 left-0 right-0 overflow-hidden border-b border-white/10 pointer-events-none">
          <motion.div
            className="flex gap-10 py-2.5 text-xs font-mono text-white/40 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(2)].map((_, rep) => (
              <span key={rep} className="flex gap-10">
                <span>BYOU <span className="text-emerald-400 font-semibold">▲ 2.4%</span></span>
                <span className="text-white/20">·</span>
                <span>ZUTT <span className="text-emerald-400 font-semibold">▲ 1.1%</span></span>
                <span className="text-white/20">·</span>
                <span>EVMN <span className="text-white/30">— TBA</span></span>
                <span className="text-white/20">·</span>
                <span>DALI <span className="text-amber-400/70">— Coming soon</span></span>
                <span className="text-white/20">·</span>
                <span>iRWA Exchange <span className="text-white/25">live</span></span>
                <span className="text-white/20">·</span>
                <span>1,059 holders <span className="text-rose-400 font-semibold">↑</span></span>
                <span className="text-white/20">·</span>
                <span>4 projects <span className="text-white/25">on-chain</span></span>
                <span className="text-white/20">·</span>
              </span>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeInUpVariants}
          transition={{ duration: reduceMotion ? 0 : 0.6 }}
          className="max-w-3xl mx-auto text-center space-y-8 relative z-10 pt-14"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Build your iRWA project
          </h2>
          <p className="text-white/65 text-base md:text-xl leading-relaxed">
            Drop your email and we'll reach out within 24 hours to explore what your belief economy could look like.
          </p>

          {emailSent ? (
            <div className="rounded-2xl bg-white/10 border border-white/20 px-8 py-6 text-white font-semibold text-lg">
              Thanks — we'll be in touch soon.
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-2xl bg-white/10 border border-white/20 px-5 py-4 text-white placeholder-white/40 outline-none focus:border-[#D42B27] focus:bg-white/15 transition"
              />
              <button
                type="submit"
                className="rounded-2xl px-7 py-4 font-semibold text-white hover:opacity-90 transition whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #D42B27, #4E83B8)" }}
              >
                Get in touch
              </button>
            </form>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="/evolution"
              className="text-white/50 hover:text-white/80 text-sm transition underline underline-offset-4"
            >
              Read our story →
            </a>
          </div>
        </motion.div>
      </motion.section>

      <SiteFooter currentPath="/" withMobileSpacer />
    </div>
  );
}
