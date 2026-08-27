"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useAuth } from "@/lib/auth-context";
import {
  Store,
  Megaphone,
  ShoppingBag,
  Users2,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Building2,
  UserCheck,
  Search,
} from "lucide-react";

const HERO_STATS = [
  { value: "200+", label: "Local Shops & Services", icon: Store, color: "text-orange-500" },
  { value: "50+", label: "Daily Community Queries", icon: Megaphone, color: "text-blue-500" },
  { value: "0%", label: "Commission / Direct Deals", icon: ShieldCheck, color: "text-emerald-500" },
  { value: "6+", label: "Dibiyapur Zones Covered", icon: MapPin, color: "text-purple-500" },
];

const MODULE_CARDS = [
  {
    title: "Directory Hub",
    hindiTag: "Local Dukanein & Services",
    description: "Doctor, Electrician, Kirana, Restaurants, Tutors se direct call aur WhatsApp par judiye.",
    href: "/directory",
    icon: Store,
    badge: "Live Status & Delivery",
    gradient: "from-orange-500 to-amber-500",
    spotlight: "rgba(249, 115, 22, 0.15)",
    textColor: "text-orange-600",
    ctaText: "Explore Directory",
  },
  {
    title: "Community Ask",
    hindiTag: "Zaroorat Post Karein",
    description: "Emergency bijli, plumber, rent par room ya coaching — community turant madad karegi.",
    href: "/ask",
    icon: Megaphone,
    badge: "Verified Local Feed",
    gradient: "from-blue-600 to-indigo-600",
    spotlight: "rgba(79, 70, 229, 0.15)",
    textColor: "text-blue-600",
    ctaText: "Open Ask Board",
  },
  {
    title: "2nd Hand Market",
    hindiTag: "Kharido & Becho",
    description: "Cycle, mobile, furniture, books aur appliances bechein verified Dibiyapur residents ko.",
    href: "/market",
    icon: ShoppingBag,
    badge: "0% Commission",
    gradient: "from-emerald-500 to-teal-600",
    spotlight: "rgba(16, 185, 129, 0.15)",
    textColor: "text-emerald-600",
    ctaText: "Browse Marketplace",
  },
  {
    title: "Creators Collab Hub",
    hindiTag: "Local Influencers",
    description: "Dibiyapur & Auraiya ke top content creators se apni shop/business ka promotion karwayein.",
    href: "/creators",
    icon: Users2,
    badge: "Starting ₹249/Reel",
    gradient: "from-purple-600 to-pink-600",
    spotlight: "rgba(168, 85, 247, 0.15)",
    textColor: "text-purple-600",
    ctaText: "View Creators",
  },
];

const LOCAL_ZONES = [
  "NTPC Township",
  "GAIL Colony",
  "Phaphund Road",
  "Sahayal Road",
  "Bidhuna Road",
  "Auraiya City",
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] as const } },
};

