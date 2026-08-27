"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Creator } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import LoginModal from "@/components/auth/LoginModal";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  Users2,
  MessageCircle,
  Star,
  TrendingUp,
  Film,
  Globe,
  Utensils,
  Smile,
  Sparkles,
  IndianRupee,
  ShieldCheck,
  Award,
  Video,
  CheckCircle2,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_CREATORS: Creator[] = [
  { id: "1", name: "Priya Sharma (Dibiyapur Foodie)", handle: "@priyafoodie_auraiya", niche: "Food", followers: 18400, starting_price: 399, contact: "9876502001", avatar_url: null, created_at: new Date().toISOString() },
  { id: "2", name: "Abhishek Yadav (Dibiyapur News & Memes)", handle: "@dibiyapurlivenews", niche: "News/Memes", followers: 42800, starting_price: 699, contact: "9876502002", avatar_url: null, created_at: new Date().toISOString() },
  { id: "3", name: "Kavita Singh (Lifestyle & Shopping)", handle: "@kavita_auraiyalifestyle", niche: "Lifestyle", followers: 12900, starting_price: 299, contact: "9876502003", avatar_url: null, created_at: new Date().toISOString() },
  { id: "4", name: "Rohit NTPC Vlogs & Tech", handle: "@rohit_ntpcvlogs", niche: "Lifestyle", followers: 28100, starting_price: 499, contact: "9876502004", avatar_url: null, created_at: new Date().toISOString() },
  { id: "5", name: "Meena Ji Ki Traditional Rasoi", handle: "@meenarasoi_dibiyapur", niche: "Food", followers: 9700, starting_price: 249, contact: "9876502005", avatar_url: null, created_at: new Date().toISOString() },
  { id: "6", name: "Auraiya Dance & Comedy Hub", handle: "@auraiya_comedyclub", niche: "News/Memes", followers: 31200, starting_price: 549, contact: "9876502006", avatar_url: null, created_at: new Date().toISOString() },
];

const NICHE_CONFIG: Record<string, { icon: React.ElementType; gradient: string; text: string; pillBg: string }> = {
  Food:        { icon: Utensils, gradient: "linear-gradient(135deg, #f97316, #fb923c)", text: "text-orange-600", pillBg: "bg-orange-500" },
  "News/Memes":{ icon: Smile,    gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)", text: "text-purple-600", pillBg: "bg-purple-500" },
  Lifestyle:   { icon: Sparkles, gradient: "linear-gradient(135deg, #0d9488, #14b8a6)", text: "text-teal-600",   pillBg: "bg-teal-500" },
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #f97316, #ea580c)",
  "linear-gradient(135deg, #8b5cf6, #7c3aed)",
  "linear-gradient(135deg, #0d9488, #0f766e)",
  "linear-gradient(135deg, #db2777, #be185d)",
  "linear-gradient(135deg, #2563eb, #1d4ed8)",
  "linear-gradient(135deg, #059669, #10b981)",
];

function formatFollowers(n: number): string {
  if (n >= 100000) return `${(n / 100000).toFixed(1)} Lakh`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const cardItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] as const } } };

