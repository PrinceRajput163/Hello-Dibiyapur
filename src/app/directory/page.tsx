"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Business } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import LoginModal from "@/components/auth/LoginModal";
import {
  Phone,
  MessageCircle,
  Plus,
  X,
  Store,
  Truck,
  Search,
  Zap,
  Stethoscope,
  ShoppingBasket,
  Coffee,
  BookOpen,
  Wrench,
  MapPin,
  Sparkles,
  Compass,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_BUSINESSES: Business[] = [
  { id: "1", name: "Sharma Electricals & Hardware", category: "Electrician", area_zone: "NTPC Colony", phone: "9876543210", is_open: true, has_delivery: false, created_at: new Date().toISOString() },
  { id: "2", name: "Dr. Reena Gupta Clinic", category: "Doctor/Clinic", area_zone: "Phaphund Road", phone: "9812345678", is_open: true, has_delivery: false, created_at: new Date().toISOString() },
  { id: "3", name: "Agarwal Super Kirana & General Store", category: "Kirana", area_zone: "Sahayal Road", phone: "9988776655", is_open: true, has_delivery: true, created_at: new Date().toISOString() },
  { id: "4", name: "Royal Chai Tapri & Fast Food", category: "Restaurants", area_zone: "GAIL Township", phone: "9765432198", is_open: false, has_delivery: true, created_at: new Date().toISOString() },
  { id: "5", name: "Rahul Sir Science & Maths Tuitions", category: "Tutors", area_zone: "Auraiya", phone: "9654321987", is_open: true, has_delivery: false, created_at: new Date().toISOString() },
  { id: "6", name: "Lucky Multi-brand Auto Works", category: "Mechanics", area_zone: "Phaphund Road", phone: "9543210876", is_open: true, has_delivery: false, created_at: new Date().toISOString() },
  { id: "7", name: "Fresh Express Grocery Mart", category: "Kirana", area_zone: "Bidhuna Road", phone: "9432109765", is_open: true, has_delivery: true, created_at: new Date().toISOString() },
  { id: "8", name: "Aashirwad Family Dental Clinic", category: "Doctor/Clinic", area_zone: "NTPC Colony", phone: "9321098654", is_open: true, has_delivery: false, created_at: new Date().toISOString() },
  { id: "9", name: "Gupta Electronics & Inverter Care", category: "Electrician", area_zone: "Sahayal Road", phone: "9210987654", is_open: true, has_delivery: true, created_at: new Date().toISOString() },
];

const CATEGORIES = [
  { label: "All", icon: Compass },
  { label: "Doctor/Clinic", icon: Stethoscope },
  { label: "Electrician", icon: Zap },
  { label: "Kirana", icon: ShoppingBasket },
  { label: "Restaurants", icon: Coffee },
  { label: "Tutors", icon: BookOpen },
  { label: "Mechanics", icon: Wrench },
];

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Electrician: Zap,
  "Doctor/Clinic": Stethoscope,
  Kirana: ShoppingBasket,
  Restaurants: Coffee,
  Tutors: BookOpen,
  Mechanics: Wrench,
};

const CATEGORY_COLOR_MAP: Record<string, { bg: string; text: string; iconBg: string }> = {
  Electrician:    { bg: "bg-amber-50",  text: "text-amber-700",  iconBg: "bg-amber-100" },
  "Doctor/Clinic":{ bg: "bg-rose-50",   text: "text-rose-700",   iconBg: "bg-rose-100" },
  Kirana:         { bg: "bg-emerald-50", text: "text-emerald-700", iconBg: "bg-emerald-100" },
  Restaurants:    { bg: "bg-orange-50", text: "text-orange-700", iconBg: "bg-orange-100" },
  Tutors:         { bg: "bg-blue-50",   text: "text-blue-700",   iconBg: "bg-blue-100" },
  Mechanics:      { bg: "bg-slate-50",  text: "text-slate-700",  iconBg: "bg-slate-200" },
};