export default function LandingPage() {
  const { user, business } = useAuth();
  const isAuth = !!user;
  const isOwner = user?.role === "business_owner" || !!business;

  // Hero Section Interactive Mouse Tracking
  const heroRef = useRef<HTMLDivElement | null>(null);
  const [heroMouse, setHeroMouse] = useState({ x: 0, y: 0 });
  const [heroHovered, setHeroHovered] = useState(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setHeroMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHeroHovered(true);
  };

  return (
    <div className="py-6 sm:py-10 space-y-16">
      {/* ── 1. Hero Section with Interactive Glowing Grid Lines & Spotlight ── */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => setHeroHovered(false)}
        className="relative overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800/80 group"
      >
        {/* Layer A: Base Subtle Linear Grid Pattern */}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none"
        />

        {/* Layer B: Interactive Glowing Cyan/Emerald Grid Reveal via Radial Mask */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#06b6d4_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:32px_32px] transition-opacity duration-200"
          style={{
            opacity: heroHovered ? 0.8 : 0,
            maskImage: `radial-gradient(350px circle at ${heroMouse.x}px ${heroMouse.y}px, black 30%, transparent 80%)`,
            WebkitMaskImage: `radial-gradient(350px circle at ${heroMouse.x}px ${heroMouse.y}px, black 30%, transparent 80%)`,
          }}
        />

        {/* Layer C: Interactive Center Cursor Spotlight Glow */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
          style={{
            opacity: heroHovered ? 1 : 0,
            background: `radial-gradient(550px circle at ${heroMouse.x}px ${heroMouse.y}px, rgba(99, 102, 241, 0.18), rgba(13, 148, 136, 0.09) 45%, transparent 80%)`,
          }}
        />

        {/* Ambient Glow Orbs */}
        <div className="absolute -top-10 -left-10 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-800 px-4 py-1.5 text-xs sm:text-sm font-bold text-orange-400 shadow-sm hover:border-orange-500/50 hover:bg-slate-900 hover:scale-105 transition-all duration-200 cursor-default"
          >
            <Sparkles className="h-4 w-4 text-orange-400" />
            <span>District Auraiya’s #1 Hyper-Local Platform</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white"
          >
            Dibiyapur Ka Apna{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-teal-400 bg-clip-text text-transparent">
              Hyper-Local Digital Hub
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto"
          >
            NTPC se Phaphund Road tak — Dukanein, Community Help, Second-hand Deals aur Local Creators sab ek jagah.
          </motion.p>

          {/* Dual Call-to-Action Buttons with Auth-Aware Routing */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              id="hero-explore-btn"
              href={isAuth ? "/directory" : "/auth?mode=resident&redirect=/directory"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-base font-extrabold text-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Search className="h-5 w-5" />
              Explore Dibiyapur
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              id="hero-register-owner-btn"
              href={isOwner ? "/owner/dashboard" : "/auth?mode=owner"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-md px-7 py-4 text-base font-bold text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Store className="h-5 w-5 text-orange-400" />
              {isOwner ? "Open Owner Dashboard" : "List Your Business (Dukaan Register Karein)"}
            </Link>
          </motion.div>

          {/* Live Zone Ticker Badges with Hover Highlight */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 font-medium"
          >
            <span className="font-semibold text-slate-400">Live Coverage:</span>
            {LOCAL_ZONES.map((zone) => (
              <span
                key={zone}
                className="rounded-full bg-slate-900/60 border border-slate-800 px-3.5 py-1 text-[11px] text-slate-300 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:border-emerald-500/50 hover:bg-slate-900/90 hover:text-emerald-300 hover:shadow-lg hover:shadow-emerald-950/40 cursor-default"
              >
                📍 {zone}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 2. Live Stats Bar ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {HERO_STATS.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-3.5 rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className={`rounded-2xl p-3 bg-slate-50 border border-slate-100 ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ── 3. Features Interactive Grid with Glowing Border Spotlight ── */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dibiyapur Live Modules
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal">
            Har zaroorat ka modern solution — direct verified local network
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {MODULE_CARDS.map((card) => {
            const Icon = card.icon;
            const targetHref = isAuth ? card.href : `/auth?mode=resident&redirect=${encodeURIComponent(card.href)}`;

            return (
              <motion.div key={card.title} variants={itemVariants} className="h-full">
                <SpotlightCard
                  spotlightColor={card.spotlight}
                  className="h-full shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Icon with lift and rotation on hover */}
                    <div
                      className={`rounded-2xl p-3.5 bg-gradient-to-br ${card.gradient} text-white shadow-md group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200`}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full bg-slate-100 border border-slate-200/80 px-3 py-1 text-xs font-extrabold text-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        {card.title}
                      </h3>
                      <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        {card.hindiTag}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={targetHref}
                      className={`inline-flex items-center gap-2 text-sm sm:text-base font-extrabold ${card.textColor} group-hover:underline`}
                    >
                      {card.ctaText}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <span className="text-xs text-slate-400 font-semibold">100% Free</span>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── 4. Dual-Role Registration Callout Box ── */}
      <section className="rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-indigo-900 via-slate-900 to-teal-950 p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Join Dibiyapur Live Network
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Aapke role ke hisaab se customized features aur direct customer access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Resident Card */}
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-300">
                  <UserCheck className="h-4 w-4" />
                  <span>Public / Resident User</span>
                </div>
                <h3 className="text-xl font-bold text-white">Dibiyapur Nivasi (Resident)</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Post requirements on Community Ask board
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Sell second-hand items at 0% middleman fees
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    Find and call verified doctors & mechanics
                  </li>
                </ul>
              </div>

              <Link
                href="/auth?mode=resident"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 px-6 py-3.5 text-sm font-extrabold shadow-md hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Register as Resident
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Business Owner Card */}
            <div className="rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 backdrop-blur-md border border-orange-400/30 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-xl bg-orange-500/30 px-3 py-1 text-xs font-bold text-orange-300">
                  <Building2 className="h-4 w-4" />
                  <span>Dukaan & Business Owner</span>
                </div>
                <h3 className="text-xl font-bold text-white">Shop / Service Owner</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    Dedicated Owner Dashboard with live analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    Toggle LIVE Open / Closed & Delivery status anytime
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                    Direct Call & WhatsApp leads without commissions
                  </li>
                </ul>
              </div>

              <Link
                href="/auth?mode=owner"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3.5 text-sm font-extrabold shadow-lg hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Register Dukaan & Get Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Trust / Why Dibiyapur Live ── */}
      <section className="rounded-3xl bg-white p-8 sm:p-10 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Kyun Use Karein Dibiyapur Live?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Local people, local businesses, maximum trust
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full w-fit">
            <ShieldCheck className="h-4 w-4" /> 100% Free & Open Source Local Platform
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-2xl">⚡</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Instant Direct Connect</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bina kisi middleman ke direct business owner ya seller ko WhatsApp aur call karein.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-2xl">📍</span>
            <h4 className="font-extrabold text-slate-900 text-sm">GPS Geofence Accuracy</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              NTPC, GAIL, Phaphund Road ke paas ke services filter karein apne real-time GPS se.
            </p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-2xl">🤝</span>
            <h4 className="font-extrabold text-slate-900 text-sm">Safe Verified Meetups</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Public places jaise NTPC Gate ya Station par milkar second-hand deals karein.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