export default function CreatorsPage() {
  const { user } = useAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNiche, setActiveNiche] = useState("All Creators");

  // Gatekeeper
  const [gatekeeperOpen, setGatekeeperOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = (action: () => void) => {
    const storedPhone = typeof window !== "undefined" ? localStorage.getItem("dibiyapur_user_phone") : null;
    if (!user && !storedPhone) {
      setPendingAction(() => action);
      setGatekeeperOpen(true);
    } else {
      action();
    }
  };

  const fetchCreators = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .order("followers", { ascending: false });
      if (error) throw error;
      setCreators(data && data.length > 0 ? data : MOCK_CREATORS);
    } catch {
      setCreators(MOCK_CREATORS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  const niches = ["All Creators", "Food", "News/Memes", "Lifestyle"];
  const filtered = activeNiche === "All Creators" ? creators : creators.filter((c) => c.niche === activeNiche);
  const totalReach = creators.reduce((s, c) => s + (c.followers ?? 0), 0);

  return (
    <AuthGuard>
      <div className="py-6">
      {/* ── Page Header / Hero ── */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 mb-8 text-white shadow-xl"
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #581c87 100%)",
        }}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-purple-200 backdrop-blur-sm mb-3">
              <Film className="h-3.5 w-3.5" />
              <span>Dibiyapur & Auraiya Creator Collabs</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Local Creators Se Apni Dukaan Ka Promotion Karwayein
            </h1>
            <p className="text-sm sm:text-base text-purple-200 mt-2 leading-relaxed">
              Instagram Reels, Stories aur Local Promotion packages starting at just ₹249.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span>{creators.length} Verified Creators</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm">
              <Globe className="h-4 w-4 text-blue-300" />
              <span>{totalReach.toLocaleString("en-IN")} Total Reach</span>
            </div>
          </div>
        </div>

        {/* Glow circles */}
        <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
      </div>

      {/* ── Niche Filters Carousel ── */}
      <div className="flex gap-2.5 overflow-x-auto pb-5 no-scrollbar">
        {niches.map((niche) => {
          const isActive = activeNiche === niche;
          const config = niche !== "All Creators" ? NICHE_CONFIG[niche] : null;
          const NicheIcon = config?.icon ?? null;
          return (
            <button
              key={niche}
              id={`niche-filter-${niche.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setActiveNiche(niche)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-white shadow-lg scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
              style={isActive ? { background: config?.gradient ?? "linear-gradient(135deg, #f97316, #0d9488)" } : {}}
            >
              {NicheIcon && <NicheIcon className="h-3.5 w-3.5" />}
              {niche}
            </button>
          );
        })}
      </div>

      {/* ── 3-Column Responsive Grid on Laptop ── */}
      {loading ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-white border border-slate-100 p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="skeleton h-16 w-16 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-3 w-1/3" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="skeleton h-4 w-20 rounded-full" />
                <div className="skeleton h-4 w-24 rounded-full" />
              </div>
              <div className="skeleton h-11 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 p-8">
          <Users2 className="h-16 w-16 text-slate-300 mb-4" />
          <p className="text-lg font-bold text-slate-600">Koi creator nahi mila</p>
          <p className="text-sm text-slate-400 mt-1">
            Filter badal kar try karein ya creator profile add karein.
          </p>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          key={activeNiche}
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((creator, i) => {
            const niche = creator.niche ?? "Lifestyle";
            const config = NICHE_CONFIG[niche] ?? NICHE_CONFIG["Lifestyle"];
            const NicheIcon = config.icon;
            const avatarGradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];

            return (
              <motion.div
                key={creator.id}
                variants={cardItem}
                className="group flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div
                      className="relative shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-md overflow-hidden"
                      style={{ background: creator.avatar_url ? undefined : avatarGradient }}
                    >
                      {creator.avatar_url ? (
                        <img src={creator.avatar_url} alt={creator.name} className="h-full w-full object-cover" />
                      ) : (
                        creator.name.charAt(0).toUpperCase()
                      )}
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-[9px] font-bold ring-2 ring-white">
                        ✓
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-base leading-snug truncate">
                          {creator.name}
                        </h3>
                      </div>
                      {creator.handle && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Video className="h-3 w-3 text-pink-500" />
                          {creator.handle}
                        </p>
                      )}

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold mt-2 ${config.text}`}
                        style={{ background: `${config.gradient}18` }}
                      >
                        <NicheIcon className="h-3 w-3" /> {niche}
                      </span>
                    </div>
                  </div>

                  {/* Rate Card & Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Audience Reach
                      </span>
                      <span className="text-sm font-extrabold text-slate-800 flex items-center justify-center gap-1 mt-0.5">
                        <Users2 className="h-3.5 w-3.5 text-blue-500" />
                        {creator.followers ? formatFollowers(creator.followers) : "–"}
                      </span>
                    </div>
                    <div className="border-l border-slate-200/80">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Rate Card / Reel
                      </span>
                      <span className="text-sm font-extrabold text-orange-600 flex items-center justify-center gap-0.5 mt-0.5">
                        <IndianRupee className="h-3.5 w-3.5" />
                        {creator.starting_price ?? 399}
                      </span>
                    </div>
                  </div>

                  {/* Verified Engagement Badge */}
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500 font-medium">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Verified Dibiyapur & Auraiya Local Engagement</span>
                  </div>
                </div>

                {/* Pre-filled WhatsApp CTA Button with Gatekeeper */}
                {creator.contact && (
                  <div className="mt-5 pt-3 border-t border-slate-100">
                    <button
                      id={`collaborate-${creator.id}`}
                      onClick={() =>
                        requireAuth(() => {
                          window.open(
                            `https://wa.me/91${creator.contact}?text=Namaste ${creator.name} ji! 🙏 Dibiyapur Live Creators Hub par aapka profile dekha. Meri shop/business ke promotion ke liye ₹${creator.starting_price ?? 399}/Reel package discuss karna hai. Kya hum baat kar sakte hain?`,
                            "_blank"
                          );
                        })
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all hover:brightness-110 active:scale-95"
                      style={{ background: config.gradient }}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Hire for Shop Promotion (₹{creator.starting_price ?? 399})
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Join as Creator Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-10 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/40 to-purple-50/40 p-6 sm:p-8 text-center shadow-sm"
      >
        <Star className="h-10 w-10 text-purple-500 mx-auto mb-3" />
        <h3 className="text-xl font-extrabold text-slate-900 mb-1.5">
          Kya aap Dibiyapur ya Auraiya ke Creator hain?
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-lg mx-auto leading-relaxed">
          Apna profile Creator Hub par register karein aur local shops, cafes aur services ke brand deals paayein.
        </p>
        <a
          id="creator-join-whatsapp"
          href="https://wa.me/919876500000?text=Namaste! Main Dibiyapur Live Creators Hub mein apna profile add karwana chahta hoon."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-600 hover:shadow-xl active:scale-95 transition-all"
        >
          <MessageCircle className="h-4 w-4" /> Join Creator Hub on WhatsApp
        </a>
      </motion.div>

      {/* ── Login Gatekeeper Modal ── */}
      <LoginModal
        isOpen={gatekeeperOpen}
        onClose={() => {
          setGatekeeperOpen(false);
          setPendingAction(null);
        }}
        onSuccess={() => {
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
        actionTitle="Phone Verification Required"
        actionSubtitle="Enter your mobile number to hire local creators for shop promotion & reels."
      />
      </div>
    </AuthGuard>
  );
}
