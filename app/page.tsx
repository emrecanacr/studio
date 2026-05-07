"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  Layers,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  Command,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Flame,
  Target,
  Brain,
  Zap,
  Home,
  TrendingUp,
  FileText,
  Compass,
  Keyboard,
  Settings2,
  Shuffle,
  Trophy,
} from "lucide-react";

// ============================================================
//  CONTENT — parsed from worksheet_weak_areas.md
// ============================================================

const SECTIONS = [
  {
    id: "tresa",
    title: "TRESA & Representation",
    subtitle: "Fiduciary duty, BRAs, and the rules of engagement",
    icon: Compass,
    accent: "rose",
    cards: [
      { id: 1, q: "Under TRESA, when does fiduciary duty to a buyer begin?", a: "When services begin — even before a BRA is signed." },
      { id: 2, q: "What is an \"implied client\" and how does it arise?", a: "An implied client arises when an agent starts providing real estate services without a signed agreement. Fiduciary duty still applies." },
      { id: 3, q: "A buyer refuses to sign a BRA. Name two options you can offer to make it more palatable.", a: "Offer a shorter-term BRA; offer a property-specific BRA; explain they must sign before submitting an offer (TRESA hard line)." },
      { id: 4, q: "What are the three things that must be true for a BRA to be legally enforceable?", a: "REALM registration; specific geography; written and provided to all parties." },
      { id: 5, q: "Under TRESA, what is the hard deadline for having a signed BRA in place?", a: "Before an offer is submitted." },
      { id: 6, q: "What is designated representation and why was it introduced under TRESA?", a: "Designated representation allows two agents at the same brokerage to each fully represent their own client without triggering multiple representation. Introduced under TRESA to fix the REBBA problem where same-brokerage representation automatically created a conflict." },
      { id: 7, q: "What is the difference between a client and a self-represented party under TRESA?", a: "A client receives full fiduciary duties. A self-represented party receives honest dealing but no representation." },
      { id: 8, q: "Difference between multiple representation and designated representation?", a: "Multiple representation = same agent represents both parties (requires written consent). Designated representation = different agents at the same brokerage each represent one party — no conflict." },
    ],
  },
  {
    id: "numbers",
    title: "Financial Numbers",
    subtitle: "The figures you need cold — taxes, ratios, deposits",
    icon: TrendingUp,
    accent: "amber",
    cards: [
      { id: 9, q: "NRST stands for ___ and the rate is ___%", a: "Non-Resident Speculation Tax — 25%" },
      { id: 10, q: "Tarion warranty periods: Year 1 covers ___ / Year 2 covers ___ / Year 7 covers ___", a: "Year 1: workmanship & materials. Year 2: water penetration, HVAC, exterior cladding. Year 7: load-bearing elements." },
      { id: 11, q: "Pre-construction rescission period?", a: "10 calendar days." },
      { id: 12, q: "MOI thresholds: Seller's / Balanced / Buyer's market", a: "Seller's: <4 months. Balanced: 4–6 months. Buyer's: >6 months." },
      { id: 13, q: "GDS formula and maximum threshold?", a: "(Mortgage + property tax + heat + 50% condo fees) ÷ gross annual income. Max: 39%." },
      { id: 14, q: "TDS formula and maximum threshold?", a: "(All housing costs + all other debts) ÷ gross annual income. Max: 44%." },
      { id: 15, q: "Down payment tiers (up to $499K / $500K–$1.5M / $1.5M+ / investment)", a: "5% / 5% on first $500K + 10% on remainder / 20% on entire price / 20% always for investment." },
      { id: 16, q: "Minimum down payment to avoid mortgage insurance?", a: "20%." },
      { id: 17, q: "Most common mortgage insurer?", a: "CMHC — Canada Mortgage and Housing Corporation." },
      { id: 18, q: "Traditional deposit: amount and timing?", a: "5% of purchase price, due within 24 hours of accepted offer." },
      { id: 19, q: "Ontario LTT and Toronto LTT first-time buyer rebates?", a: "Ontario: up to $4,000. Toronto: up to $4,475." },
      { id: 20, q: "FHSA contribution limits?", a: "Up to $8,000/year. Max $40,000 lifetime." },
      { id: 21, q: "RRSP Home Buyers' Plan: max withdrawal and repayment period?", a: "Withdraw up to $35,000. Repay within 15 years." },
      { id: 22, q: "Floor value rule of thumb in a condo building?", a: "$1,500 to $2,000 more per floor higher." },
      { id: 23, q: "Parking & locker costs (rental, owned in fees)?", a: "Parking rental: $150–$200/month. Owned parking in fees: ~$55/month. Owned locker in fees: $10–$20/month." },
      { id: 24, q: "Co-op minimum down payment range?", a: "35% to 50%." },
      { id: 25, q: "Co-op price vs neighbouring condos?", a: "Approximately 25% below." },
      { id: 26, q: "Investor break-even down payment for downtown Toronto condo?", a: "30% to 40%." },
    ],
  },
  {
    id: "concepts",
    title: "Core Concepts",
    subtitle: "Definitions, mechanics, and short-answer essentials",
    icon: Brain,
    accent: "violet",
    cards: [
      { id: 27, q: "Three ways a deposit can be released from the listing brokerage's trust?", a: "1. Mutual release. 2. Court order. 3. Successful completion of transaction (closing)." },
      { id: 28, q: "What is a HELOC and how does an investor use it to build a portfolio?", a: "A Home Equity Line of Credit lets investors borrow against equity built in an appreciated property. Strategy: buy property → property appreciates → unlock equity via HELOC → use as down payment on next property → repeat. Risk: stagnant markets produce no equity to unlock." },
      { id: 29, q: "Define bearish and bullish.", a: "Bullish = expects market to rise. Bearish = expects market to decline." },
      { id: 30, q: "Drawback of investing in a mature, established area?", a: "Appreciation only tracks the broader market average — no outsized gains." },
      { id: 31, q: "Two drawbacks of investing in an up-and-coming area?", a: "Lower/less reliable rents; area may stay stagnant for decades with no appreciation." },
      { id: 32, q: "Capital gains: bought $300K, sold $550K, rented entire period. Calculate.", a: "Capital gain = $250,000. Taxable portion (50% inclusion) = $125,000. Tax type: Capital gains tax — 50% inclusion rate, taxed at marginal rate." },
      { id: 33, q: "Two options for a buyer whose inspector finds knob & tube wiring?", a: "1. Replace the wiring ($3,000–$10,000+). 2. Accept extremely high insurance premiums (or it may not be insurable at all). Add a condition for electrician AND insurer sign-off." },
      { id: 34, q: "What does \"shall survive and not merge on completion\" mean?", a: "The seller's promise (e.g. that appliances are in good working order) doesn't end at closing — it carries forward. In practice it only protects the buyer if the deficiency existed at closing AND can be proven. After closing, the burden of proof is on the buyer." },
      { id: 35, q: "Standard number of buyer visits in an APS, and when should the last one occur?", a: "2 visits standard. Last visit: 3–4 business days before closing — not the day before — so the seller has time to fix any deficiencies." },
      { id: 36, q: "If a seller's appliance breaks before closing, buyer's two options?", a: "1. Insist seller repair/replace before closing. 2. Holdback — deduct repair cost from closing funds. Note: seller can refuse to close if holdback isn't agreed to." },
      { id: 37, q: "What is a co-op? Three key differences from a condo.", a: "Buy shares in a corporation that grant exclusive rights to a unit — not the unit itself. Differences: (1) board can interview and reject buyers, (2) most banks won't lend (DUCA Financial does), (3) 35–50% down required, (4) priced ~25% below neighbouring condos." },
      { id: 38, q: "What is a special assessment? Real-world example?", a: "A lump sum charge to all unit owners when the reserve fund is too low to cover a major repair. Example: building needs new balconies — each owner gets a $20,000 special assessment bill." },
      { id: 39, q: "What is a mezzanine loft?", a: "A two-storey unit inside a loft building with the bedroom perched above the living space. Ceiling heights 14–18 feet. Very rare in the GTA." },
      { id: 40, q: "What does it mean to \"register\" an offer, and why register an hour before submission?", a: "Registering = formally notifying the listing brokerage you intend to submit an offer before sending it. Agents register early so all parties know the level of competition and have time to improve their offers before the deadline." },
    ],
  },
  {
    id: "scenarios",
    title: "Scenarios",
    subtitle: "Real situations that test ethics and strategy together",
    icon: Zap,
    accent: "emerald",
    cards: [
      { id: 41, q: "Listing agent calls before your buyer's offer is submitted: \"Four offers, all around $880K.\" Walk through your steps.", a: "1. Recognize as a potential ethics violation — listing agent shouldn't share offer details without seller's consent. 2. Do not act on the information strategically. 3. Disclose to your buyer that you received this unsolicited information and cannot verify it. 4. Document the call. 5. Consult your broker. 6. Escalate to RECO if warranted." },
      { id: 42, q: "Seller wants $1.1M. CMA shows $950K–$975K. They won't budge.", a: "Present 3–5 comparables — let the data speak, not your opinion. Offer a pre-agreed price reduction schedule (\"if no offer in 2 weeks, we reduce to $X\"). If they still refuse, consider whether to take the listing — an overpriced listing that sits damages your reputation." },
      { id: 43, q: "A bully offer comes in two days before the offer date. Three options? Your job?", a: "Three options: (1) Accept, (2) Decline and proceed to original offer date, (3) Bring the offer date forward. Your job: notify all agents who registered interest, present options to the seller, let the seller decide. You don't steer." },
      { id: 44, q: "Buyer under signed BRA finds a property on their own and wants to make an offer without your help.", a: "Your obligations: full fiduciary duty still applies — prepare the offer, advise on price, negotiate. The BRA covers any property within its scope regardless of who found it. Their obligations: they cannot cut you out to avoid commission — the BRA stands." },
      { id: 45, q: "Seller tells you basement flooded twice in past three years. Says \"don't tell the buyers.\"", a: "Disclose it. This is a material fact — under TRESA you must disclose known defects to every potential buyer. The seller cannot instruct you to withhold it. If they insist, consider whether you can continue representing them." },
      { id: 46, q: "Investor: $600K Toronto condo. Rents for $2,200/month. $900/month expenses. 20% down. Cash flow?", a: "Cash flow NEGATIVE. Mortgage on $480K (20% down on $600K) at ~5% ≈ $2,800/month. Plus $900 expenses = $3,700/month costs. Rent is $2,200. Monthly deficit: ~$1,500. Investor is buying for appreciation, not yield." },
    ],
  },
];

