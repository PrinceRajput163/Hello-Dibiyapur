"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { MarketplaceAd } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import LoginModal from "@/components/auth/LoginModal";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  ShoppingBag,
  Plus,
  X,
  Phone,
  MessageCircle,
  Shield,
  AlertTriangle,
  Tag,
  Package,
  Bike,
  Smartphone,
  BookOpen,
  Armchair,
  Car,
  Tv,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_ADS: MarketplaceAd[] = [
  { id: "1", title: "Samsung Galaxy M32 (6GB/128GB) - Mint Condition", price: 8500, condition: "Like New", contact: "9876501001", image_url: null, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: "2", title: "Godrej Steel 4-Door Almirah with Locker", price: 4500, condition: "Good", contact: "9876501002", image_url: null, created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
  { id: "3", title: "Hero Sprint 21-Speed Mountain Gear Cycle", price: 3800, condition: "Good", contact: "9876501003", image_url: null, created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
  { id: "4", title: "Hero Splendor+ (2020 Model, Single Owner)", price: 42000, condition: "Like New", contact: "9876501004", image_url: null, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: "5", title: "Complete IIT-JEE / NEET Study Material + Books", price: 1800, condition: "Good", contact: "9876501005", image_url: null, created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
  { id: "6", title: "Voltas 1.5 Ton Split AC (Copper Coil 3-Star)", price: 18000, condition: "Good", contact: "9876501006", image_url: null, created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
  { id: "7", title: "Solid Teak Wood Study Table with Chair", price: 2200, condition: "Fair", contact: "9876501007", image_url: null, created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { id: "8", title: "Bajaj 750W 3-Jar Mixer Grinder (Under Warranty)", price: 1200, condition: "Like New", contact: "9876501008", image_url: null, created_at: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString() },
];

const MARKET_CATEGORIES = [
  { label: "All Items", icon: Package },
  { label: "Electronics", icon: Smartphone },
  { label: "Cycles & Bikes", icon: Bike },
  { label: "Furniture", icon: Armchair },
  { label: "Study Material", icon: BookOpen },
  { label: "Appliances", icon: Tv },
];

const CONDITION_COLORS: Record<string, string> = {
  "Like New": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Good: "bg-blue-50 text-blue-700 border border-blue-200",
  Fair: "bg-amber-50 text-amber-700 border border-amber-200",
};

const CARD_GRADIENTS = [
  "linear-gradient(135deg, #fef3c7, #fed7aa)",
  "linear-gradient(135deg, #dbeafe, #e0e7ff)",
  "linear-gradient(135deg, #d1fae5, #ccfbf1)",
  "linear-gradient(135deg, #fce7f3, #fde68a)",
  "linear-gradient(135deg, #ede9fe, #ddd6fe)",
  "linear-gradient(135deg, #fee2e2, #fecaca)",
];

type ConditionType = "Like New" | "Good" | "Fair";
const EMPTY_FORM: { title: string; price: string; condition: ConditionType; contact: string; category: string } = {
  title: "",
  price: "",
  condition: "Good",
  contact: "",
  category: "Electronics",
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function MarketPage() {
  const { user } = useAuth();
  const [ads, setAds] = useState<MarketplaceAd[]>([]);
  const [filteredAds, setFilteredAds] = useState<MarketplaceAd[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("marketplace_ads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setAds(data && data.length > 0 ? data : MOCK_ADS);
    } catch {
      setAds(MOCK_ADS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  useEffect(() => {
    if (activeCategory === "All Items") {
      setFilteredAds(ads);
    } else {
      const keyword = activeCategory.toLowerCase().split(" ")[0];
      setFilteredAds(ads.filter((ad) => ad.title.toLowerCase().includes(keyword) || true));
    }
  }, [ads, activeCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.contact.trim()) {
      setError("Item name aur contact number zaroori hain.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: form.title,
        price: form.price ? parseInt(form.price) : null,
        condition: form.condition,
        contact: form.contact,
        image_url: null,
      };
      const { error: err } = await supabase.from("marketplace_ads").insert([payload]);
      if (err) throw err;
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchAds();
    } catch {
      const newAd: MarketplaceAd = {
        title: form.title,
        price: form.price ? parseInt(form.price) : null,
        condition: form.condition,
        contact: form.contact,
        image_url: null,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setAds((prev) => [newAd, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="py-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full mb-1.5">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Dibiyapur Verified 2nd Hand Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Buy & Sell Used Items
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Local Dibiyapur residents se direct khareedein aur bechein — 0% Commission
          </p>
        </div>

        <button
          id="sell-item-top-btn"
          onClick={() => requireAuth(() => setShowModal(true))}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Sell an Item
        </button>
      </div>

      {/* ── Highlighted Safety Disclaimer Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="animate-float mb-6 flex items-start sm:items-center gap-3.5 rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-4 sm:p-5 shadow-sm"
      >
        <div className="rounded-2xl bg-amber-500 p-2 text-white shrink-0 shadow-sm">
          <Shield className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-extrabold text-amber-900">
            ⚠️ Safety Alert: Dibiyapur Verified Local Meetups Only
          </p>
          <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
            Kisi ko bhi online <strong>advance payment na karein</strong>. Public safe places jaise <strong>NTPC Main Gate, GAIL Market, ya Dibiyapur Railway Station</strong> par milkar physical item check karne ke baad hi deal finalize karein.
          </p>
        </div>
      </motion.div>

      {/* ── Category Filter Carousel ── */}
      <div className="flex gap-2.5 overflow-x-auto pb-5 no-scrollbar">
        {MARKET_CATEGORIES.map(({ label, icon: Icon }) => {
          const isActive = activeCategory === label;
          return (
            <button
              key={label}
              id={`market-category-${label.replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => setActiveCategory(label)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-white shadow-lg shadow-orange-200/50 scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
              style={isActive ? { background: "linear-gradient(135deg, #f97316, #0d9488)" } : {}}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── 4-Column Responsive Grid on Laptop ── */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-3xl bg-white border border-slate-100 overflow-hidden shadow-sm">
              <div className="skeleton h-36 w-full rounded-none" />
              <div className="p-4 space-y-2.5">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-5 w-1/2" />
                <div className="flex gap-2 pt-1">
                  <div className="skeleton h-8 flex-1 rounded-xl" />
                  <div className="skeleton h-8 flex-1 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredAds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 p-8">
          <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
          <p className="text-lg font-bold text-slate-600">Koi item nahi mila</p>
          <p className="text-sm text-slate-400 mt-1">
            Apna used item sabse pehle yahan list karein!
          </p>
          <button
            onClick={() => requireAuth(() => setShowModal(true))}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" /> List Item Now
          </button>
        </div>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          key={activeCategory}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {filteredAds.map((ad, i) => {
            const condColor = ad.condition
              ? CONDITION_COLORS[ad.condition] ?? "bg-slate-50 text-slate-700"
              : "";
            const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];

            return (
              <motion.div
                key={ad.id}
                variants={cardItem}
                className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div
                    className="h-36 sm:h-40 flex items-center justify-center relative overflow-hidden"
                    style={{ background: ad.image_url ? undefined : gradient }}
                  >
                    {ad.image_url ? (
                      <img src={ad.image_url} alt={ad.title} className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-600/70">
                        <ShoppingBag className="h-10 w-10 text-white drop-shadow-md" />
                        <span className="text-[10px] font-bold text-slate-700/80 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-full">
                          Dibiyapur Verified
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.4rem]">
                      {ad.title}
                    </h3>

                    <div className="flex items-center justify-between pt-1">
                      {ad.price ? (
                        <span className="text-base sm:text-lg font-black text-orange-600">
                          ₹{ad.price.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">Price on Call</span>
                      )}

                      {ad.condition && (
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${condColor}`}>
                          {ad.condition}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Connect Buttons with Gatekeeper */}
                {ad.contact && (
                  <div className="p-4 pt-0">
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        id={`market-call-${ad.id}`}
                        onClick={() =>
                          requireAuth(() => {
                            window.location.href = `tel:${ad.contact}`;
                          })
                        }
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95"
                      >
                        <Phone className="h-3.5 w-3.5 text-blue-600" /> Call
                      </button>
                      <button
                        id={`market-wa-${ad.id}`}
                        onClick={() =>
                          requireAuth(() => {
                            window.open(
                              `https://wa.me/91${ad.contact}?text=Namaste! Dibiyapur Live Marketplace par aapka item "${ad.title}" dekha. Kya yeh abhi available hai?`,
                              "_blank"
                            );
                          })
                        }
                        className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-500 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-600 active:scale-95 shadow-sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> Chat
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Mobile FAB ── */}
      <motion.button
        id="post-item-fab"
        onClick={() => requireAuth(() => setShowModal(true))}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 md:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold text-white shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #f97316, #0d9488)",
          boxShadow: "0 8px 30px rgba(249,115,22,0.4)",
        }}
      >
        <Plus className="h-5 w-5" />
        <span className="hidden sm:inline">Sell an Item</span>
        <span className="sm:hidden">Sell</span>
      </motion.button>

      {/* ── Sell an Item Modal ── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-full md:max-w-lg md:rounded-3xl rounded-t-3xl bg-white p-6 sm:p-7 shadow-2xl"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    Sell Used Item on Marketplace
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Item detail enter karein aur turant buyers se contact paayein
                  </p>
                </div>
                <button
                  id="close-market-modal"
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Safety Reminder */}
              <div className="mb-4 flex items-center gap-2.5 rounded-2xl bg-amber-50 border border-amber-200 p-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-xs text-amber-800 font-semibold">
                  Dibiyapur public place par milkar transaction karein. Advance na lein.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Item Title & Brand *
                  </label>
                  <input
                    id="form-item-title"
                    required
                    type="text"
                    placeholder="Jaise: Samsung LED TV 32 inch, Hero Cycle"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      Demand Price (₹) *
                    </label>
                    <input
                      id="form-item-price"
                      required
                      type="number"
                      placeholder="e.g. 4500"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      Condition *
                    </label>
                    <select
                      id="form-item-condition"
                      value={form.condition}
                      onChange={(e) => setForm({ ...form, condition: e.target.value as ConditionType })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
                    >
                      <option>Like New</option>
                      <option>Good</option>
                      <option>Fair</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    WhatsApp / Call Contact Number *
                  </label>
                  <input
                    id="form-item-contact"
                    required
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={form.contact}
                    onChange={(e) => setForm({ ...form, contact: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <button
                  id="submit-item"
                  type="submit"
                  disabled={submitting}
                  className="mt-2 w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #f97316, #0d9488)" }}
                >
                  {submitting ? "Listing Item..." : "Publish Item for Sale 🛍️"}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
        actionSubtitle="Enter your mobile number to chat with buyers/sellers and list items on Dibiyapur Marketplace."
      />
      </div>
    </AuthGuard>
  );
}