const EMPTY_FORM = { name: "", category: "Kirana", area_zone: "NTPC Colony", phone: "", is_open: true, has_delivery: false };
const AREAS = ["NTPC Colony", "GAIL Township", "Phaphund Road", "Sahayal Road", "Bidhuna Road", "Auraiya"];

const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const cardItem = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] as const } } };

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="skeleton h-12 w-12 shrink-0 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4" />
          <div className="skeleton h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-4 w-16 rounded-full" />
        <div className="skeleton h-4 w-16 rounded-full" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="skeleton h-10 flex-1 rounded-xl" />
        <div className="skeleton h-10 flex-1 rounded-xl" />
      </div>
    </div>
  );
}

export default function DirectoryPage() {
  const { user, recordLead } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filtered, setFiltered] = useState<Business[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gatekeeper state
  const [gatekeeperOpen, setGatekeeperOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBusinesses(data && data.length > 0 ? data : MOCK_BUSINESSES);
    } catch {
      setBusinesses(MOCK_BUSINESSES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    let result = businesses;
    if (activeCategory !== "All") {
      result = result.filter((b) => b.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.area_zone ?? "").toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [businesses, activeCategory, search]);

  const requireAuth = (action: () => void) => {
    const storedPhone = typeof window !== "undefined" ? localStorage.getItem("dibiyapur_user_phone") : null;
    if (!user && !storedPhone) {
      setPendingAction(() => action);
      setGatekeeperOpen(true);
    } else {
      action();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Business Name aur Phone number zaroori hai.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("businesses").insert([form]);
      if (insertError) throw insertError;
      setShowModal(false);
      setForm(EMPTY_FORM);
      await fetchBusinesses();
    } catch {
      const newBiz: Business = {
        ...form,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      setBusinesses((prev) => [newBiz, ...prev]);
      setShowModal(false);
      setForm(EMPTY_FORM);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full mb-1.5">
            <Store className="h-3.5 w-3.5" />
            <span>Dibiyapur & Auraiya Verified Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Local Business & Service Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified doctors, shops, electricians aur services — One-click Call & WhatsApp
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/register?role=business_owner"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            Register Dukaan (Owner)
          </Link>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm border border-slate-200 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            id="business-search"
            type="text"
            placeholder="Search by Dukaan Name, Doctor, Plumber, Kirana, or Area Zone (NTPC, Phaphund Road)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm sm:text-base text-slate-800 placeholder:text-slate-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Carousel ── */}
      <div className="flex gap-2.5 overflow-x-auto pb-5 no-scrollbar">
        {CATEGORIES.map(({ label, icon: Icon }) => {
          const isActive = activeCategory === label;
          return (
            <button
              key={label}
              id={`category-pill-${label.replace(/\//g, "-").toLowerCase()}`}
              onClick={() => setActiveCategory(label)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-white shadow-lg shadow-orange-200/50 scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:shadow-sm"
              }`}
              style={isActive ? { background: "linear-gradient(135deg, #f97316, #0d9488)" } : {}}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* ── 3-Column Responsive Card Grid ── */}
      {loading ? (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 p-8">
          <Store className="h-16 w-16 text-slate-300 mb-4" />
          <p className="text-lg font-bold text-slate-600">Koi business nahi mila</p>
          <p className="text-sm text-slate-400 mt-1 max-w-sm">
            Search query badal kar dekhein ya apna business abhi register karein.
          </p>
          <Link
            href="/auth/register?role=business_owner"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-600"
          >
            <Plus className="h-4 w-4" /> Register Your Business
          </Link>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          key={activeCategory + search}
          className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((biz) => {
            const CatIcon = CATEGORY_ICON_MAP[biz.category] ?? Store;
            const colors = CATEGORY_COLOR_MAP[biz.category] ?? {
              bg: "bg-slate-50",
              text: "text-slate-700",
              iconBg: "bg-slate-200",
            };

            return (
              <motion.div
                key={biz.id}
                variants={cardItem}
                className="group flex flex-col justify-between rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <div className={`shrink-0 rounded-2xl p-3 ${colors.iconBg} transition-transform group-hover:scale-110`}>
                      <CatIcon className={`h-6 w-6 ${colors.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-base leading-snug truncate">
                        {biz.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                        <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        {biz.area_zone}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span
                      className={`relative flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                        biz.is_open ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          biz.is_open ? "bg-emerald-500 animate-pulse-glow" : "bg-red-500"
                        }`}
                      />
                      {biz.is_open ? "OPEN NOW" : "CLOSED"}
                    </span>

                    {biz.has_delivery && (
                      <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-700">
                        <Truck className="h-3.5 w-3.5" /> Home Delivery
                      </span>
                    )}

                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${colors.bg} ${colors.text}`}>
                      {biz.category}
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons with Gatekeeper */}
                {biz.phone && (
                  <div className="flex gap-2.5 mt-5 pt-4 border-t border-slate-100">
                    <button
                      id={`call-btn-${biz.id}`}
                      onClick={() =>
                        requireAuth(() => {
                          recordLead("call", biz.id);
                          window.location.href = `tel:${biz.phone}`;
                        })
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
                    >
                      <Phone className="h-3.5 w-3.5 text-blue-600" /> Direct Call
                    </button>
                    <button
                      id={`whatsapp-btn-${biz.id}`}
                      onClick={() =>
                        requireAuth(() => {
                          recordLead("whatsapp", biz.id);
                          window.open(
                            `https://wa.me/91${biz.phone}?text=Namaste! Dibiyapur Live Directory se aapka number mila. Kya aap available hain?`,
                            "_blank"
                          );
                        })
                      }
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Floating Action Button ── */}
      <motion.button
        id="add-business-fab"
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
        <span className="hidden sm:inline">Register Shop</span>
        <span className="sm:hidden">Add Shop</span>
      </motion.button>

      {/* ── Quick Add Modal ── */}
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
                    Quick Register Dukaan / Service
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For full owner features with dashboard, use Dual-Role Register
                  </p>
                </div>
                <button
                  id="close-add-business-modal"
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Business / Dukaan Name *
                  </label>
                  <input
                    id="form-biz-name"
                    required
                    type="text"
                    placeholder="Jaise: Sharma Electronics, Gupta Kirana"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      Category *
                    </label>
                    <select
                      id="form-biz-category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-orange-400 transition-all"
                    >
                      {CATEGORIES.filter((c) => c.label !== "All").map((c) => (
                        <option key={c.label}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      Area / Zone *
                    </label>
                    <select
                      id="form-biz-area"
                      value={form.area_zone}
                      onChange={(e) => setForm({ ...form, area_zone: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-orange-400 transition-all"
                    >
                      {AREAS.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Phone Number *
                  </label>
                  <input
                    id="form-biz-phone"
                    required
                    type="tel"
                    placeholder="10-digit Mobile Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                <div className="flex gap-6 py-1">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      id="form-biz-open"
                      type="checkbox"
                      checked={form.is_open}
                      onChange={(e) => setForm({ ...form, is_open: e.target.checked })}
                      className="h-4 w-4 rounded accent-orange-500"
                    />
                    Currently Open
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      id="form-biz-delivery"
                      type="checkbox"
                      checked={form.has_delivery}
                      onChange={(e) => setForm({ ...form, has_delivery: e.target.checked })}
                      className="h-4 w-4 rounded accent-teal-500"
                    />
                    Home Delivery Available
                  </label>
                </div>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <div className="flex flex-col gap-2 pt-2">
                  <button
                    id="submit-add-business"
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg"
                    style={{ background: "linear-gradient(135deg, #f97316, #0d9488)" }}
                  >
                    {submitting ? "Registering Shop..." : "Quick Publish 🚀"}
                  </button>

                  <Link
                    href="/auth/register?role=business_owner"
                    className="text-center text-xs text-orange-600 font-bold hover:underline flex items-center justify-center gap-1 mt-1"
                  >
                    Want an Owner Dashboard with Live Analytics? Register as Business Owner <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
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
        actionSubtitle="Enter your phone number once to connect directly via Call or WhatsApp with Dibiyapur shop owners."
      />
    </div>
  );
}