// flatten for search & quiz
const ALL_CARDS = SECTIONS.flatMap((s) =>
  s.cards.map((c) => ({ ...c, sectionId: s.id, sectionTitle: s.title, sectionAccent: s.accent }))
);

const ACCENT = {
  rose:    { soft: "#FFF1F2", mid: "#FECDD3", strong: "#E11D48", text: "#9F1239", glow: "244, 63, 94" },
  amber:   { soft: "#FFFBEB", mid: "#FDE68A", strong: "#D97706", text: "#92400E", glow: "217, 119, 6" },
  violet:  { soft: "#F5F3FF", mid: "#DDD6FE", strong: "#7C3AED", text: "#5B21B6", glow: "124, 58, 237" },
  emerald: { soft: "#ECFDF5", mid: "#A7F3D0", strong: "#059669", text: "#065F46", glow: "5, 150, 105" },
};

// ============================================================
//  HOOKS
// ============================================================

const useLocalProgress = () => {
  const [progress, setProgress] = useState(() => {
    // in-memory only — Claude artifacts don't allow localStorage
    return {};
  });
  const mark = (id, status) =>
    setProgress((p) => ({ ...p, [id]: status }));
  const reset = () => setProgress({});
  return { progress, mark, reset };
};

const useKeyboard = (handlers) => {
  useEffect(() => {
    const onKey = (e) => {
      // ignore when typing in input
      const tag = e.target.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA";
      const key = e.key.toLowerCase();
      const cmd = e.metaKey || e.ctrlKey;
      if (cmd && key === "k") {
        e.preventDefault();
        handlers.search?.();
        return;
      }
      if (inField) return;
      if (handlers[key]) {
        e.preventDefault();
        handlers[key]();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
};

// ============================================================
//  PRIMITIVES
// ============================================================

const ProgressRing = ({ value, size = 40, stroke = 3, color = "#0F172A" }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#E2E8F0" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (value / 100) * c }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </svg>
  );
};

const Pill = ({ children, accent = "rose", subtle = true }) => {
  const a = ACCENT[accent];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
      style={{
        background: subtle ? a.soft : a.strong,
        color: subtle ? a.text : "#fff",
      }}
    >
      {children}
    </span>
  );
};

// ============================================================
//  COMMAND PALETTE
// ============================================================

const CommandPalette = ({ open, onClose, onJump }) => {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return ALL_CARDS.slice(0, 8);
    const term = q.toLowerCase();
    return ALL_CARDS.filter(
      (c) =>
        c.q.toLowerCase().includes(term) ||
        c.a.toLowerCase().includes(term) ||
        c.sectionTitle.toLowerCase().includes(term)
    ).slice(0, 12);
  }, [q]);

  useEffect(() => setActive(0), [q]);

  const onKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      onJump(results[active]);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
          style={{ background: "rgba(15, 23, 42, 0.18)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.92)",
              backdropFilter: "blur(24px) saturate(1.4)",
              border: "1px solid rgba(15, 23, 42, 0.06)",
              boxShadow: "0 30px 80px -20px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15,23,42,0.04)",
            }}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
              <Search size={18} className="text-slate-400" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search every card, concept, and answer…"
                className="flex-1 bg-transparent outline-none text-[15px] text-slate-900 placeholder:text-slate-400"
              />
              <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 bg-slate-50">
                ESC
              </kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-slate-400">
                  No matches. Try a different keyword.
                </div>
              ) : (
                results.map((r, i) => (
                  <button
                    key={r.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => {
                      onJump(r);
                      onClose();
                    }}
                    className="w-full text-left px-5 py-3 flex items-start gap-3 transition-colors"
                    style={{
                      background: i === active ? ACCENT[r.sectionAccent].soft : "transparent",
                    }}
                  >
                    <div
                      className="mt-1 w-1 h-9 rounded-full flex-shrink-0"
                      style={{ background: ACCENT[r.sectionAccent].strong }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-medium uppercase tracking-wider"
                          style={{ color: ACCENT[r.sectionAccent].text }}
                        >
                          {r.sectionTitle}
                        </span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className="text-[10px] text-slate-400">Q{r.id}</span>
                      </div>
                      <div className="text-[14px] text-slate-800 line-clamp-2 leading-snug">
                        {r.q}
                      </div>
                    </div>
                    {i === active && (
                      <ArrowRight size={14} className="text-slate-400 mt-2" />
                    )}
                  </button>
                ))
              )}
            </div>
            <div className="px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="font-mono px-1 py-0.5 rounded border border-slate-200 bg-white">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-mono px-1 py-0.5 rounded border border-slate-200 bg-white">↵</kbd>
                  jump
                </span>
              </div>
              <span>{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================
//  READ MODE — the elegant reading experience
// ============================================================

const StudyCard = ({ card, accent, status, onMark, focusMode }) => {
  const [revealed, setRevealed] = useState(false);
  const a = ACCENT[accent];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 26 }}
      className="group relative rounded-2xl bg-white border border-slate-100 overflow-hidden"
      style={{
        boxShadow: revealed
          ? `0 1px 0 0 ${a.mid}, 0 8px 24px -8px rgba(${a.glow}, 0.12)`
          : "0 1px 0 0 rgba(15,23,42,0.03), 0 1px 2px 0 rgba(15,23,42,0.04)",
      }}
    >
      {/* status rail */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all"
        style={{
          background:
            status === "known"
              ? "#10B981"
              : status === "review"
              ? "#F59E0B"
              : "transparent",
        }}
      />
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md"
              style={{ background: a.soft, color: a.text }}
            >
              Q{card.id}
            </span>
            {status && (
              <Pill accent={status === "known" ? "emerald" : "amber"}>
                {status === "known" ? <Check size={10} /> : <Flame size={10} />}
                {status === "known" ? "Known" : "Review"}
              </Pill>
            )}
          </div>
          {!focusMode && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onMark(card.id, status === "known" ? null : "known")}
                className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                title="Mark as known"
              >
                <Check size={14} />
              </button>
              <button
                onClick={() => onMark(card.id, status === "review" ? null : "review")}
                className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors"
                title="Mark for review"
              >
                <Flame size={14} />
              </button>
            </div>
          )}
        </div>

        <h3
          className="text-[17px] sm:text-[18px] leading-[1.5] text-slate-900 mb-5 font-medium"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {card.q}
        </h3>

        <button
          onClick={() => setRevealed((r) => !r)}
          className="inline-flex items-center gap-2 text-[13px] font-medium transition-all"
          style={{ color: revealed ? a.text : "#64748B" }}
        >
          {revealed ? (
            <>
              <EyeOff size={13} />
              Hide answer
            </>
          ) : (
            <>
              <Eye size={13} />
              Reveal answer
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
              className="overflow-hidden"
            >
              <div
                className="mt-5 pt-5 border-t text-[15px] leading-[1.65] text-slate-700"
                style={{ borderColor: a.mid + "60" }}
              >
                {card.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const ReadMode = ({ activeSection, progress, onMark, focusMode }) => {
  const section = SECTIONS.find((s) => s.id === activeSection);
  const Icon = section.icon;
  const a = ACCENT[section.accent];

  const sectionStats = useMemo(() => {
    const known = section.cards.filter((c) => progress[c.id] === "known").length;
    const review = section.cards.filter((c) => progress[c.id] === "review").length;
    return { known, review, total: section.cards.length };
  }, [section, progress]);

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: a.soft }}
            >
              <Icon size={20} style={{ color: a.strong }} />
            </div>
            <div>
              <div
                className="text-[11px] font-medium uppercase tracking-[0.14em]"
                style={{ color: a.text }}
              >
                Section · {SECTIONS.findIndex((s) => s.id === section.id) + 1} of {SECTIONS.length}
              </div>
            </div>
          </div>

          <h1
            className="text-[42px] sm:text-[52px] leading-[1.05] tracking-[-0.02em] text-slate-900 mb-3"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {section.title}
          </h1>
          <p className="text-[17px] text-slate-500 leading-relaxed max-w-xl">
            {section.subtitle}
          </p>

          {/* progress bar */}
          <div className="mt-8 flex items-center gap-6 text-[13px]">
            <div className="flex items-center gap-2">
              <div className="relative w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="absolute left-0 top-0 bottom-0 rounded-full"
                  style={{ background: a.strong }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(sectionStats.known / sectionStats.total) * 100}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 22 }}
                />
              </div>
              <span className="text-slate-500 tabular-nums">
                {sectionStats.known} / {sectionStats.total}
              </span>
            </div>
            {sectionStats.review > 0 && (
              <span className="text-amber-600 tabular-nums flex items-center gap-1.5">
                <Flame size={12} /> {sectionStats.review} flagged
              </span>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {section.cards.map((card) => (
            <StudyCard
              key={card.id}
              card={card}
              accent={section.accent}
              status={progress[card.id]}
              onMark={onMark}
              focusMode={focusMode}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
//  FLASHCARD MODE
// ============================================================

const FlashcardMode = ({ progress, onMark, scope, setScope }) => {
  const pool = useMemo(() => {
    if (scope === "all") return ALL_CARDS;
    if (scope === "review") return ALL_CARDS.filter((c) => progress[c.id] === "review");
    if (scope === "unknown") return ALL_CARDS.filter((c) => progress[c.id] !== "known");
    return ALL_CARDS.filter((c) => c.sectionId === scope);
  }, [scope, progress]);

  const [order, setOrder] = useState(() => pool.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(pool.map((_, i) => i));
    setIdx(0);
    setFlipped(false);
  }, [scope, pool.length]);

  const card = pool[order[idx]];

  const next = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + 1) % Math.max(pool.length, 1)), 120);
  }, [pool.length]);

  const prev = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i - 1 + pool.length) % Math.max(pool.length, 1)), 120);
  }, [pool.length]);

  const shuffle = () => {
    const o = [...order];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    setOrder(o);
    setIdx(0);
    setFlipped(false);
  };

  useKeyboard({
    " ": () => setFlipped((f) => !f),
    arrowright: next,
    arrowleft: prev,
    j: () => card && onMark(card.id, "known") + next(),
    k: () => card && onMark(card.id, "review") + next(),
    s: shuffle,
  });

  if (!card) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl bg-emerald-50 flex items-center justify-center">
          <Trophy size={28} className="text-emerald-600" />
        </div>
        <h2 className="text-3xl font-medium text-slate-900 mb-3" style={{ fontFamily: "var(--font-display)" }}>
          Nothing to review
        </h2>
        <p className="text-slate-500 mb-8">
          You've cleared this set. Switch scope to keep practicing.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setScope("all")}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-medium"
          >
            Study all cards
          </button>
        </div>
      </div>
    );
  }

  const a = ACCENT[card.sectionAccent];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 mb-1">
            Flashcards
          </div>
          <div className="text-[15px] text-slate-700 tabular-nums">
            <span className="font-medium text-slate-900">{idx + 1}</span>
            <span className="text-slate-300 mx-1.5">/</span>
            <span>{pool.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="text-[13px] px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <option value="all">All cards ({ALL_CARDS.length})</option>
            <option value="unknown">Not yet known</option>
            <option value="review">Flagged for review</option>
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.cards.length})
              </option>
            ))}
          </select>
          <button
            onClick={shuffle}
            className="p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-slate-600"
            title="Shuffle (S)"
          >
            <Shuffle size={15} />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 mb-8">
        {pool.slice(0, Math.min(pool.length, 60)).map((p, i) => (
          <div
            key={i}
            className="h-0.5 flex-1 rounded-full transition-all"
            style={{
              background:
                i === idx
                  ? a.strong
                  : i < idx
                  ? "rgba(15,23,42,0.2)"
                  : "rgba(15,23,42,0.06)",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div style={{ perspective: 2000 }} className="mb-8">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 24 }}
          className="relative w-full"
          style={{ height: 420 }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 rounded-3xl p-10 sm:p-14 flex flex-col cursor-pointer"
              style={{
                backfaceVisibility: "hidden",
                background: `linear-gradient(180deg, ${a.soft} 0%, #FFFFFF 60%)`,
                border: `1px solid ${a.mid}80`,
                boxShadow: `0 24px 60px -20px rgba(${a.glow}, 0.18), 0 0 0 1px rgba(15,23,42,0.02)`,
              }}
              onClick={() => setFlipped(true)}
            >
              <div className="flex items-center justify-between mb-auto">
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.14em]"
                  style={{ color: a.text }}
                >
                  {card.sectionTitle}
                </span>
                <span className="text-[11px] font-mono text-slate-400">Q{card.id}</span>
              </div>
              <div className="my-auto">
                <h2
                  className="text-[26px] sm:text-[32px] leading-[1.25] tracking-[-0.01em] text-slate-900 font-medium"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {card.q}
                </h2>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[12px] text-slate-400 flex items-center gap-2">
                  <kbd className="font-mono px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px]">
                    SPACE
                  </kbd>
                  to flip
                </span>
                <ArrowRight size={16} className="text-slate-300" />
              </div>
            </div>
            {/* BACK */}
            <div
              className="absolute inset-0 rounded-3xl p-10 sm:p-14 flex flex-col cursor-pointer bg-white"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                border: `1px solid ${a.mid}`,
                boxShadow: `0 24px 60px -20px rgba(${a.glow}, 0.22)`,
              }}
              onClick={() => setFlipped(false)}
            >
              <div className="flex items-center justify-between mb-6">
                <span
                  className="text-[10px] font-medium uppercase tracking-[0.14em]"
                  style={{ color: a.text }}
                >
                  Answer
                </span>
                <span className="text-[11px] font-mono text-slate-400">Q{card.id}</span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <p className="text-[18px] sm:text-[19px] leading-[1.55] text-slate-800">
                  {card.a}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={prev}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors text-slate-600"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => {
            if (card) onMark(card.id, "review");
            next();
          }}
          className="px-5 py-3 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors text-amber-700 font-medium text-[14px] flex items-center gap-2"
        >
          <Flame size={14} />
          Need review
          <kbd className="font-mono text-[10px] opacity-50 ml-1">K</kbd>
        </button>
        <button
          onClick={() => {
            if (card) onMark(card.id, "known");
            next();
          }}
          className="px-5 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors text-emerald-700 font-medium text-[14px] flex items-center gap-2"
        >
          <Check size={14} />
          Got it
          <kbd className="font-mono text-[10px] opacity-50 ml-1">J</kbd>
        </button>
        <button
          onClick={next}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-colors text-slate-600"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="mt-6 text-center text-[12px] text-slate-400 flex items-center justify-center gap-4">
        <span><kbd className="font-mono px-1 py-0.5 rounded border border-slate-200 bg-white text-[10px]">SPACE</kbd> flip</span>
        <span><kbd className="font-mono px-1 py-0.5 rounded border border-slate-200 bg-white text-[10px]">←→</kbd> navigate</span>
        <span><kbd className="font-mono px-1 py-0.5 rounded border border-slate-200 bg-white text-[10px]">S</kbd> shuffle</span>
      </div>
    </div>
  );
};

