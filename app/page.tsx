"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Search,
  BookOpen,
  Layers,
  Target,
  Compass,
  TrendingUp,
  Brain,
  Zap,
  Eye,
  EyeOff,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Trophy,
  Shuffle,
  Bookmark,
  Flame,
  Sparkles,
  ChevronRight,
  ChevronDown,
  CircleDot,
  Filter,
  Home,
  KeyRound,
  Plus,
  Trash2,
  Edit2,
  User,
  Users,
} from "lucide-react";

// ============================================================
//  CONTENT
// ============================================================

type AccentKey = "blue" | "orange" | "purple" | "green" | "pink" | "teal";
type Status = "not_studied" | "review" | "comfortable" | "mastered";

type Card = {
  id: number;
  q: string;
  a: string;
  sectionId: string;
  sectionTitle: string;
  sectionAccent: AccentKey;
  source: "worksheet" | "interview";
  topic?: string;
};

type Section = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  accent: AccentKey;
  cards: { id: number; q: string; a: string }[];
};

const WORKSHEET_SECTIONS: Section[] = [
  {
    id: "tresa",
    title: "TRESA & Representation",
    subtitle: "Fiduciary duty, BRAs, and the rules of engagement",
    icon: Compass,
    accent: "blue",
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
    accent: "orange",
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
    accent: "purple",
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
    accent: "green",
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

// "Highly Possible Questions" — rewritten for clarity & professionalism
type InterviewQ = { id: number; topic: string; q: string; a: string };

const INTERVIEW_QUESTIONS: InterviewQ[] = [
  // Closing Costs
  { id: 1, topic: "Closing Costs", q: "What are the primary closing costs a buyer pays when purchasing a property?", a: "Land transfer tax (provincial + Toronto if applicable), legal fees ($1,500–$2,500), title insurance ($300–$500), home inspection (~$500), HST on new builds, mortgage default insurance if <20% down, status certificate fee for condos (~$100), and adjustments for prepaid taxes/utilities." },
  { id: 2, topic: "Closing Costs", q: "Of all the closing costs, which is typically the most expensive for a buyer?", a: "Land transfer tax — especially in Toronto where buyers pay both Ontario and Toronto LTT. On a $1M home that's roughly $32,000 combined." },
  { id: 3, topic: "Closing Costs", q: "What are the two types of land transfer tax that apply to Toronto buyers?", a: "Ontario Land Transfer Tax (provincial) and Toronto Municipal Land Transfer Tax (city-specific, applies only inside the City of Toronto)." },

  // Appraising
  { id: 4, topic: "Appraising", q: "What is the floor-value rule of thumb in a condo building? Is each higher floor worth more or less?", a: "Each additional floor is traditionally worth $1,500–$2,000 more. Higher floors typically command higher prices due to better views and less noise." },
  { id: 5, topic: "Appraising", q: "How do you appraise an outdoor space in a condo, such as a 100 sq ft balcony?", a: "Outdoor space is valued at approximately 25–50% of the per-square-foot value of the interior space." },
  { id: 6, topic: "Appraising", q: "Name two reasons a lender might decline to mortgage a specific property (not the buyer).", a: "(1) Building has Kitec plumbing or knob and tube wiring. (2) High percentage of rental units in the building. (3) Pending litigation against the condo corporation. (4) Underfunded reserve fund. (5) Co-op (most banks won't lend at all)." },
  { id: 7, topic: "Appraising", q: "Your client buys a condo for $750K in competition against seven offers. The bank later appraises the property at $720K — though the preapproval was $750K. What are the consequences?", a: "The lender will only lend against the appraised value of $720K. The buyer must come up with the $30K shortfall in cash on top of their down payment, OR risk losing their deposit if they can't close. This is appraisal risk in competition." },

  // Buyers
  { id: 8, topic: "Buyers", q: "What does it mean for a buyer to have a mortgage preapproval from a lender?", a: "A preapproval is a lender's tentative commitment to lend up to a certain amount based on the buyer's financials (income, credit, debt). It's not binding on a specific property and isn't a guarantee — final approval depends on the property appraisal and a fresh credit check at closing." },
  { id: 9, topic: "Buyers", q: "Give two reasons a buyer might prefer a mortgage broker over going directly to a single bank.", a: "(1) Brokers shop multiple lenders for the best rate. (2) Brokers can find lenders who'll approve buyers a single bank might decline (self-employed, new immigrants, unique properties). (3) One credit check covers many lenders." },
  { id: 10, topic: "Buyers", q: "You're competing with a firm offer. Yours has a 5-day financing condition that the seller is uncomfortable with, and your client can't remove it. How can you make the condition more palatable?", a: "Shorten the period (1–2 days). Add proof of preapproval letter. Increase deposit. Offer a larger irrevocable. Have buyer's mortgage broker call the listing agent directly. Add escalation clause. Last resort: have buyer's lawyer review and remove condition same-day if confident." },
  { id: 11, topic: "Buyers", q: "Your client wants to monitor MLS listings on their own. Name two things you'd want them to know about public listing data.", a: "(1) Public sites like Realtor.ca have a 24+ hour delay — agents see listings first. (2) Many listings get pulled fast in hot markets, often before the public ever sees them. (3) Listings often get terminated and re-listed, which manipulates Days on Market — easy to misread without context." },
  { id: 12, topic: "Buyers", q: "What is the most common deposit percentage in Toronto, and does it count toward the down payment at closing?", a: "5% of the purchase price is the standard. Yes — the deposit is credited toward the down payment at closing, not on top of it." },
  { id: 13, topic: "Buyers", q: "Name the three ways a deposit can be released from the listing brokerage's trust account.", a: "(1) Mutual release signed by both parties. (2) Court order. (3) Successful completion of the transaction (closing)." },
  { id: 14, topic: "Buyers", q: "Walk me through the minimum down payment requirements at every price tier, starting from zero. (3-point answer)", a: "Up to $499,999: 5%. $500,000–$1,499,999: 5% on first $500K + 10% on remainder. $1.5M+: 20% on entire price. Investment property: always 20%." },
  { id: 15, topic: "Buyers", q: "If a buyer purchases a $600,000 property, can they put 5% down on the first $500K and 10% on the remaining $100K?", a: "Yes. That's exactly the tiered structure: 5% × $500K = $25K + 10% × $100K = $10K = $35K minimum down." },
  { id: 16, topic: "Buyers", q: "What's the minimum down payment required on a $1.2M home?", a: "5% on the first $500K = $25,000. Plus 10% on remaining $700K = $70,000. Total: $95,000 minimum (under $1.5M threshold so tiered structure applies)." },
  { id: 17, topic: "Buyers", q: "What is a mezzanine-style loft, and what does \"mezzanine style\" mean?", a: "A two-storey unit within a loft building, where the bedroom or secondary level is perched above the main living space, accessed by a staircase. Ceiling heights typically 14–18 feet. Very rare in the GTA." },
  { id: 18, topic: "Buyers", q: "How would you summarize a status certificate for a client?", a: "A condo's health report — a document showing the building's financial health, rules, restrictions, pending lawsuits, special assessments, reserve fund, and any planned major repairs. The buyer's lawyer reviews it before closing to flag red flags." },
  { id: 19, topic: "Buyers", q: "Name at least three notable items to look for when reviewing a status certificate.", a: "(1) Reserve fund adequacy — is it healthy or low? (2) Pending or planned special assessments. (3) Pending litigation against the corporation. (4) Outstanding fees on the unit. (5) Pet/rental restrictions. (6) Any major repairs planned (roof, garage, balconies)." },
  { id: 20, topic: "Buyers", q: "What is a special assessment in a condo?", a: "A lump sum charge billed to all unit owners when the reserve fund is too low to cover a major repair. Example: building needs $4M of new balconies — each owner gets a $20,000 assessment." },
  { id: 21, topic: "Buyers", q: "Walk me through the verbiage you'd use on an amendment form to reflect a price reduction.", a: "\"The buyer and seller hereby agree to amend the Agreement of Purchase and Sale dated [DATE] for the property at [ADDRESS] as follows: the purchase price shall be reduced from $[OLD] to $[NEW]. All other terms and conditions of the original Agreement shall remain in full force and effect.\" Both parties sign and date." },

  // Investors
  { id: 22, topic: "Investors", q: "What is the minimum down payment on an investment property?", a: "20% — always, regardless of price." },
  { id: 23, topic: "Investors", q: "An investor bought a property in 2018 for $300K and sold it for $550K, renting it the entire period. What amount of the sale is subject to capital gains tax?", a: "Capital gain = $550K − $300K = $250,000. Taxable portion = 50% × $250,000 = $125,000. That $125K gets added to her income that year and taxed at her marginal rate." },
  { id: 24, topic: "Investors", q: "How much does a buyer need to put down to avoid mortgage insurance?", a: "20%." },
  { id: 25, topic: "Investors", q: "What's the most commonly used mortgage insurer in Canada?", a: "CMHC — Canada Mortgage and Housing Corporation." },
  { id: 26, topic: "Investors", q: "For an investment condo in downtown Toronto, roughly how much does a buyer need to put down to break even on carrying costs?", a: "30%–40% down. Anything less and the investor is cash-flow negative — buying for appreciation, not yield." },
  { id: 27, topic: "Investors", q: "An investor asks how to use leverage to build a multi-property portfolio. Outline the strategy.", a: "(1) Buy a property with minimum down. (2) Hold while it appreciates. (3) Pull equity out via HELOC. (4) Use that equity as down payment on the next property. (5) Repeat. Risk: needs an appreciating market — stagnant markets break the cycle." },
  { id: 28, topic: "Investors", q: "Define bullish and bearish in the context of real estate markets.", a: "Bullish = expects the market to rise (optimistic). Bearish = expects the market to decline (pessimistic)." },
  { id: 29, topic: "Investors", q: "What is a HELOC, and how might an investor use one?", a: "Home Equity Line of Credit — a revolving credit line secured against equity in a property. Investors use it to access tax-free capital that can fund the down payment on the next property, accelerating portfolio growth." },
  { id: 30, topic: "Investors", q: "Is investing in a mature, established neighbourhood considered high risk or low risk?", a: "Low risk." },
  { id: 31, topic: "Investors", q: "What's the main drawback of investing in a mature, established neighbourhood?", a: "Appreciation only tracks the broader market average — limited upside. No outsized gains." },
  { id: 32, topic: "Investors", q: "What's the benefit of investing in an up-and-coming or gentrifying neighbourhood?", a: "Higher appreciation potential — properties in gentrifying neighbourhoods can outpace the broader market significantly if the area takes off." },
  { id: 33, topic: "Investors", q: "Name two drawbacks of investing in an up-and-coming or gentrifying neighbourhood.", a: "(1) Lower and less reliable rents until the area matures. (2) Area may stay stagnant for decades with no real appreciation. (3) Higher tenant risk and longer vacancies." },
  { id: 34, topic: "Investors", q: "What is a capitalization rate, and what is it used to assess?", a: "Cap rate = NOI ÷ Property Value. Used to assess return on investment relative to property price. Higher cap rate = higher risk and higher potential return. Lower cap rate = safer, more stable income." },
  { id: 35, topic: "Investors", q: "Your client emails you a single listing in North York priced 18% above asking. The North York sale-to-list ratio over the past 14 days is 102% across 67 listings. Which would you weight more — the single listing or the broader data?", a: "The broader data — 67 listings averaging 102% is a robust dataset. A single listing 18% over is an outlier and could be due to many factors (multiple offers, mispricing, exceptional condition). Always trust the larger sample." },

  // Houses
  { id: 36, topic: "Houses", q: "During a home inspection, the inspector finds knob and tube wiring. What advice do you give the client?", a: "Two options: (1) Replace the wiring — $3,000–$10,000+ depending on home size. (2) Accept extremely high insurance premiums or potential inability to insure. Recommendation: add a condition for both an electrician inspection AND insurance sign-off before going firm." },
  { id: 37, topic: "Houses", q: "What is the standard number of buyer visits in an APS, and when should the final pre-closing visit be conducted?", a: "Two visits standard. The last visit should be 3–4 business days before closing — NOT the day before — so the seller has time to address any deficiencies you find before closing." },
  { id: 38, topic: "Houses", q: "If a clause requires appliances to be in good working order, can the seller (a) refuse to close, and (b) must the seller close if appliances aren't working?", a: "(a) Yes, the seller can technically refuse to close if there's a dispute. (b) Legally yes, they must close — the clause requires appliances to be in working order. But if they refuse, the buyer's only remedy is litigation, which is expensive and slow." },
  { id: 39, topic: "Houses", q: "How would you summarize the \"representation and warranty shall survive and not merge on completion\" clause for a client?", a: "The seller's promises in the agreement (like appliances being in good working order) don't expire at closing — they carry forward and remain enforceable afterwards." },
  { id: 40, topic: "Houses", q: "Now explain the full \"shall survive and not merge\" clause to a client who is confused by the wording.", a: "Normally, contractual promises end at closing — that's called \"merger\". This clause overrides that: the promises continue. BUT in practice the buyer must prove the deficiency existed at closing, and the burden shifts to them. So while it carries forward legally, enforcement is hard and often requires litigation." },
  { id: 41, topic: "Houses", q: "Your client purchased a house and a deficiency in the stove ($500) is unresolved. The seller refuses to fix it. The lawyer advises a holdback at closing. The seller did NOT agree to it in writing. Walk through the worst-case scenario.", a: "Seller refuses to close, citing buyer's unilateral holdback as breach. Buyer is now in default — risks losing deposit. Even if buyer wins in court eventually, weeks/months of carrying costs, legal fees, and uncertainty. Holdbacks should be agreed to in writing before closing." },
  { id: 42, topic: "Houses", q: "Same scenario, but now the APS includes a clause requiring appliances in working order. Can the seller (a) refuse to close, and (b) must they legally close?", a: "(a) Practically, seller can refuse — but it would breach the APS. (b) Legally they must close. The clause supports the buyer. But again, enforcement requires litigation. Best practice: get holdback agreed in writing or seller fixes before closing." },

  // Offers
  { id: 43, topic: "Offers", q: "How would you define a lowball offer?", a: "An offer significantly below asking price — typically more than 10–15% below — designed to test the seller's flexibility or signal serious price disagreement." },
  { id: 44, topic: "Offers", q: "What are two things you'd want to share with a buyer who insists on submitting a lowball offer?", a: "(1) Sellers often refuse to even respond to lowballs — you may not get any counter at all. (2) It can sour the negotiation; the seller may dig in on price even if you come up later. (3) In competitive markets, lowballing means you're not in the running. (4) Use comparables to anchor — facts > opinions." },
  { id: 45, topic: "Offers", q: "Why should you avoid using the phrase \"bidding war\" with a client?", a: "It implies emotional, irrational competition — pushing buyers to overpay and sellers to expect unrealistic prices. It can also sound aggressive or unethical to clients." },
  { id: 46, topic: "Offers", q: "What's a more professional phrase to use instead of \"bidding war\"?", a: "\"Multiple offer situation\" or \"competitive offer scenario\" — neutral, professional, fact-based." },
  { id: 47, topic: "Offers", q: "Comparables suggest $600K is a reasonable starting price. Your client wants to offer $599,999. How do you respond?", a: "Retail pricing benefits sellers, not buyers. By offering $599,999, you appear in a lower price bucket but don't actually save money. Worse — you signal you're price-sensitive. Offer a clean, strategic number that reflects market value, like $605K or $600K — easier to negotiate from." },
  { id: 48, topic: "Offers", q: "Who benefits more from retail pricing — buyers when offering, or sellers when listing?", a: "Sellers — when pricing their home. $899,900 captures buyers searching up to $900K and appears cheaper than $900,000 in search filters. Buyers gain nothing by using retail numbers in offers." },
  { id: 49, topic: "Offers", q: "What is a preemptive (or \"bully\") offer?", a: "An offer submitted before the scheduled offer date, designed to pressure the seller into accepting before they see the full pool of competitive offers." },
  { id: 50, topic: "Offers", q: "Name four characteristics that make a bully offer effective.", a: "(1) Significantly above asking price. (2) Few or no conditions (firm or near-firm). (3) Large deposit. (4) Short irrevocable (24 hours or less). (5) Flexible/seller-friendly closing date. (6) Personal letter or rapport with seller." },
  { id: 51, topic: "Offers", q: "What does it mean to \"register\" an offer?", a: "Registering means formally notifying the listing brokerage that you intend to submit an offer (with your details and Form 801) before actually sending the document. It puts you on the official competition list." },
  { id: 52, topic: "Offers", q: "Why does a listing agent typically ask for offer registration at least an hour before submission?", a: "So all parties — including other agents and the seller — know the level of competition. Buyers' agents may want to improve their offers. The seller can prepare. Avoids surprise submissions at the last second." },

  // Co-ops & Parking
  { id: 53, topic: "Co-ops & Parking", q: "Your client sends you a listing priced 25% below market — but it's a co-op, not a condo. Name three things you'd want to explain to them.", a: "(1) You buy shares in a corporation that grant you exclusive rights to a unit — not the unit itself. (2) The board can interview and reject buyers. (3) Most banks won't lend on co-ops — DUCA Financial is a notable exception. (4) Down payment requirement is 35–50%. (5) Lower price reflects these limitations and reduced buyer pool." },
  { id: 54, topic: "Co-ops & Parking", q: "What's the typical down payment range required to purchase a co-op?", a: "35% to 50%." },
  { id: 55, topic: "Co-ops & Parking", q: "On average, how much does a parking spot rent for monthly in Toronto?", a: "$150–$200 per month." },
  { id: 56, topic: "Co-ops & Parking", q: "Roughly how much does an owned parking spot add to monthly maintenance fees?", a: "Approximately $55 per month." },
  { id: 57, topic: "Co-ops & Parking", q: "Roughly how much does an owned locker add to monthly maintenance fees?", a: "$10–$20 per month." },
  { id: 58, topic: "Co-ops & Parking", q: "Your client is considering a one-bedroom condo without parking but worries it will hurt the unit's investment potential. How do you respond?", a: "In urban Toronto especially downtown, many tenants don't own cars. The unit will still rent. However, on resale, the lack of parking can narrow the buyer pool by 20–30%. Mitigation: there's strong demand for parking rentals in the area; the next owner may rent a spot in the building if needed." },

  // Sellers
  { id: 59, topic: "Sellers", q: "Your listing is sold conditionally, but the seller wants to keep showings active. Two showings are already booked. Should you manually notify those agents, or rely on the MLS update?", a: "Yes — manually notify them. Updating MLS to \"sold conditional\" isn't enough. Professional courtesy + protects other agents' time + signals you respect their effort. They can decide whether to bring buyers anyway as backup offers." },
  { id: 60, topic: "Sellers", q: "At an open house, who's typically a better source of new business — buyers, or neighbours and residents?", a: "Neighbours/residents. Most buyers attending open houses already have agents. Neighbours and residents often become future seller leads — they're curious about prices in their building or area, and you become top-of-mind when they decide to sell." },
  { id: 61, topic: "Sellers", q: "Some top agents send postcards to a building before and after a listing. Is this a waste of money? What are your thoughts?", a: "Not at all. It builds presence — \"just listed\" and \"just sold\" postcards reinforce activity in the building. Even if 99% don't respond, the 1% that do over years compounds. It positions you as the building expert and generates seller leads." },
  { id: 62, topic: "Sellers", q: "What does it mean to \"leverage your value proposition\" and \"justify the commission gap\"?", a: "When competing on price, demonstrate the value you bring — marketing, network, track record, sale price uplift — that another agent doesn't. The argument: a slightly higher commission can yield a significantly higher sale price, more than covering the gap. Cheap agents can cost you more." },
  { id: 63, topic: "Sellers", q: "Your client owns a condo and plans to pay for their next property all-cash. The market is at a 105% sale-to-list ratio. Sell first or buy first?", a: "Sell first. In a 105% market, condos sell fast — they have liquidity. Cash buyer = no financing risk on the buy side, so they can buy whenever the right property comes up. Selling first locks in proceeds; not having to bridge or rush is the win." },
  { id: 64, topic: "Sellers", q: "Another client wants to sell their studio and upgrade to a larger unit in the same 105% market. What do you recommend?", a: "Buy first. In a 105% market, larger units are scarce and competitive. If you sell first, you may not find your upgrade in time. Get the upgrade locked in, then list the studio — it'll sell fast in this market." },

  // Pre-Construction
  { id: 65, topic: "Pre-Construction", q: "What is the primary purpose of the Tarion warranty?", a: "To protect buyers of new homes/condos against defects in workmanship, materials, and major structural issues — providing a regulated warranty backed by the province." },
  { id: 66, topic: "Pre-Construction", q: "How long are Tarion warranties, and what does each period cover?", a: "Year 1: workmanship, materials, Ontario Building Code violations. Year 2: water penetration, electrical/plumbing/heating systems, exterior cladding. Year 7: major structural defects (load-bearing components)." },
  { id: 67, topic: "Pre-Construction", q: "How would you explain the assignment of a pre-construction condo to a client?", a: "An assignment is when the original buyer (assignor) sells their right to purchase under the APS to a new buyer (assignee) before the building is registered. The assignee takes over the contract — closes with the builder, takes title, etc. Assignor avoids interim occupancy and carrying costs." },
  { id: 68, topic: "Pre-Construction", q: "You've been working with a client for three months. They tell you they're interested in a new development — but you discover they walked into the sales office on their own and registered themselves. How does this likely affect you as their agent?", a: "Likely badly — most builders only pay agent commission if the agent registered the buyer first. By registering themselves, the buyer may have cut you out of the commission entirely. Some builders allow retroactive agent registration but it varies. Have an honest conversation with the buyer and contact the developer immediately." },
  { id: 69, topic: "Pre-Construction", q: "In the context of a pre-construction assignment, what are typical closing costs?", a: "On an assignment, the assignee avoids land transfer tax (paid at registration only). They typically pay: builder's assignment fee (~$5,000), legal fees, HST adjustments, development levies, and the usual pre-construction adjustments at final closing. The assignor pays capital gains on the profit." },
  { id: 70, topic: "Pre-Construction", q: "Describe the pre-construction occupancy period.", a: "The phase between move-in and final registration of the condominium. Buyer moves in but doesn't legally own the unit yet — they pay interim occupancy fees (estimated mortgage interest + property tax + maintenance) instead of mortgage payments. Typically 3–6 months." },
  { id: 71, topic: "Pre-Construction", q: "What is the interim occupancy fee?", a: "Monthly fee paid by a pre-con buyer during the occupancy phase (before legal registration). Covers estimated mortgage interest, property tax, and maintenance fees — but does NOT build equity. Often called \"phantom rent\" by buyers." },

  // Multiple Rep / Commission
  { id: 72, topic: "Multiple Rep", q: "You've listed a property with an offer date expecting 5–8 offers. An unrepresented buyer asks you to submit an offer for them — IF you reduce your buyer-side commission by 1%. You agree, the seller agrees, and now you represent both sides. What steps do you take to ensure TRESA compliance?", a: "(1) Disclose multiple representation in writing to BOTH parties — explain limitations, get informed written consent. (2) Disclose the commission change to all other registered buyers' agents (not necessarily the exact %, but the structure). (3) Modify the listing agreement to reflect new commission. (4) Document everything thoroughly. (5) Treat both clients with full transparency — no strategic advantage to either." },
  { id: 73, topic: "Multiple Rep", q: "In that same scenario, do you need to disclose the exact commission reduction to the other buyer agents? And by phone or by email?", a: "Yes — disclose. In writing (email) preferred for documentation. The exact amount must be disclosed because other buyers' agents need to know if there's a commission disparity that could affect their representation strategy. Verbal followed by written confirmation is fine. Transparency = TRESA compliance." },
];

// ============================================================
//  ACCENT SYSTEM
// ============================================================

const ACCENT: Record<AccentKey, { soft: string; mid: string; strong: string; text: string; ring: string }> = {
  blue:   { soft: "#EFF6FF", mid: "#BFDBFE", strong: "#0071E3", text: "#0040DD", ring: "0, 113, 227" },
  orange: { soft: "#FFF7ED", mid: "#FED7AA", strong: "#FF9500", text: "#C2410C", ring: "255, 149, 0" },
  purple: { soft: "#F5F3FF", mid: "#DDD6FE", strong: "#5E5CE6", text: "#4338CA", ring: "94, 92, 230" },
  green:  { soft: "#ECFDF5", mid: "#A7F3D0", strong: "#34C759", text: "#047857", ring: "52, 199, 89" },
  pink:   { soft: "#FDF2F8", mid: "#FBCFE8", strong: "#FF2D55", text: "#9F1239", ring: "255, 45, 85" },
  teal:   { soft: "#F0FDFA", mid: "#99F6E4", strong: "#00C7BE", text: "#0F766E", ring: "0, 199, 190" },
};

const STATUS_META: Record<Exclude<Status, "not_studied">, { label: string; color: string; bg: string; text: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  review:      { label: "Needs Review",  color: "#FF9500", bg: "#FFF7ED", text: "#C2410C", icon: Flame },
  comfortable: { label: "Comfortable",   color: "#0071E3", bg: "#EFF6FF", text: "#0040DD", icon: CircleDot },
  mastered:    { label: "Mastered",      color: "#34C759", bg: "#ECFDF5", text: "#047857", icon: Check },
};

// ============================================================
//  FLATTEN
// ============================================================

const WORKSHEET_CARDS: Card[] = WORKSHEET_SECTIONS.flatMap((s) =>
  s.cards.map((c) => ({
    ...c,
    sectionId: s.id,
    sectionTitle: s.title,
    sectionAccent: s.accent,
    source: "worksheet" as const,
  }))
);

const INTERVIEW_CARDS: Card[] = INTERVIEW_QUESTIONS.map((m) => ({
  id: 1000 + m.id,
  q: m.q,
  a: m.a,
  sectionId: "interview",
  sectionTitle: "Highly Possible",
  sectionAccent: "pink" as const,
  source: "interview" as const,
  topic: m.topic,
}));

const ALL_CARDS: Card[] = [...WORKSHEET_CARDS, ...INTERVIEW_CARDS];

const INTERVIEW_TOPICS = Array.from(
  INTERVIEW_CARDS.reduce((acc, c) => {
    const t = c.topic!;
    if (!acc.has(t)) acc.set(t, []);
    acc.get(t)!.push(c);
    return acc;
  }, new Map<string, Card[]>())
).map(([topic, cards]) => ({ topic, cards }));

// ============================================================
//  PROFILES + STORAGE
// ============================================================

type ProfileData = {
  id: string;
  name: string;
  emoji: string;
  createdAt: number;
  status: Record<string, Status>;
  bookmarks: Record<string, boolean>;
};

type AppData = {
  version: number;
  activeProfileId: string;
  profiles: Record<string, ProfileData>;
};

const STORAGE_KEY = "studystudio_v3";
const LEGACY_V2_KEY = "studio_state_v2";
const LEGACY_V1_KEY = "studio_progress_v1";

const PROFILE_EMOJIS = ["🎯", "🚀", "📚", "✨", "🎓", "⭐", "💎", "🔥", "🌱", "🏡", "🗝️", "📈"];

function genId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function newProfile(name: string, emoji: string = "🎯"): ProfileData {
  return {
    id: genId(),
    name,
    emoji,
    createdAt: Date.now(),
    status: {},
    bookmarks: {},
  };
}

function loadAppData(): AppData {
  if (typeof window === "undefined") {
    const p = newProfile("Me", "🎯");
    return { version: 3, activeProfileId: p.id, profiles: { [p.id]: p } };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      if (parsed.version === 3 && parsed.profiles && parsed.activeProfileId) {
        return parsed;
      }
    }

    // migrate from v2
    const v2 = localStorage.getItem(LEGACY_V2_KEY);
    if (v2) {
      const old = JSON.parse(v2);
      const p = newProfile("Me", "🎯");
      p.status = old.status || {};
      p.bookmarks = old.bookmarks || {};
      const data: AppData = { version: 3, activeProfileId: p.id, profiles: { [p.id]: p } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }

    // migrate from v1
    const v1 = localStorage.getItem(LEGACY_V1_KEY);
    if (v1) {
      const old = JSON.parse(v1) as Record<string, "known" | "review">;
      const p = newProfile("Me", "🎯");
      Object.entries(old).forEach(([id, s]) => {
        p.status[id] = s === "known" ? "mastered" : "review";
      });
      const data: AppData = { version: 3, activeProfileId: p.id, profiles: { [p.id]: p } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
  } catch {}

  // first-time install — create default profile
  const p = newProfile("Me", "🎯");
  return { version: 3, activeProfileId: p.id, profiles: { [p.id]: p } };
}

function saveAppData(data: AppData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

// ============================================================
//  HOOKS
// ============================================================

function useAppState() {
  const [data, setData] = useState<AppData>({ version: 3, activeProfileId: "", profiles: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadAppData());
    setHydrated(true);
  }, []);

  const profile = data.profiles[data.activeProfileId];

  const setStatus = useCallback((cardId: number, status: Status | null) => {
    setData((prev) => {
      const p = prev.profiles[prev.activeProfileId];
      if (!p) return prev;
      const newStatus = { ...p.status };
      if (status === null || status === "not_studied") {
        delete newStatus[String(cardId)];
      } else {
        newStatus[String(cardId)] = status;
      }
      const next = {
        ...prev,
        profiles: {
          ...prev.profiles,
          [p.id]: { ...p, status: newStatus },
        },
      };
      saveAppData(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((cardId: number) => {
    setData((prev) => {
      const p = prev.profiles[prev.activeProfileId];
      if (!p) return prev;
      const newBookmarks = { ...p.bookmarks };
      const k = String(cardId);
      if (newBookmarks[k]) delete newBookmarks[k];
      else newBookmarks[k] = true;
      const next = {
        ...prev,
        profiles: {
          ...prev.profiles,
          [p.id]: { ...p, bookmarks: newBookmarks },
        },
      };
      saveAppData(next);
      return next;
    });
  }, []);

  const switchProfile = useCallback((id: string) => {
    setData((prev) => {
      if (!prev.profiles[id]) return prev;
      const next = { ...prev, activeProfileId: id };
      saveAppData(next);
      return next;
    });
  }, []);

  const createProfile = useCallback((name: string, emoji: string) => {
    const p = newProfile(name, emoji);
    setData((prev) => {
      const next = {
        ...prev,
        activeProfileId: p.id,
        profiles: { ...prev.profiles, [p.id]: p },
      };
      saveAppData(next);
      return next;
    });
    return p.id;
  }, []);

  const renameProfile = useCallback((id: string, name: string, emoji: string) => {
    setData((prev) => {
      const p = prev.profiles[id];
      if (!p) return prev;
      const next = {
        ...prev,
        profiles: { ...prev.profiles, [id]: { ...p, name, emoji } },
      };
      saveAppData(next);
      return next;
    });
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setData((prev) => {
      const profileIds = Object.keys(prev.profiles);
      if (profileIds.length <= 1) {
        alert("You need at least one profile.");
        return prev;
      }
      const remaining = { ...prev.profiles };
      delete remaining[id];
      const newActive = prev.activeProfileId === id ? Object.keys(remaining)[0] : prev.activeProfileId;
      const next = { ...prev, activeProfileId: newActive, profiles: remaining };
      saveAppData(next);
      return next;
    });
  }, []);

  const resetCurrent = useCallback(() => {
    if (!confirm("Reset progress for this profile? Bookmarks will also be cleared.")) return;
    setData((prev) => {
      const p = prev.profiles[prev.activeProfileId];
      if (!p) return prev;
      const next = {
        ...prev,
        profiles: {
          ...prev.profiles,
          [p.id]: { ...p, status: {}, bookmarks: {} },
        },
      };
      saveAppData(next);
      return next;
    });
  }, []);

  return {
    data,
    profile,
    profiles: Object.values(data.profiles).sort((a, b) => a.createdAt - b.createdAt),
    hydrated,
    setStatus,
    toggleBookmark,
    switchProfile,
    createProfile,
    renameProfile,
    deleteProfile,
    resetCurrent,
  };
}

function useKeyboard(handlers: Record<string, () => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA";
      const cmd = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
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
}

// ============================================================
//  PRIMITIVES
// ============================================================

function ProgressRing({ value, size = 36, stroke = 3, color = "#0071E3" }: { value: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(0,0,0,0.08)" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round"
        strokeDasharray={c}
        initial={false}
        animate={{ strokeDashoffset: c - (value / 100) * c }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </svg>
  );
}

function StatusDot({ status, size = 8 }: { status?: Status; size?: number }) {
  const color =
    status === "mastered" ? "#34C759" :
    status === "comfortable" ? "#0071E3" :
    status === "review" ? "#FF9500" :
    "transparent";
  const border = status && status !== "not_studied" ? "transparent" : "rgba(0,0,0,0.28)";
  return (
    <span
      style={{
        display: "inline-block", width: size, height: size, borderRadius: "50%",
        background: color, border: `1px solid ${border}`, flexShrink: 0,
      }}
    />
  );
}

// ============================================================
//  REAL-ESTATE LOGO  (custom SVG: stylized house key)
// ============================================================

function StudioLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 32 32" fill="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1D1D1F" />
          <stop offset="1" stopColor="#3A3A3C" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
      {/* house roof + body */}
      <path
        d="M9 16.4 L16 11 L23 16.4 V22.4 C23 23 22.6 23.4 22 23.4 H10 C9.4 23.4 9 23 9 22.4 Z"
        fill="white" opacity="0.96"
      />
      {/* door cutout */}
      <rect x="14.6" y="18.5" width="2.8" height="4.9" rx="0.5" fill="url(#logo-grad)" />
      {/* small window dot */}
      <circle cx="11.5" cy="18.6" r="0.7" fill="url(#logo-grad)" opacity="0.85" />
    </svg>
  );
}

// ============================================================
//  PROFILE PICKER + MANAGEMENT
// ============================================================

function ProfileSwitcher({
  profiles, active, onSwitch, onOpenManager,
}: {
  profiles: ProfileData[];
  active: ProfileData;
  onSwitch: (id: string) => void;
  onOpenManager: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
        style={{ background: open ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.025)", border: "0.5px solid rgba(0,0,0,0.06)" }}
      >
        <span className="text-[16px] flex-shrink-0">{active.emoji}</span>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "#86868B" }}>Profile</div>
          <div className="text-[13px] truncate" style={{ fontWeight: 500, color: "#1D1D1F" }}>{active.name}</div>
        </div>
        <ChevronDown size={13} style={{ color: "#86868B", transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute top-[calc(100%+6px)] left-0 right-0 z-30 overflow-hidden"
            style={{
              borderRadius: 14,
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(28px) saturate(1.6)",
              WebkitBackdropFilter: "blur(28px) saturate(1.6)",
              border: "0.5px solid rgba(0,0,0,0.08)",
              boxShadow: "0 18px 40px -10px rgba(0,0,0,0.16), 0 0 0 0.5px rgba(0,0,0,0.04)",
            }}
          >
            <div className="py-1.5 max-h-[280px] overflow-y-auto">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { onSwitch(p.id); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 transition-colors"
                  style={{ background: p.id === active.id ? "rgba(0,113,227,0.08)" : "transparent" }}
                  onMouseEnter={(e) => { if (p.id !== active.id) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}
                  onMouseLeave={(e) => { if (p.id !== active.id) e.currentTarget.style.background = "transparent"; }}
                >
                  <span className="text-[15px]">{p.emoji}</span>
                  <span className="text-[13px] flex-1 text-left truncate" style={{ fontWeight: p.id === active.id ? 500 : 400 }}>{p.name}</span>
                  {p.id === active.id && <Check size={13} style={{ color: "#0071E3" }} />}
                </button>
              ))}
            </div>
            <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
              <button
                onClick={() => { onOpenManager(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 transition-colors text-[13px]"
                style={{ color: "#1D1D1F" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Users size={13} /> Manage profiles
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileManager({
  open, onClose, profiles, activeId, onCreate, onRename, onDelete, onSwitch,
}: {
  open: boolean;
  onClose: () => void;
  profiles: ProfileData[];
  activeId: string;
  onCreate: (name: string, emoji: string) => void;
  onRename: (id: string, name: string, emoji: string) => void;
  onDelete: (id: string) => void;
  onSwitch: (id: string) => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmoji, setNewEmoji] = useState("🎯");

  useEffect(() => {
    if (!open) {
      setEditing(null);
      setCreating(false);
      setNewName("");
      setNewEmoji("🎯");
    }
  }, [open]);

  const startEdit = (p: ProfileData) => {
    setEditing(p.id);
    setEditName(p.name);
    setEditEmoji(p.emoji);
  };

  const saveEdit = () => {
    if (editing && editName.trim()) {
      onRename(editing, editName.trim(), editEmoji);
      setEditing(null);
    }
  };

  const submitCreate = () => {
    if (newName.trim()) {
      onCreate(newName.trim(), newEmoji);
      setCreating(false);
      setNewName("");
      setNewEmoji("🎯");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.18)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 8, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 8, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden"
            style={{
              borderRadius: 22, background: "#fff",
              border: "0.5px solid rgba(0,0,0,0.08)",
              boxShadow: "0 30px 70px -15px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.04)",
            }}
          >
            <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              <div>
                <div className="text-[17px]" style={{ fontWeight: 600 }}>Profiles</div>
                <div className="text-[12px] mt-0.5" style={{ color: "#86868B" }}>Each profile keeps its own progress.</div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: "#86868B" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <X size={16} />
              </button>
            </div>

            <div className="px-3 py-3 max-h-[60vh] overflow-y-auto">
              {profiles.map((p) => {
                const isEditing = editing === p.id;
                const masteredCount = ALL_CARDS.filter((c) => p.status[String(c.id)] === "mastered").length;

                if (isEditing) {
                  return (
                    <div key={p.id} className="px-3 py-3 rounded-xl mb-1.5" style={{ background: "rgba(0,113,227,0.06)", border: "0.5px solid rgba(0,113,227,0.2)" }}>
                      <div className="flex gap-2 mb-2">
                        <select value={editEmoji} onChange={(e) => setEditEmoji(e.target.value)}
                          className="text-[16px] px-2 py-1.5 rounded-lg outline-none cursor-pointer"
                          style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)" }}>
                          {PROFILE_EMOJIS.map((e) => <option key={e} value={e}>{e}</option>)}
                        </select>
                        <input
                          value={editName} onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditing(null); }}
                          maxLength={24}
                          className="flex-1 px-3 py-1.5 rounded-lg text-[13px] outline-none"
                          style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)" }}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="flex-1 px-3 py-1.5 rounded-lg text-[12.5px]"
                          style={{ background: "#0071E3", color: "#fff", fontWeight: 500 }}>Save</button>
                        <button onClick={() => setEditing(null)} className="px-3 py-1.5 rounded-lg text-[12.5px]"
                          style={{ background: "rgba(0,0,0,0.05)", color: "#1D1D1F" }}>Cancel</button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-colors"
                    style={{ background: p.id === activeId ? "rgba(0,113,227,0.06)" : "transparent" }}
                    onMouseEnter={(e) => { if (p.id !== activeId) e.currentTarget.style.background = "rgba(0,0,0,0.03)"; }}
                    onMouseLeave={(e) => { if (p.id !== activeId) e.currentTarget.style.background = "transparent"; }}
                  >
                    <button onClick={() => onSwitch(p.id)} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                      <span className="text-[20px]">{p.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] truncate flex items-center gap-2" style={{ fontWeight: 500 }}>
                          {p.name}
                          {p.id === activeId && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: "#0071E3", color: "#fff" }}>active</span>
                          )}
                        </div>
                        <div className="text-[11.5px]" style={{ color: "#86868B" }}>
                          {masteredCount} mastered
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg" title="Rename"
                        style={{ color: "#86868B" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#1D1D1F"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#86868B"; }}>
                        <Edit2 size={13} />
                      </button>
                      {profiles.length > 1 && (
                        <button onClick={() => { if (confirm(`Delete "${p.name}" and all their progress?`)) onDelete(p.id); }} className="p-1.5 rounded-lg" title="Delete"
                          style={{ color: "#86868B" }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,69,58,0.1)"; e.currentTarget.style.color = "#FF453A"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#86868B"; }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {creating ? (
                <div className="px-3 py-3 rounded-xl mt-2" style={{ background: "rgba(52,199,89,0.06)", border: "0.5px solid rgba(52,199,89,0.2)" }}>
                  <div className="text-[11px] uppercase tracking-[0.14em] mb-2" style={{ color: "#047857", fontWeight: 500 }}>New profile</div>
                  <div className="flex gap-2 mb-2">
                    <select value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)}
                      className="text-[16px] px-2 py-1.5 rounded-lg outline-none cursor-pointer"
                      style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)" }}>
                      {PROFILE_EMOJIS.map((e) => <option key={e} value={e}>{e}</option>)}
                    </select>
                    <input
                      value={newName} onChange={(e) => setNewName(e.target.value)}
                      autoFocus placeholder="Name"
                      onKeyDown={(e) => { if (e.key === "Enter") submitCreate(); if (e.key === "Escape") setCreating(false); }}
                      maxLength={24}
                      className="flex-1 px-3 py-1.5 rounded-lg text-[13px] outline-none"
                      style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)" }}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={submitCreate} disabled={!newName.trim()} className="flex-1 px-3 py-1.5 rounded-lg text-[12.5px] disabled:opacity-40"
                      style={{ background: "#34C759", color: "#fff", fontWeight: 500 }}>Create</button>
                    <button onClick={() => setCreating(false)} className="px-3 py-1.5 rounded-lg text-[12.5px]"
                      style={{ background: "rgba(0,0,0,0.05)", color: "#1D1D1F" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setCreating(true)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl mt-2 transition-colors text-[13px]"
                  style={{ color: "#0071E3", border: "0.5px dashed rgba(0,113,227,0.3)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,113,227,0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <Plus size={14} /> Add profile
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
//  COMMAND PALETTE
// ============================================================

function CommandPalette({ open, onClose, onJump }: { open: boolean; onClose: () => void; onJump: (card: Card) => void }) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setQ(""); setActive(0); setTimeout(() => inputRef.current?.focus(), 60); }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return ALL_CARDS.slice(0, 8);
    const term = q.toLowerCase();
    return ALL_CARDS.filter((c) =>
      c.q.toLowerCase().includes(term) || c.a.toLowerCase().includes(term) ||
      c.sectionTitle.toLowerCase().includes(term) || (c.topic ?? "").toLowerCase().includes(term)
    ).slice(0, 14);
  }, [q]);

  useEffect(() => setActive(0), [q]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-start justify-center px-4"
          style={{ paddingTop: "13vh", background: "rgba(0,0,0,0.16)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -10, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -6, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden"
            style={{
              borderRadius: 18,
              background: "rgba(255,255,255,0.86)",
              backdropFilter: "blur(40px) saturate(1.6)", WebkitBackdropFilter: "blur(40px) saturate(1.6)",
              border: "0.5px solid rgba(0,0,0,0.08)",
              boxShadow: "0 24px 60px -12px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              <Search size={17} style={{ color: "#86868B" }} />
              <input
                ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  else if (e.key === "Enter" && results[active]) { onJump(results[active]); }
                  else if (e.key === "Escape") { onClose(); }
                }}
                placeholder="Search every question and answer…"
                className="flex-1 bg-transparent outline-none text-[15px]"
                style={{ color: "#1D1D1F" }}
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: "rgba(0,0,0,0.06)", color: "#86868B" }}>esc</kbd>
            </div>
            <div className="max-h-[52vh] overflow-y-auto py-1">
              {results.length === 0 ? (
                <div className="px-5 py-12 text-center text-sm" style={{ color: "#86868B" }}>No matches found.</div>
              ) : (
                results.map((r, i) => {
                  const a = ACCENT[r.sectionAccent];
                  return (
                    <button
                      key={r.id} onMouseEnter={() => setActive(i)} onClick={() => onJump(r)}
                      className="w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors"
                      style={{ background: i === active ? "rgba(0,0,0,0.04)" : "transparent" }}
                    >
                      <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ background: a.strong }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: a.text }}>
                            {r.source === "interview" ? r.topic : r.sectionTitle}
                          </span>
                          <span style={{ color: "rgba(0,0,0,0.18)" }}>·</span>
                          <span className="text-[10px]" style={{ color: "#86868B" }}>{r.source === "interview" ? `H${r.id - 1000}` : `Q${r.id}`}</span>
                        </div>
                        <div className="text-[13.5px] leading-snug truncate" style={{ color: "#1D1D1F" }}>{r.q}</div>
                      </div>
                      {i === active && <ChevronRight size={14} style={{ color: "#86868B" }} />}
                    </button>
                  );
                })
              )}
            </div>
            <div className="px-5 py-2 flex items-center justify-between text-[11px]" style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)", color: "#86868B", background: "rgba(0,0,0,0.02)" }}>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.05)" }}>↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.05)" }}>↵</kbd> jump</span>
              </div>
              <span>{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
//  STATUS PICKER — improved Not Studied contrast
// ============================================================

function StatusPicker({ value, onChange, compact = false }: { value: Status; onChange: (s: Status) => void; compact?: boolean }) {
  const items: { value: Status; label: string; color: string; activeText: string }[] = [
    { value: "not_studied", label: "Not studied", color: "#86868B", activeText: "#fff" },
    { value: "review",      label: "Review",       color: "#FF9500", activeText: "#fff" },
    { value: "comfortable", label: "Comfortable",  color: "#0071E3", activeText: "#fff" },
    { value: "mastered",    label: "Mastered",     color: "#34C759", activeText: "#fff" },
  ];

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full" style={{ background: "rgba(0,0,0,0.06)", border: "0.5px solid rgba(0,0,0,0.04)" }}>
      {items.map((it) => {
        const active = value === it.value;
        return (
          <button
            key={it.value} onClick={() => onChange(it.value)}
            className={`relative ${compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-[12px]"} rounded-full transition-all`}
            style={{
              color: active ? it.activeText : "#1D1D1F",
              fontWeight: active ? 500 : 400,
            }}
          >
            {active && (
              <motion.div
                layoutId="status-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: it.color }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <StatusDot status={it.value === "not_studied" ? undefined : it.value} size={compact ? 6 : 7} />
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
//  STUDY CARD
// ============================================================

function StudyCard({
  card, status, bookmarked, onSetStatus, onToggleBookmark,
}: {
  card: Card; status: Status; bookmarked: boolean;
  onSetStatus: (s: Status) => void; onToggleBookmark: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const a = ACCENT[card.sectionAccent];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 26 }}
      className="group relative overflow-hidden"
      style={{
        borderRadius: 16, background: "#fff",
        border: "0.5px solid rgba(0,0,0,0.06)",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03), 0 0 0 0.5px rgba(0,0,0,0.02)",
      }}
      id={`card-${card.id}`}
    >
      <div className="absolute left-0 top-0 bottom-0" style={{
        width: 3,
        background:
          status === "mastered" ? "#34C759" :
          status === "comfortable" ? "#0071E3" :
          status === "review" ? "#FF9500" : "transparent",
        transition: "background 200ms ease",
      }} />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md"
              style={{ background: a.soft, color: a.text }}>
              {card.source === "interview" ? `H${card.id - 1000}` : `Q${card.id}`}
            </span>
            {card.topic && <span className="text-[11px] font-medium" style={{ color: "#86868B" }}>{card.topic}</span>}
            {status !== "not_studied" && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium"
                style={{ background: STATUS_META[status].bg, color: STATUS_META[status].text }}>
                <StatusDot status={status} size={6} />
                {STATUS_META[status].label}
              </span>
            )}
          </div>
          <button
            onClick={onToggleBookmark}
            className="flex-shrink-0 p-1.5 rounded-lg transition-all"
            style={{ opacity: bookmarked ? 1 : 0, color: bookmarked ? "#FF9500" : "#86868B" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = bookmarked ? "1" : "0")}
            title="Bookmark"
          >
            <Bookmark size={15} fill={bookmarked ? "#FF9500" : "none"} />
          </button>
        </div>

        <h3 className="text-[16.5px] sm:text-[17.5px] leading-[1.45] mb-4" style={{ color: "#1D1D1F", fontWeight: 500 }}>
          {card.q}
        </h3>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => setRevealed((r) => !r)}
            className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{ color: revealed ? a.text : "#86868B" }}
          >
            {revealed ? <EyeOff size={13} /> : <Eye size={13} />}
            {revealed ? "Hide answer" : "Reveal answer"}
          </button>
          <StatusPicker value={status} onChange={onSetStatus} compact />
        </div>

        <AnimatePresence initial={false}>
          {revealed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ height: { type: "spring", stiffness: 200, damping: 28 }, opacity: { duration: 0.2 } }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 text-[14.5px] leading-[1.6]" style={{ borderTop: `0.5px solid ${a.mid}80`, color: "#3a3a3c" }}>
                {card.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ============================================================
//  READ MODE
// ============================================================

function ReadMode({
  activeSection, profile, setStatus, toggleBookmark,
}: {
  activeSection: string;
  profile: ProfileData;
  setStatus: (id: number, s: Status) => void;
  toggleBookmark: (id: number) => void;
}) {
  const section = WORKSHEET_SECTIONS.find((s) => s.id === activeSection)!;
  const Icon = section.icon;
  const a = ACCENT[section.accent];

  const stats = useMemo(() => {
    const counts = { mastered: 0, comfortable: 0, review: 0, not_studied: 0 };
    section.cards.forEach((c) => {
      const s = (profile.status[String(c.id)] ?? "not_studied") as Status;
      counts[s]++;
    });
    return { ...counts, total: section.cards.length };
  }, [section, profile.status]);

  const masteredPct = (stats.mastered / stats.total) * 100;
  const studiedPct = ((stats.mastered + stats.comfortable + stats.review) / stats.total) * 100;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-14">
      <motion.div
        key={section.id}
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: a.soft }}>
              <Icon size={18} strokeWidth={2} />
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: a.text }}>
              Section {WORKSHEET_SECTIONS.findIndex((s) => s.id === section.id) + 1} of {WORKSHEET_SECTIONS.length}
            </div>
          </div>

          <h1 className="text-[40px] sm:text-[48px] leading-[1.05] mb-3" style={{ letterSpacing: "-0.025em", fontWeight: 700, color: "#1D1D1F" }}>
            {section.title}
          </h1>
          <p className="text-[16px] leading-relaxed" style={{ color: "#86868B" }}>{section.subtitle}</p>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="relative w-36 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                <motion.div className="absolute left-0 top-0 bottom-0 rounded-full" style={{ background: "rgba(0,0,0,0.18)" }}
                  initial={false} animate={{ width: `${studiedPct}%` }} transition={{ type: "spring", stiffness: 100, damping: 22 }} />
                <motion.div className="absolute left-0 top-0 bottom-0 rounded-full" style={{ background: "#34C759" }}
                  initial={false} animate={{ width: `${masteredPct}%` }} transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.05 }} />
              </div>
              <span className="text-[13px] tabular-nums" style={{ color: "#86868B" }}>{stats.mastered} / {stats.total} mastered</span>
            </div>
            {stats.review > 0 && (
              <span className="text-[12.5px] flex items-center gap-1.5" style={{ color: "#FF9500" }}>
                <Flame size={12} /> {stats.review} to review
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {section.cards.map((c) => {
            const card = WORKSHEET_CARDS.find((wc) => wc.id === c.id)!;
            const status = (profile.status[String(c.id)] ?? "not_studied") as Status;
            return (
              <StudyCard key={c.id} card={card} status={status}
                bookmarked={!!profile.bookmarks[String(c.id)]}
                onSetStatus={(s) => setStatus(c.id, s)}
                onToggleBookmark={() => toggleBookmark(c.id)} />
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
//  PRACTICE MODE — "Highly Possible Questions"
// ============================================================

function PracticeMode({
  profile, setStatus, toggleBookmark,
}: {
  profile: ProfileData;
  setStatus: (id: number, s: Status) => void;
  toggleBookmark: (id: number) => void;
}) {
  const [filter, setFilter] = useState<"all" | "review" | "not_studied" | "bookmarked">("all");
  const [activeTopic, setActiveTopic] = useState<string>("__all__");

  const topicStats = useMemo(() => {
    return INTERVIEW_TOPICS.map((t) => {
      const total = t.cards.length;
      const mastered = t.cards.filter((c) => profile.status[String(c.id)] === "mastered").length;
      return { topic: t.topic, total, mastered };
    });
  }, [profile.status]);

  const filteredCards = useMemo(() => {
    let pool = activeTopic === "__all__" ? INTERVIEW_CARDS : INTERVIEW_CARDS.filter((c) => c.topic === activeTopic);
    if (filter === "review") pool = pool.filter((c) => profile.status[String(c.id)] === "review");
    if (filter === "not_studied") pool = pool.filter((c) => !profile.status[String(c.id)] || profile.status[String(c.id)] === "not_studied");
    if (filter === "bookmarked") pool = pool.filter((c) => profile.bookmarks[String(c.id)]);
    return pool;
  }, [activeTopic, filter, profile.status, profile.bookmarks]);

  const totalMastered = INTERVIEW_CARDS.filter((c) => profile.status[String(c.id)] === "mastered").length;
  const overallPct = (totalMastered / INTERVIEW_CARDS.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: ACCENT.pink.soft }}>
              <Target size={18} style={{ color: ACCENT.pink.strong }} strokeWidth={2} />
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: ACCENT.pink.text }}>
              {INTERVIEW_CARDS.length} questions · {INTERVIEW_TOPICS.length} topics
            </div>
          </div>
          <h1 className="text-[40px] sm:text-[48px] leading-[1.05] mb-3" style={{ letterSpacing: "-0.025em", fontWeight: 700 }}>
            Highly Possible Questions
          </h1>
          <p className="text-[16px] leading-relaxed mb-8" style={{ color: "#86868B" }}>
            Real broker interview questions. Drill these until clean.
          </p>

          <div className="rounded-2xl p-5 sm:p-6 flex items-center gap-5"
            style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <ProgressRing value={overallPct} size={56} stroke={4} color={ACCENT.pink.strong} />
            <div className="flex-1 min-w-0">
              <div className="text-[14px]" style={{ color: "#86868B" }}>Overall mastery</div>
              <div className="text-[28px] tabular-nums leading-tight" style={{ fontWeight: 600 }}>{Math.round(overallPct)}%</div>
              <div className="text-[12px] tabular-nums" style={{ color: "#86868B" }}>{totalMastered} of {INTERVIEW_CARDS.length} mastered</div>
            </div>
            <div className="hidden sm:grid grid-cols-3 gap-3 text-[12px]">
              <Stat label="Mastered" value={totalMastered} color="#34C759" />
              <Stat label="Comfortable" value={INTERVIEW_CARDS.filter((c) => profile.status[String(c.id)] === "comfortable").length} color="#0071E3" />
              <Stat label="Review" value={INTERVIEW_CARDS.filter((c) => profile.status[String(c.id)] === "review").length} color="#FF9500" />
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="text-[11px] font-medium uppercase tracking-[0.14em] mb-3" style={{ color: "#86868B" }}>Topics</div>
          <div className="flex flex-wrap gap-2">
            <TopicPill active={activeTopic === "__all__"} onClick={() => setActiveTopic("__all__")} label="All topics" count={INTERVIEW_CARDS.length} mastered={totalMastered} />
            {topicStats.map((t) => (
              <TopicPill key={t.topic} active={activeTopic === t.topic} onClick={() => setActiveTopic(t.topic)} label={t.topic} count={t.total} mastered={t.mastered} />
            ))}
          </div>
        </div>

        <div className="mb-5 flex items-center gap-2 flex-wrap">
          <Filter size={13} style={{ color: "#86868B" }} />
          {([
            { v: "all", label: "All" },
            { v: "review", label: "Need review" },
            { v: "not_studied", label: "Not studied" },
            { v: "bookmarked", label: "Bookmarked" },
          ] as const).map((f) => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              className="px-3 py-1.5 rounded-full text-[12.5px] transition-all"
              style={{
                background: filter === f.v ? "#1D1D1F" : "rgba(0,0,0,0.04)",
                color: filter === f.v ? "#fff" : "#1D1D1F",
                fontWeight: filter === f.v ? 500 : 400,
              }}>
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-[12px]" style={{ color: "#86868B" }}>
            {filteredCards.length} {filteredCards.length === 1 ? "question" : "questions"}
          </span>
        </div>

        {filteredCards.length === 0 ? (
          <EmptyState message="Nothing here. Try changing the filter." />
        ) : (
          <div className="space-y-3">
            {filteredCards.map((c) => (
              <StudyCard key={c.id} card={c}
                status={(profile.status[String(c.id)] ?? "not_studied") as Status}
                bookmarked={!!profile.bookmarks[String(c.id)]}
                onSetStatus={(s) => setStatus(c.id, s)}
                onToggleBookmark={() => toggleBookmark(c.id)} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center min-w-0">
      <div className="text-[18px] tabular-nums leading-tight" style={{ fontWeight: 600, color }}>{value}</div>
      <div className="text-[10.5px] truncate" style={{ color: "#86868B" }}>{label}</div>
    </div>
  );
}

function TopicPill({ active, onClick, label, count, mastered }: { active: boolean; onClick: () => void; label: string; count: number; mastered: number }) {
  const pct = count > 0 ? mastered / count : 0;
  return (
    <button onClick={onClick}
      className="px-3 py-1.5 rounded-full text-[12.5px] flex items-center gap-2 transition-all"
      style={{
        background: active ? "#1D1D1F" : "#fff",
        color: active ? "#fff" : "#1D1D1F",
        border: active ? "0.5px solid #1D1D1F" : "0.5px solid rgba(0,0,0,0.08)",
        fontWeight: active ? 500 : 400,
      }}>
      <span>{label}</span>
      <span className="text-[10.5px] tabular-nums" style={{ color: active ? "rgba(255,255,255,0.6)" : "#86868B" }}>{mastered}/{count}</span>
      {pct === 1 && <Check size={11} style={{ color: "#34C759" }} />}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16 rounded-2xl" style={{ background: "rgba(0,0,0,0.02)" }}>
      <div className="text-[14px]" style={{ color: "#86868B" }}>{message}</div>
    </div>
  );
}

// ============================================================
//  FOCUS MODE
// ============================================================

function FocusMode({
  profile, setStatus, toggleBookmark,
}: {
  profile: ProfileData;
  setStatus: (id: number, s: Status) => void;
  toggleBookmark: (id: number) => void;
}) {
  const reviewCards = useMemo(() => ALL_CARDS.filter((c) => profile.status[String(c.id)] === "review"), [profile.status]);
  const bookmarked = useMemo(() => ALL_CARDS.filter((c) => profile.bookmarks[String(c.id)]), [profile.bookmarks]);
  const [tab, setTab] = useState<"review" | "bookmarks">("review");
  const cards = tab === "review" ? reviewCards : bookmarked;

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-14">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: ACCENT.orange.soft }}>
              <Sparkles size={18} style={{ color: ACCENT.orange.strong }} strokeWidth={2} />
            </div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: ACCENT.orange.text }}>Smart review</div>
          </div>
          <h1 className="text-[40px] sm:text-[48px] leading-[1.05] mb-3" style={{ letterSpacing: "-0.025em", fontWeight: 700 }}>Focus</h1>
          <p className="text-[16px] leading-relaxed mb-7" style={{ color: "#86868B" }}>Your weak areas and bookmarks, in one place.</p>

          <div className="inline-flex p-1 rounded-full" style={{ background: "rgba(0,0,0,0.04)" }}>
            <TabButton active={tab === "review"} onClick={() => setTab("review")}>
              <Flame size={13} /> Need review · {reviewCards.length}
            </TabButton>
            <TabButton active={tab === "bookmarks"} onClick={() => setTab("bookmarks")}>
              <Bookmark size={13} /> Bookmarks · {bookmarked.length}
            </TabButton>
          </div>
        </div>

        {cards.length === 0 ? (
          <EmptyState message={tab === "review" ? "No questions flagged for review. You're all caught up." : "No bookmarks yet. Tap the bookmark icon on any card."} />
        ) : (
          <div className="space-y-3">
            {cards.map((card) => (
              <StudyCard key={card.id} card={card}
                status={(profile.status[String(card.id)] ?? "not_studied") as Status}
                bookmarked={!!profile.bookmarks[String(card.id)]}
                onSetStatus={(s) => setStatus(card.id, s)}
                onToggleBookmark={() => toggleBookmark(card.id)} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="relative px-4 py-2 rounded-full text-[13px] flex items-center gap-1.5 transition-colors"
      style={{ color: active ? "#fff" : "#1D1D1F", fontWeight: active ? 500 : 400 }}>
      {active && (
        <motion.div layoutId="focus-tab" className="absolute inset-0 rounded-full"
          style={{ background: "#1D1D1F" }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }} />
      )}
      <span className="relative flex items-center gap-1.5">{children}</span>
    </button>
  );
}

// ============================================================
//  FLASHCARD MODE — improved
// ============================================================

function FlashcardMode({
  profile, setStatus,
}: {
  profile: ProfileData;
  setStatus: (id: number, s: Status) => void;
}) {
  const [scope, setScope] = useState<string>("all");

  const pool = useMemo(() => {
    if (scope === "all") return ALL_CARDS;
    if (scope === "review") return ALL_CARDS.filter((c) => profile.status[String(c.id)] === "review");
    if (scope === "not_studied") return ALL_CARDS.filter((c) => !profile.status[String(c.id)] || profile.status[String(c.id)] === "not_studied");
    if (scope === "interview") return INTERVIEW_CARDS;
    if (scope === "worksheet") return WORKSHEET_CARDS;
    if (scope.startsWith("topic:")) {
      const t = scope.slice(6);
      return INTERVIEW_CARDS.filter((c) => c.topic === t);
    }
    return ALL_CARDS.filter((c) => c.sectionId === scope);
  }, [scope, profile.status]);

  const [order, setOrder] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(pool.map((_, i) => i));
    setIdx(0);
    setFlipped(false);
  }, [scope, pool.length]);

  const card = pool[order[idx]];

  const next = useCallback(() => {
    if (pool.length === 0) return;
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i + 1) % pool.length), 100);
  }, [pool.length]);

  const prev = useCallback(() => {
    if (pool.length === 0) return;
    setFlipped(false);
    setTimeout(() => setIdx((i) => (i - 1 + pool.length) % pool.length), 100);
  }, [pool.length]);

  const shuffle = useCallback(() => {
    const o = [...order];
    for (let i = o.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [o[i], o[j]] = [o[j], o[i]];
    }
    setOrder(o);
    setIdx(0);
    setFlipped(false);
  }, [order]);

  useKeyboard({
    " ": () => setFlipped((f) => !f),
    arrowright: next,
    arrowleft: prev,
    j: () => { if (card) { setStatus(card.id, "mastered"); next(); } },
    k: () => { if (card) { setStatus(card.id, "review"); next(); } },
    s: shuffle,
  });

  if (!card) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-3xl flex items-center justify-center" style={{ background: ACCENT.green.soft }}>
          <Trophy size={26} style={{ color: ACCENT.green.strong }} />
        </div>
        <h2 className="text-[28px] mb-3" style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>Nothing to review</h2>
        <p className="text-[15px] mb-8" style={{ color: "#86868B" }}>You've cleared this set. Try a different scope.</p>
        <button onClick={() => setScope("all")}
          className="px-5 py-2.5 rounded-full text-[14px] transition-all"
          style={{ background: "#1D1D1F", color: "#fff", fontWeight: 500 }}>
          Study all cards
        </button>
      </div>
    );
  }

  const a = ACCENT[card.sectionAccent];
  const status = (profile.status[String(card.id)] ?? "not_studied") as Status;

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 sm:py-12">
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] mb-1" style={{ color: "#86868B" }}>Flashcards</div>
          <div className="text-[15px] tabular-nums" style={{ color: "#86868B" }}>
            <span style={{ color: "#1D1D1F", fontWeight: 500 }}>{idx + 1}</span>
            <span style={{ color: "rgba(0,0,0,0.18)" }} className="mx-1.5">/</span>
            <span>{pool.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={scope} onChange={(e) => setScope(e.target.value)}
            className="text-[13px] px-3 py-2 rounded-xl outline-none cursor-pointer transition-colors"
            style={{ background: "rgba(0,0,0,0.04)", border: "0.5px solid rgba(0,0,0,0.06)" }}>
            <option value="all">All cards ({ALL_CARDS.length})</option>
            <option value="review">Need review</option>
            <option value="not_studied">Not studied</option>
            <optgroup label="Highly Possible">
              <option value="interview">All ({INTERVIEW_CARDS.length})</option>
              {INTERVIEW_TOPICS.map((t) => (
                <option key={t.topic} value={`topic:${t.topic}`}>{t.topic} ({t.cards.length})</option>
              ))}
            </optgroup>
            <optgroup label="Worksheet">
              <option value="worksheet">All ({WORKSHEET_CARDS.length})</option>
              {WORKSHEET_SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.title} ({s.cards.length})</option>
              ))}
            </optgroup>
          </select>
          <button onClick={shuffle}
            className="p-2 rounded-xl transition-colors"
            style={{ background: "rgba(0,0,0,0.04)", border: "0.5px solid rgba(0,0,0,0.06)", color: "#1D1D1F" }}
            title="Shuffle (S)">
            <Shuffle size={14} />
          </button>
        </div>
      </div>

      {/* Status indicator above card if marked */}
      {status !== "not_studied" && (
        <div className="mb-4 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={{ background: STATUS_META[status].bg, color: STATUS_META[status].text }}>
            <StatusDot status={status} size={6} />
            {STATUS_META[status].label}
          </span>
        </div>
      )}

      {/* Progress dots */}
      <div className="flex gap-1 mb-8">
        {pool.slice(0, Math.min(pool.length, 60)).map((_, i) => (
          <div key={i} className="h-0.5 flex-1 rounded-full transition-all"
            style={{ background: i === idx ? a.strong : i < idx ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.08)" }} />
        ))}
      </div>

      <div style={{ perspective: 2400 }} className="mb-8">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, scale: 0.97, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className="relative w-full" style={{ height: 420 }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 110, damping: 20 }}
            className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 p-8 sm:p-12 flex flex-col cursor-pointer"
              style={{
                borderRadius: 24, backfaceVisibility: "hidden",
                background: `linear-gradient(180deg, ${a.soft} 0%, #FFFFFF 65%)`,
                border: `0.5px solid ${a.mid}80`,
                boxShadow: `0 30px 60px -20px rgba(${a.ring}, 0.18), 0 0 0 0.5px rgba(0,0,0,0.02)`,
              }}
              onClick={() => setFlipped(true)}
            >
              <div className="flex items-center justify-between mb-auto">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em]" style={{ color: a.text }}>
                  {card.source === "interview" ? card.topic : card.sectionTitle}
                </span>
                <span className="text-[11px] font-mono" style={{ color: "#86868B" }}>
                  {card.source === "interview" ? `H${card.id - 1000}` : `Q${card.id}`}
                </span>
              </div>
              <h2 className="my-auto text-[26px] sm:text-[30px] leading-[1.2]" style={{ letterSpacing: "-0.015em", fontWeight: 600, color: "#1D1D1F" }}>
                {card.q}
              </h2>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[11.5px] flex items-center gap-2" style={{ color: "#86868B" }}>
                  <kbd className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.05)", color: "#86868B" }}>tap</kbd>
                  to flip
                </span>
                <ArrowRight size={15} style={{ color: "rgba(0,0,0,0.18)" }} />
              </div>
            </div>
            <div
              className="absolute inset-0 p-8 sm:p-12 flex flex-col cursor-pointer"
              style={{
                borderRadius: 24, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
                background: "#fff",
                border: `0.5px solid ${a.mid}`,
                boxShadow: `0 30px 60px -20px rgba(${a.ring}, 0.22)`,
              }}
              onClick={() => setFlipped(false)}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em]" style={{ color: a.text }}>Answer</span>
                <span className="text-[11px] font-mono" style={{ color: "#86868B" }}>
                  {card.source === "interview" ? `H${card.id - 1000}` : `Q${card.id}`}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                <p className="text-[16.5px] sm:text-[17.5px] leading-[1.55]" style={{ color: "#1D1D1F" }}>{card.a}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-2.5 flex-wrap">
        <ControlBtn onClick={prev} title="Previous"><ArrowLeft size={15} /></ControlBtn>
        <button onClick={() => { setStatus(card.id, "review"); next(); }}
          className="px-4 py-2.5 rounded-full text-[13px] flex items-center gap-2 transition-all"
          style={{ background: ACCENT.orange.soft, color: ACCENT.orange.text, border: `0.5px solid ${ACCENT.orange.mid}`, fontWeight: 500 }}>
          <Flame size={13} /> Review <kbd className="opacity-50 text-[10px]">K</kbd>
        </button>
        <button onClick={() => { setStatus(card.id, "mastered"); next(); }}
          className="px-4 py-2.5 rounded-full text-[13px] flex items-center gap-2 transition-all"
          style={{ background: ACCENT.green.soft, color: ACCENT.green.text, border: `0.5px solid ${ACCENT.green.mid}`, fontWeight: 500 }}>
          <Check size={13} /> Mastered <kbd className="opacity-50 text-[10px]">J</kbd>
        </button>
        <ControlBtn onClick={next} title="Next"><ArrowRight size={15} /></ControlBtn>
      </div>

      <div className="mt-5 text-center text-[11.5px] flex items-center justify-center gap-4 flex-wrap" style={{ color: "#86868B" }}>
        <span><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.04)" }}>space</kbd> flip</span>
        <span><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.04)" }}>← →</kbd> nav</span>
        <span><kbd className="px-1 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.04)" }}>S</kbd> shuffle</span>
      </div>
    </div>
  );
}

function ControlBtn({ onClick, children, title }: { onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button onClick={onClick}
      className="p-2.5 rounded-full transition-all"
      style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.08)", color: "#1D1D1F" }}
      title={title}>
      {children}
    </button>
  );
}

// ============================================================
//  QUIZ MODE
// ============================================================

function QuizMode({ setStatus }: { setStatus: (id: number, s: Status) => void }) {
  const [scope, setScope] = useState<"all" | "interview" | "worksheet">("all");
  const [order, setOrder] = useState<Card[]>(() => buildQuiz("all"));
  const [idx, setIdx] = useState(0);
  const [response, setResponse] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Record<number, "right" | "wrong">>({});

  function buildQuiz(s: "all" | "interview" | "worksheet"): Card[] {
    const pool = s === "interview" ? INTERVIEW_CARDS : s === "worksheet" ? WORKSHEET_CARDS : ALL_CARDS;
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 10);
  }

  const restart = (s: typeof scope = scope) => {
    setScope(s);
    setOrder(buildQuiz(s));
    setIdx(0);
    setResponse("");
    setRevealed(false);
    setResults({});
  };

  const card = order[idx];
  const done = idx >= order.length;

  if (done) {
    const right = Object.values(results).filter((r) => r === "right").length;
    const score = Math.round((right / order.length) * 100);
    const tone =
      score >= 80 ? { color: ACCENT.green, msg: "Sharp work. You're cruising." } :
      score >= 60 ? { color: ACCENT.orange, msg: "Solid foundation — review the misses." } :
      { color: ACCENT.pink, msg: "Plenty to refine. Hit the flashcards next." };

    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${tone.color.soft}, ${tone.color.mid})` }}
        >
          <Trophy size={32} style={{ color: tone.color.strong }} />
        </motion.div>
        <div className="text-[72px] tabular-nums leading-none mb-2" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
          {score}<span className="text-[36px]" style={{ color: "#86868B" }}>%</span>
        </div>
        <p className="text-[15px] mb-2" style={{ color: "#86868B" }}>
          You got <span style={{ color: "#1D1D1F", fontWeight: 500 }}>{right}</span> out of{" "}
          <span style={{ color: "#1D1D1F", fontWeight: 500 }}>{order.length}</span> right.
        </p>
        <p className="text-[13.5px] mb-10" style={{ color: "#86868B" }}>{tone.msg}</p>
        <button onClick={() => restart()}
          className="px-5 py-2.5 rounded-full text-[14px] inline-flex items-center gap-2 transition-all"
          style={{ background: "#1D1D1F", color: "#fff", fontWeight: 500 }}>
          <RotateCcw size={13} /> New quiz
        </button>
      </div>
    );
  }

  const a = ACCENT[card.sectionAccent];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 sm:py-12">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] mb-1" style={{ color: "#86868B" }}>Quiz · 10 random</div>
          <div className="text-[15px] tabular-nums" style={{ color: "#86868B" }}>
            <span style={{ color: "#1D1D1F", fontWeight: 500 }}>{idx + 1}</span>
            <span className="mx-1.5" style={{ color: "rgba(0,0,0,0.18)" }}>/</span>
            <span>{order.length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select value={scope} onChange={(e) => restart(e.target.value as any)}
            className="text-[13px] px-3 py-2 rounded-xl outline-none cursor-pointer transition-colors"
            style={{ background: "rgba(0,0,0,0.04)", border: "0.5px solid rgba(0,0,0,0.06)" }}>
            <option value="all">All cards</option>
            <option value="interview">Highly Possible only</option>
            <option value="worksheet">Worksheet only</option>
          </select>
          <button onClick={() => restart()}
            className="text-[13px] flex items-center gap-1.5 px-2.5 py-2 transition-colors rounded-xl"
            style={{ color: "#86868B" }}>
            <RotateCcw size={12} /> Restart
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-10">
        {order.map((c, i) => {
          const result = results[c.id];
          let bg = "rgba(0,0,0,0.08)";
          if (result === "right") bg = "#34C759";
          else if (result === "wrong") bg = "#FF9500";
          else if (i === idx) bg = a.strong;
          return <div key={c.id} className="h-0.5 flex-1 rounded-full transition-all" style={{ background: bg }} />;
        })}
      </div>

      <motion.div key={card.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
        <div className="text-[11px] font-medium uppercase tracking-[0.16em] mb-2" style={{ color: a.text }}>
          {card.source === "interview" ? card.topic : card.sectionTitle}
        </div>
        <h2 className="text-[26px] sm:text-[30px] leading-[1.18] mb-7" style={{ letterSpacing: "-0.015em", fontWeight: 600, color: "#1D1D1F" }}>
          {card.q}
        </h2>

        <textarea
          value={response} onChange={(e) => setResponse(e.target.value)}
          disabled={revealed}
          placeholder="Type your answer from memory…"
          rows={4}
          className="w-full p-4 rounded-2xl outline-none resize-none text-[15px] leading-relaxed transition-all"
          style={{ background: "rgba(0,0,0,0.03)", border: "0.5px solid rgba(0,0,0,0.06)", color: "#1D1D1F" }}
        />

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 rounded-2xl" style={{ background: a.soft, border: `0.5px solid ${a.mid}80` }}>
                <div className="text-[10px] font-medium uppercase tracking-[0.16em] mb-2" style={{ color: a.text }}>Reference answer</div>
                <p className="text-[14.5px] leading-[1.6]" style={{ color: "#1D1D1F" }}>{card.a}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-between gap-3">
          {!revealed ? (
            <button onClick={() => setRevealed(true)}
              className="flex-1 py-3 rounded-full text-[14px] flex items-center justify-center gap-2 transition-all"
              style={{ background: "#1D1D1F", color: "#fff", fontWeight: 500 }}>
              <Eye size={14} /> Show reference answer
            </button>
          ) : (
            <>
              <button onClick={() => {
                setResults((r) => ({ ...r, [card.id]: "wrong" }));
                setStatus(card.id, "review");
                setIdx((i) => i + 1); setResponse(""); setRevealed(false);
              }}
                className="flex-1 py-3 rounded-full text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{ background: ACCENT.orange.soft, color: ACCENT.orange.text, border: `0.5px solid ${ACCENT.orange.mid}`, fontWeight: 500 }}>
                <X size={14} /> Missed it
              </button>
              <button onClick={() => {
                setResults((r) => ({ ...r, [card.id]: "right" }));
                setStatus(card.id, "mastered");
                setIdx((i) => i + 1); setResponse(""); setRevealed(false);
              }}
                className="flex-1 py-3 rounded-full text-[14px] flex items-center justify-center gap-2 transition-all"
                style={{ background: ACCENT.green.soft, color: ACCENT.green.text, border: `0.5px solid ${ACCENT.green.mid}`, fontWeight: 500 }}>
                <Check size={14} /> Got it right
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================
//  SIDEBAR
// ============================================================

type Mode = "read" | "practice" | "flash" | "quiz" | "focus";

function Sidebar({
  mode, setMode, activeSection, setActiveSection, profile, profiles, onSearch, onReset,
  onSwitchProfile, onOpenManager,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
  profile: ProfileData;
  profiles: ProfileData[];
  onSearch: () => void;
  onReset: () => void;
  onSwitchProfile: (id: string) => void;
  onOpenManager: () => void;
}) {
  const totalMastered = ALL_CARDS.filter((c) => profile.status[String(c.id)] === "mastered").length;
  const totalReview = ALL_CARDS.filter((c) => profile.status[String(c.id)] === "review").length;
  const overallPct = (totalMastered / ALL_CARDS.length) * 100;

  return (
    <aside className="hidden lg:flex flex-col w-[272px] flex-shrink-0 h-screen sticky top-0"
      style={{
        borderRight: "0.5px solid rgba(0,0,0,0.06)",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)",
      }}>
      <div className="px-5 py-4" style={{ borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
        <div className="flex items-center gap-2.5 mb-3">
          <StudioLogo size={28} />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] leading-tight" style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>Study Studio</div>
            <div className="text-[11px]" style={{ color: "#86868B" }}>Real estate prep</div>
          </div>
        </div>
        <ProfileSwitcher
          profiles={profiles} active={profile}
          onSwitch={onSwitchProfile} onOpenManager={onOpenManager}
        />
      </div>

      <button onClick={onSearch}
        className="mx-3 mt-3 flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all"
        style={{ background: "rgba(0,0,0,0.04)", border: "0.5px solid transparent" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }}>
        <Search size={13} style={{ color: "#86868B" }} />
        <span className="text-[13px] flex-1" style={{ color: "#86868B" }}>Search…</span>
        <kbd className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.7)", color: "#86868B" }}>⌘K</kbd>
      </button>

      <div className="px-3 mt-5">
        <div className="text-[10px] font-medium uppercase tracking-[0.14em] px-2 mb-1.5" style={{ color: "#86868B" }}>Mode</div>
        <LayoutGroup id="sidebar-modes">
          {([
            { id: "read",     label: "Sections",            icon: BookOpen },
            { id: "practice", label: "Highly Possible",     icon: Target,        badge: INTERVIEW_CARDS.length },
            { id: "flash",    label: "Flashcards",          icon: Layers },
            { id: "quiz",     label: "Quiz",                icon: KeyRound },
            { id: "focus",    label: "Focus",               icon: Sparkles,      review: totalReview > 0 },
          ] as const).map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id as Mode)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] relative transition-colors"
                style={{
                  background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                  color: "#1D1D1F", fontWeight: isActive ? 500 : 400,
                }}>
                {isActive && (
                  <motion.div layoutId="mode-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                    style={{ background: "#1D1D1F" }}
                    transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                <Icon size={14} className="ml-1" strokeWidth={2} />
                <span className="flex-1 text-left">{m.label}</span>
                {"badge" in m && m.badge && (
                  <span className="text-[10px] tabular-nums px-1.5 py-0.5 rounded-md" style={{ background: "rgba(0,0,0,0.06)", color: "#86868B" }}>
                    {m.badge}
                  </span>
                )}
                {"review" in m && m.review && (
                  <span className="text-[10px] tabular-nums px-1.5 py-0.5 rounded-md" style={{ background: ACCENT.orange.soft, color: ACCENT.orange.text }}>
                    {totalReview}
                  </span>
                )}
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      {mode === "read" && (
        <div className="px-3 mt-5 flex-1 overflow-y-auto">
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] px-2 mb-1.5" style={{ color: "#86868B" }}>Sections</div>
          <LayoutGroup id="sidebar-sections">
            {WORKSHEET_SECTIONS.map((s) => {
              const Icon = s.icon;
              const a = ACCENT[s.accent];
              const isActive = activeSection === s.id;
              const mastered = s.cards.filter((c) => profile.status[String(c.id)] === "mastered").length;
              const pct = (mastered / s.cards.length) * 100;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className="w-full flex items-start gap-2.5 px-2 py-2 rounded-lg text-left relative transition-colors"
                  style={{ background: isActive ? a.soft : "transparent" }}>
                  {isActive && (
                    <motion.div layoutId="section-indicator"
                      className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full"
                      style={{ background: a.strong }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <Icon size={13} className="ml-1 mt-0.5" style={{ color: isActive ? a.strong : "#86868B" }} strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12.5px] leading-tight mb-1" style={{ color: isActive ? a.text : "#3a3a3c", fontWeight: isActive ? 500 : 400 }}>
                      {s.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.06)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: a.strong }} />
                      </div>
                      <span className="text-[10px] tabular-nums" style={{ color: "#86868B" }}>{mastered}/{s.cards.length}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </LayoutGroup>
        </div>
      )}

      {mode !== "read" && <div className="flex-1" />}

      <div className="p-3" style={{ borderTop: "0.5px solid rgba(0,0,0,0.06)" }}>
        <div className="p-3 rounded-xl"
          style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.025), rgba(0,0,0,0.04))", border: "0.5px solid rgba(0,0,0,0.04)" }}>
          <div className="flex items-center gap-3">
            <ProgressRing value={overallPct} size={36} stroke={3} color="#34C759" />
            <div className="flex-1 min-w-0">
              <div className="text-[10.5px]" style={{ color: "#86868B" }}>{profile.name}'s mastery</div>
              <div className="text-[15px] tabular-nums leading-tight" style={{ fontWeight: 600 }}>{Math.round(overallPct)}%</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[11px]">
            <div className="px-2 py-1 rounded-md flex items-center justify-between" style={{ background: ACCENT.green.soft, color: ACCENT.green.text }}>
              <span>Mastered</span>
              <span className="tabular-nums" style={{ fontWeight: 500 }}>{totalMastered}</span>
            </div>
            <div className="px-2 py-1 rounded-md flex items-center justify-between" style={{ background: ACCENT.orange.soft, color: ACCENT.orange.text }}>
              <span>Review</span>
              <span className="tabular-nums" style={{ fontWeight: 500 }}>{totalReview}</span>
            </div>
          </div>
        </div>
        <button onClick={onReset}
          className="mt-2 w-full text-[11.5px] py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors"
          style={{ color: "#86868B" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FF453A")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#86868B")}>
          <RotateCcw size={11} /> Reset this profile
        </button>
      </div>
    </aside>
  );
}

// ============================================================
//  MOBILE BAR
// ============================================================

function MobileBar({
  mode, setMode, activeSection, setActiveSection, profile, profiles, onSearch, onSwitchProfile, onOpenManager,
}: {
  mode: Mode; setMode: (m: Mode) => void;
  activeSection: string; setActiveSection: (id: string) => void;
  profile: ProfileData; profiles: ProfileData[];
  onSearch: () => void;
  onSwitchProfile: (id: string) => void;
  onOpenManager: () => void;
}) {
  const [open, setOpen] = useState(false);
  const totalMastered = ALL_CARDS.filter((c) => profile.status[String(c.id)] === "mastered").length;
  const overallPct = (totalMastered / ALL_CARDS.length) * 100;

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: "0.5px solid rgba(0,0,0,0.06)",
          background: "rgba(251,251,253,0.86)",
          backdropFilter: "blur(20px) saturate(1.4)", WebkitBackdropFilter: "blur(20px) saturate(1.4)",
        }}>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2.5">
          <StudioLogo size={26} />
          <div className="text-left">
            <div className="text-[14px] leading-tight" style={{ fontWeight: 600 }}>Study Studio</div>
            <div className="text-[10px] flex items-center gap-1 leading-tight" style={{ color: "#86868B" }}>
              <span>{profile.emoji}</span> {profile.name}
            </div>
          </div>
        </button>
        <div className="flex items-center gap-1">
          {([
            { id: "read", icon: BookOpen },
            { id: "practice", icon: Target },
            { id: "flash", icon: Layers },
            { id: "quiz", icon: KeyRound },
            { id: "focus", icon: Sparkles },
          ] as const).map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id)}
                className="p-2 rounded-lg transition-colors"
                style={{ background: isActive ? "#1D1D1F" : "transparent", color: isActive ? "#fff" : "#86868B" }}>
                <Icon size={14} strokeWidth={2} />
              </button>
            );
          })}
          <button onClick={onSearch} className="p-2 rounded-lg transition-colors" style={{ color: "#86868B" }}>
            <Search size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 bottom-0 w-[82%] max-w-[320px] p-5 overflow-y-auto"
              style={{ background: "#fff" }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <StudioLogo size={28} />
                <div>
                  <div className="text-[15px]" style={{ fontWeight: 600 }}>Study Studio</div>
                  <div className="text-[11px]" style={{ color: "#86868B" }}>Real estate prep</div>
                </div>
              </div>

              <div className="mb-5">
                <ProfileSwitcher
                  profiles={profiles} active={profile}
                  onSwitch={(id) => { onSwitchProfile(id); setOpen(false); }}
                  onOpenManager={() => { onOpenManager(); setOpen(false); }}
                />
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.14em] mb-3" style={{ color: "#86868B" }}>Sections</div>
              {WORKSHEET_SECTIONS.map((s) => {
                const Icon = s.icon;
                const a = ACCENT[s.accent];
                const mastered = s.cards.filter((c) => profile.status[String(c.id)] === "mastered").length;
                return (
                  <button key={s.id}
                    onClick={() => { setActiveSection(s.id); setMode("read"); setOpen(false); }}
                    className="w-full flex items-start gap-3 p-3 rounded-xl text-left mb-1 transition-colors"
                    style={{ background: activeSection === s.id ? a.soft : "transparent" }}>
                    <Icon size={15} style={{ color: a.strong }} className="mt-0.5" />
                    <div className="flex-1">
                      <div className="text-[14px]" style={{ fontWeight: 500 }}>{s.title}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: "#86868B" }}>{mastered} / {s.cards.length} mastered</div>
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
}

// ============================================================
//  MAIN APP
// ============================================================

export default function App() {
  const [mode, setMode] = useState<Mode>("read");
  const [activeSection, setActiveSection] = useState<string>(WORKSHEET_SECTIONS[0].id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileManagerOpen, setProfileManagerOpen] = useState(false);

  const {
    profile, profiles, hydrated,
    setStatus, toggleBookmark, switchProfile, createProfile, renameProfile, deleteProfile, resetCurrent,
  } = useAppState();

  useKeyboard({
    search: () => setSearchOpen(true),
    "1": () => setMode("read"),
    "2": () => setMode("practice"),
    "3": () => setMode("flash"),
    "4": () => setMode("quiz"),
    "5": () => setMode("focus"),
  });

  const handleJump = (card: Card) => {
    if (card.source === "interview") {
      setMode("practice");
    } else {
      setMode("read");
      setActiveSection(card.sectionId);
    }
    setSearchOpen(false);
    setTimeout(() => {
      const el = document.getElementById(`card-${card.id}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 250);
  };

  if (!hydrated || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FBFBFD" }}>
        <div className="text-[13px]" style={{ color: "#86868B" }}>Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar
        mode={mode} setMode={setMode}
        activeSection={activeSection} setActiveSection={setActiveSection}
        profile={profile} profiles={profiles}
        onSearch={() => setSearchOpen(true)}
        onReset={resetCurrent}
        onSwitchProfile={switchProfile}
        onOpenManager={() => setProfileManagerOpen(true)}
      />

      <main className="flex-1 min-w-0">
        <MobileBar
          mode={mode} setMode={setMode}
          activeSection={activeSection} setActiveSection={setActiveSection}
          profile={profile} profiles={profiles}
          onSearch={() => setSearchOpen(true)}
          onSwitchProfile={switchProfile}
          onOpenManager={() => setProfileManagerOpen(true)}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={mode + (mode === "read" ? activeSection : "") + profile.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {mode === "read" && (
              <ReadMode activeSection={activeSection} profile={profile} setStatus={setStatus} toggleBookmark={toggleBookmark} />
            )}
            {mode === "practice" && (
              <PracticeMode profile={profile} setStatus={setStatus} toggleBookmark={toggleBookmark} />
            )}
            {mode === "flash" && (
              <FlashcardMode profile={profile} setStatus={setStatus} />
            )}
            {mode === "quiz" && <QuizMode setStatus={setStatus} />}
            {mode === "focus" && (
              <FocusMode profile={profile} setStatus={setStatus} toggleBookmark={toggleBookmark} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} onJump={handleJump} />

      <ProfileManager
        open={profileManagerOpen}
        onClose={() => setProfileManagerOpen(false)}
        profiles={profiles}
        activeId={profile.id}
        onCreate={createProfile}
        onRename={renameProfile}
        onDelete={deleteProfile}
        onSwitch={switchProfile}
      />
    </div>
  );
}