// ============================================================
//  QUIZ MODE — self-grade
// ============================================================

const QuizMode = ({ progress, onMark }) => {
  const [order, setOrder] = useState(() => {
    const arr = [...ALL_CARDS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 10);
  });
  const [idx, setIdx] = useState(0);
  const [response, setResponse] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState({}); // id -> 'right'|'wrong'

  const card = order[idx];
  const done = idx >= order.length;

  const restart = () => {
    const arr = [...ALL_CARDS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setOrder(arr.slice(0, 10));
    setIdx(0);
    setResponse("");
    setRevealed(false);
    setResults({});
  };

  if (done) {
    const right = Object.values(results).filter((r) => r === "right").length;
    const score = Math.round((right / order.length) * 100);
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 18 }}
          className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center"
          style={{
            background:
              score >= 80
                ? "linear-gradient(135deg, #ECFDF5, #D1FAE5)"
                : score >= 60
                ? "linear-gradient(135deg, #FFFBEB, #FEF3C7)"
                : "linear-gradient(135deg, #FFF1F2, #FECDD3)",
          }}
        >
          <Trophy
            size={36}
            style={{
              color: score >= 80 ? "#059669" : score >= 60 ? "#D97706" : "#E11D48",
            }}
          />
        </motion.div>
        <div
          className="text-[64px] font-medium text-slate-900 leading-none mb-2 tabular-nums"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {score}%
        </div>
        <p className="text-slate-500 mb-2">
          You got <span className="font-medium text-slate-900">{right}</span> out of{" "}
          <span className="font-medium text-slate-900">{order.length}</span> right.
        </p>
        <p className="text-[14px] text-slate-400 mb-10">
          {score >= 80
            ? "Sharp work. You're cruising."
            : score >= 60
            ? "Solid foundation — review the misses."
            : "Plenty to refine. Hit the flashcards next."}
        </p>
        <button
          onClick={restart}
          className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-[14px] font-medium hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
        >
          <RotateCcw size={14} />
          New quiz
        </button>
      </div>
    );
  }

  const a = ACCENT[card.sectionAccent];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400 mb-1">
            Quiz · 10 random
          </div>
          <div className="text-[15px] text-slate-700 tabular-nums">
            <span className="font-medium text-slate-900">{idx + 1}</span>
            <span className="text-slate-300 mx-1.5">/</span>
            <span>{order.length}</span>
          </div>
        </div>
        <button
          onClick={restart}
          className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
        >
          <RotateCcw size={13} />
          Restart
        </button>
      </div>

      <div className="flex gap-1 mb-10">
        {order.map((c, i) => (
          <div
            key={c.id}
            className="h-0.5 flex-1 rounded-full transition-all"
            style={{
              background:
                results[c.id] === "right"
                  ? "#10B981"
                  : results[c.id] === "wrong"
                  ? "#F59E0B"
                  : i === idx
                  ? a.strong
                  : "rgba(15,23,42,0.06)",
            }}
          />
        ))}
      </div>

      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-2">
          <span
            className="text-[10px] font-medium uppercase tracking-[0.14em]"
            style={{ color: a.text }}
          >
            {card.sectionTitle}
          </span>
        </div>
        <h2
          className="text-[28px] sm:text-[32px] leading-[1.2] tracking-[-0.01em] text-slate-900 font-medium mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {card.q}
        </h2>

        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          disabled={revealed}
          placeholder="Type your answer from memory…"
          rows={4}
          className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none resize-none text-[15px] leading-relaxed placeholder:text-slate-400 focus:bg-white focus:border-slate-300 transition-all disabled:opacity-60"
          style={{ fontFamily: "var(--font-body)" }}
        />

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="mt-5 p-5 rounded-2xl border"
                style={{ background: a.soft, borderColor: a.mid + "80" }}
              >
                <div
                  className="text-[10px] font-medium uppercase tracking-[0.14em] mb-2"
                  style={{ color: a.text }}
                >
                  Reference answer
                </div>
                <p className="text-[15px] leading-[1.6] text-slate-800">{card.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="flex-1 py-3.5 rounded-2xl bg-slate-900 text-white font-medium text-[14px] hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={14} />
              Show reference answer
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setResults((r) => ({ ...r, [card.id]: "wrong" }));
                  onMark(card.id, "review");
                  setIdx((i) => i + 1);
                  setResponse("");
                  setRevealed(false);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors text-amber-700 font-medium text-[14px] flex items-center justify-center gap-2"
              >
                <X size={14} />
                Missed it
              </button>
              <button
                onClick={() => {
                  setResults((r) => ({ ...r, [card.id]: "right" }));
                  onMark(card.id, "known");
                  setIdx((i) => i + 1);
                  setResponse("");
                  setRevealed(false);
                }}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors text-emerald-700 font-medium text-[14px] flex items-center justify-center gap-2"
              >
                <Check size={14} />
                Got it right
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================
//  SIDEBAR
// ============================================================

const Sidebar = ({ activeSection, setActiveSection, mode, setMode, progress, onSearch, onReset, focusMode, setFocusMode }) => {
  const totalKnown = Object.values(progress).filter((s) => s === "known").length;
  const totalReview = Object.values(progress).filter((s) => s === "review").length;
  const overallPct = (totalKnown / ALL_CARDS.length) * 100;

  return (
    <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0 h-screen sticky top-0 border-r border-slate-100 bg-white/60 backdrop-blur-xl">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
            <Home size={14} className="text-white" />
          </div>
          <span
            className="text-[16px] font-medium tracking-[-0.01em] text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Studio
          </span>
        </div>
        <p className="text-[11px] text-slate-400 ml-[38px] -mt-0.5">Real estate weak areas</p>
      </div>

      {/* Search trigger */}
      <button
        onClick={onSearch}
        className="mx-4 mt-4 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all text-left group"
      >
        <Search size={14} className="text-slate-400" />
        <span className="text-[13px] text-slate-500 flex-1">Search…</span>
        <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 bg-white">
          ⌘K
        </kbd>
      </button>

      {/* Modes */}
      <div className="px-4 mt-6 mb-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 px-2 mb-2">
          Mode
        </div>
        <div className="space-y-0.5">
          {[
            { id: "read", label: "Read", icon: BookOpen },
            { id: "flash", label: "Flashcards", icon: Layers },
            { id: "quiz", label: "Quiz", icon: Target },
          ].map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] transition-all relative"
                style={{
                  background: isActive ? "rgba(15,23,42,0.04)" : "transparent",
                  color: isActive ? "#0F172A" : "#64748B",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="modeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-slate-900"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={14} className="ml-1.5" />
                <span className="font-medium">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sections */}
      {mode === "read" && (
        <div className="px-4 mt-4 flex-1 overflow-y-auto">
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 px-2 mb-2">
            Sections
          </div>
          <div className="space-y-0.5">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const a = ACCENT[s.accent];
              const isActive = activeSection === s.id;
              const known = s.cards.filter((c) => progress[c.id] === "known").length;
              const pct = (known / s.cards.length) * 100;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="w-full flex items-start gap-2.5 px-2 py-2.5 rounded-lg text-left transition-all group relative"
                  style={{
                    background: isActive ? a.soft : "transparent",
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sectionIndicator"
                      className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
                      style={{ background: a.strong }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <div className="ml-1.5 mt-0.5">
                    <Icon size={13} style={{ color: isActive ? a.strong : "#94A3B8" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-[13px] font-medium leading-tight mb-1"
                      style={{ color: isActive ? a.text : "#475569" }}
                    >
                      {s.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: a.strong }}
                        />
                      </div>
                      <span className="text-[10px] tabular-nums text-slate-400">
                        {known}/{s.cards.length}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {mode !== "read" && <div className="flex-1" />}

      {/* Footer: overall progress */}
      <div className="p-4 border-t border-slate-100">
        <div className="px-2 py-3 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <ProgressRing value={overallPct} size={36} stroke={3} color="#0F172A" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-slate-400 leading-tight">Overall mastery</div>
              <div className="text-[16px] font-medium text-slate-900 tabular-nums leading-tight">
                {Math.round(overallPct)}%
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="px-2 py-1.5 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-between">
              <span>Known</span>
              <span className="font-medium tabular-nums">{totalKnown}</span>
            </div>
            <div className="px-2 py-1.5 rounded-md bg-amber-50 text-amber-700 flex items-center justify-between">
              <span>Review</span>
              <span className="font-medium tabular-nums">{totalReview}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <button
            onClick={() => setFocusMode((f) => !f)}
            className="text-[12px] text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Sparkles size={12} />
            {focusMode ? "Exit focus" : "Focus mode"}
          </button>
          <button
            onClick={onReset}
            className="text-[12px] text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
};

// ============================================================
//  MOBILE TOP BAR
// ============================================================

const MobileBar = ({ mode, setMode, activeSection, setActiveSection, onSearch, progress }) => {
  const [open, setOpen] = useState(false);
  const totalKnown = Object.values(progress).filter((s) => s === "known").length;
  const overallPct = (totalKnown / ALL_CARDS.length) * 100;

  return (
    <>
      <div
        className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 border-b border-slate-100"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)" }}
      >
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5"
        >
          <ProgressRing value={overallPct} size={28} stroke={2.5} color="#0F172A" />
          <span
            className="text-[15px] font-medium text-slate-900"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Studio
          </span>
        </button>
        <div className="flex items-center gap-1">
          {[
            { id: "read", icon: BookOpen },
            { id: "flash", icon: Layers },
            { id: "quiz", icon: Target },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  background: mode === m.id ? "#0F172A" : "transparent",
                  color: mode === m.id ? "#fff" : "#64748B",
                }}
              >
                <Icon size={15} />
              </button>
            );
          })}
          <button
            onClick={onSearch}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Search size={15} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[320px] bg-white p-6 overflow-y-auto"
            >
              <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 mb-3">
                Sections
              </div>
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                const a = ACCENT[s.accent];
                const known = s.cards.filter((c) => progress[c.id] === "known").length;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSection(s.id);
                      setMode("read");
                      setOpen(false);
                    }}
                    className="w-full flex items-start gap-3 p-3 rounded-xl text-left mb-1"
                    style={{
                      background: activeSection === s.id ? a.soft : "transparent",
                    }}
                  >
                    <Icon size={16} style={{ color: a.strong }} className="mt-0.5" />
                    <div className="flex-1">
                      <div className="text-[14px] font-medium text-slate-900">{s.title}</div>
                      <div className="text-[12px] text-slate-500 mt-0.5">
                        {known} / {s.cards.length} known
                      </div>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================
//  MAIN APP
// ============================================================

export default function App() {
  const [mode, setMode] = useState("read");
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [flashScope, setFlashScope] = useState("all");

  const { progress, mark, reset } = useLocalProgress();

  useKeyboard({
    search: () => setSearchOpen(true),
    "1": () => setMode("read"),
    "2": () => setMode("flash"),
    "3": () => setMode("quiz"),
    f: () => setFocusMode((f) => !f),
  });

  const handleJump = (card) => {
    setMode("read");
    setActiveSection(card.sectionId);
    setTimeout(() => {
      const el = document.getElementById(`card-${card.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
  };

  return (
    <div
      className="min-h-screen w-full text-slate-900 antialiased"
      style={{
        fontFamily: "var(--font-body)",
        background:
          "radial-gradient(ellipse 1200px 800px at 0% 0%, #FFF8F1 0%, transparent 50%), radial-gradient(ellipse 1000px 700px at 100% 100%, #F1F5FF 0%, transparent 50%), #FCFCFD",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap');
        :root {
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        body { font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'; }
        ::selection { background: rgba(15, 23, 42, 0.08); }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.08); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(15,23,42,0.18); }
      `}</style>

      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          mode={mode}
          setMode={setMode}
          progress={progress}
          onSearch={() => setSearchOpen(true)}
          onReset={reset}
          focusMode={focusMode}
          setFocusMode={setFocusMode}
        />

        <main className="flex-1 min-w-0">
          <MobileBar
            mode={mode}
            setMode={setMode}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onSearch={() => setSearchOpen(true)}
            progress={progress}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={mode + (mode === "read" ? activeSection : "")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mode === "read" && (
                <ReadMode
                  activeSection={activeSection}
                  progress={progress}
                  onMark={mark}
                  focusMode={focusMode}
                />
              )}
              {mode === "flash" && (
                <FlashcardMode
                  progress={progress}
                  onMark={mark}
                  scope={flashScope}
                  setScope={setFlashScope}
                />
              )}
              {mode === "quiz" && <QuizMode progress={progress} onMark={mark} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onJump={handleJump}
      />
    </div>
  );
}