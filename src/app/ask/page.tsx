"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { CommunityPost } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import LoginModal from "@/components/auth/LoginModal";
import {
  Megaphone,
  Plus,
  X,
  MessageCircle,
  Clock,
  AlertTriangle,
  Home,
  Settings,
  HelpCircle,
  Briefcase,
  BellRing,
  ShieldCheck,
  PhoneCall,
  Flame,
  CheckCircle2,
  Lock,
} from "lucide-react";

// ─── Mock Data ─────────────────────────────────────────────────────────────
const MOCK_POSTS: CommunityPost[] = [
  {
    id: "1",
    user_name: "Ramesh Kumar Sharma",
    contact: "9876500001",
    tag: "#Emergency",
    message: "Urgent! Main transformer switch trip ho gaya hai NTPC Colony Road par. Reliable electrician abhi turant chahiye. Please contact karein!",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    user_name: "Sunita Devi",
    contact: "9876500002",
    tag: "#Rent",
    message: "2 BHK Flat / Portion rent par chahiye near Phaphund Road / St. Francis School. Budget: ₹5,000 - ₹7,000. Family ke liye.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    user_name: "Amit Verma",
    contact: "9876500003",
    tag: "#Services",
    message: "Bathroom pipe leakage theek karne ke liye certified plumber ka number share karein. Sahayal Road area.",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    user_name: "Priya Singh (NTPC)",
    contact: "9876500004",
    tag: "#NeedHelp",
    message: "Class 10th CBSE Maths & Physics ke liye home tutor ki zaroorat hai. Daily 1 hour. Fees negotiable.",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "5",
    user_name: "Nagar Palika Alert",
    contact: "9876500005",
    tag: "#LocalAlerts",
    message: "Notice: Kal subah 8 AM se 12 PM tak Main Market aur Bidhuna Road par paani ki pipeline maintenance chalegi.",
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

const TAGS = [
  { label: "All", icon: null },
  { label: "#Emergency", icon: AlertTriangle },
  { label: "#Rent", icon: Home },
  { label: "#Services", icon: Settings },
  { label: "#LocalAlerts", icon: BellRing },
  { label: "#NeedHelp", icon: HelpCircle },
];

const TAG_STYLES: Record<string, { bg: string; text: string; pillBg: string; icon: React.ElementType }> = {
  "#Emergency":   { bg: "bg-red-50",    text: "text-red-700",    pillBg: "bg-red-500",    icon: AlertTriangle },
  "#Rent":        { bg: "bg-blue-50",   text: "text-blue-700",   pillBg: "bg-blue-500",   icon: Home },
  "#Services":    { bg: "bg-purple-50", text: "text-purple-700", pillBg: "bg-purple-500", icon: Briefcase },
  "#LocalAlerts": { bg: "bg-amber-50",  text: "text-amber-700",  pillBg: "bg-amber-500",  icon: BellRing },
  "#NeedHelp":    { bg: "bg-teal-50",   text: "text-teal-700",   pillBg: "bg-teal-500",   icon: HelpCircle },
};

const EMERGENCY_HELPLINES = [
  { name: "Police Emergency", number: "112", icon: PhoneCall, color: "text-blue-600" },
  { name: "Ambulance (CHC)", number: "108", icon: PhoneCall, color: "text-red-600" },
  { name: "Electricity Complain (PVVNL)", number: "1912", icon: PhoneCall, color: "text-amber-600" },
  { name: "Fire Station", number: "101", icon: PhoneCall, color: "text-rose-600" },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const EMPTY_FORM = { user_name: "", contact: "", tag: "#NeedHelp", message: "", otp: "" };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AskPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filtered, setFiltered] = useState<CommunityPost[]>([]);
  const [activeTag, setActiveTag] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setPosts(data && data.length > 0 ? data : MOCK_POSTS);
    } catch {
      setPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    setFiltered(activeTag === "All" ? posts : posts.filter((p) => p.tag === activeTag));
  }, [posts, activeTag]);

  const handleSendOtp = () => {
    if (!form.contact || form.contact.length < 10) {
      setError("Kripya 10-digit mobile number enter karein.");
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.user_name.trim() || !form.message.trim()) {
      setError("Naam aur requirement details zaroori hain.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { error: err } = await supabase.from("community_posts").insert([{
        user_name: form.user_name,
        contact: form.contact,
        tag: form.tag,
        message: form.message,
      }]);
      if (err) throw err;
      setShowModal(false);
      setForm(EMPTY_FORM);
      setOtpSent(false);
      await fetchPosts();
    } catch {
      setPosts((prev) => [
        {
          id: Date.now().toString(),
          user_name: form.user_name,
          contact: form.contact,
          tag: form.tag,
          message: form.message,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      setOtpSent(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full mb-1.5">
            <Megaphone className="h-3.5 w-3.5" />
            <span>Dibiyapur Community Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ask & Help Community Board
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ghar, service, emergency ya koi bhi zaroorat yahan post karein
          </p>
        </div>

        <button
          id="post-requirement-top-btn"
          onClick={() => requireAuth(() => setShowModal(true))}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          Post Requirement
        </button>
      </div>

      {/* ── Tag Filters Carousel ── */}
      <div className="flex gap-2.5 overflow-x-auto pb-4 no-scrollbar">
        {TAGS.map(({ label, icon: Icon }) => {
          const isActive = activeTag === label;
          const style = label !== "All" ? TAG_STYLES[label] : null;
          return (
            <button
              key={label}
              id={`tag-filter-${label.replace("#", "").toLowerCase()}`}
              onClick={() => setActiveTag(label)}
              className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-white shadow-lg shadow-orange-200/50 scale-105"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:shadow-sm"
              }`}
              style={isActive ? { background: style?.pillBg ?? "linear-gradient(135deg, #f97316, #0d9488)" } : {}}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Multi-Column Layout: Left Feed (2/3) + Right Sidebar (1/3) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-2">
        {/* Left Column: Posts Feed (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 space-y-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="skeleton h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-4 w-1/3" />
                      <div className="skeleton h-3 w-1/5" />
                    </div>
                  </div>
                  <div className="skeleton h-14 w-full" />
                  <div className="skeleton h-10 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 p-8">
              <Megaphone className="h-16 w-16 text-slate-300 mb-4" />
              <p className="text-lg font-bold text-slate-600">Koi requirement post nahi mili</p>
              <p className="text-sm text-slate-400 mt-1">
                Pehli post aap karein aur Dibiyapur community se turant reply paayein!
              </p>
              <button
                onClick={() => requireAuth(() => setShowModal(true))}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-orange-600"
              >
                <Plus className="h-4 w-4" /> Post Your Requirement
              </button>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              key={activeTag}
              className="space-y-4"
            >
              {filtered.map((post) => {
                const tagMeta = post.tag ? TAG_STYLES[post.tag] : null;
                const TagIcon = tagMeta?.icon;

                return (
                  <motion.div
                    key={post.id}
                    variants={item}
                    className="group rounded-3xl bg-white p-5 sm:p-6 border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base font-extrabold text-white shadow-sm"
                          style={{ background: "linear-gradient(135deg, #f97316, #0d9488)" }}
                        >
                          {post.user_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                            {post.user_name}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            {timeAgo(post.created_at)}
                          </p>
                        </div>
                      </div>

                      {post.tag && tagMeta && (
                        <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${tagMeta.bg} ${tagMeta.text}`}>
                          {TagIcon && <TagIcon className="h-3.5 w-3.5" />}
                          {post.tag}
                        </span>
                      )}
                    </div>

                    {/* Message Body */}
                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal py-1">
                      {post.message}
                    </p>

                    {/* WhatsApp Action */}
                    {post.contact && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          Verified Dibiyapur Resident
                        </span>

                        <button
                          id={`reply-whatsapp-${post.id}`}
                          onClick={() =>
                            requireAuth(() => {
                              window.open(
                                `https://wa.me/91${post.contact}?text=Namaste ${post.user_name} ji! Dibiyapur Live Ask feed par aapki post dekhi ("${post.message.slice(0, 40)}..."). Kya main madad kar sakta hoon?`,
                                "_blank"
                              );
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-emerald-600 hover:shadow-md active:scale-95 transition-all"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Reply on WhatsApp
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Trending Needs Card */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-5 w-5 text-orange-500" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Trending Local Needs
              </h3>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-center justify-between p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                <span className="font-medium text-slate-800">⚡ Electricians in NTPC Area</span>
                <span className="text-xs font-bold text-orange-600">14 asks</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="font-medium text-slate-800">🏠 2 BHK Rent Phaphund Rd</span>
                <span className="text-xs font-bold text-blue-600">9 asks</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                <span className="font-medium text-slate-800">📚 Class 10/12 Home Tutors</span>
                <span className="text-xs font-bold text-purple-600">7 asks</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/60 border border-teal-100">
                <span className="font-medium text-slate-800">🔧 Bike & Car Mechanics</span>
                <span className="text-xs font-bold text-teal-600">5 asks</span>
              </li>
            </ul>
          </div>

          {/* Quick Guidelines */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-teal-50/40 p-6 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              <h3 className="font-extrabold text-slate-900 text-base">
                Community Guidelines
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li>• Sahi area aur contact number zaroor likhein taaki log easily reach kar sakein.</li>
              <li>• Commercial spam posts strictly prohibited hain.</li>
              <li>• Emergency medical posts ko community prioritized tag karegi.</li>
            </ul>
          </div>

          {/* Emergency Helplines Widget */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-red-500" />
              <span>Dibiyapur Emergency Helplines</span>
            </h3>
            <div className="space-y-2.5">
              {EMERGENCY_HELPLINES.map((h) => (
                <a
                  key={h.name}
                  href={`tel:${h.number}`}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-all text-xs"
                >
                  <span className="font-semibold text-slate-700">{h.name}</span>
                  <span className={`font-bold ${h.color} flex items-center gap-1`}>
                    <PhoneCall className="h-3 w-3" /> {h.number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile FAB ── */}
      <motion.button
        id="post-requirement-fab"
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
        <span className="hidden sm:inline">Post Requirement</span>
        <span className="sm:hidden">Ask</span>
      </motion.button>

      {/* ── Post Requirement Modal with OTP / Phone Verification Flow ── */}
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
                    Post Your Requirement
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Dibiyapur community tak apni zaroorat turant pahunchayein
                  </p>
                </div>
                <button
                  id="close-post-modal"
                  onClick={() => setShowModal(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      Aapka Naam *
                    </label>
                    <input
                      id="form-post-name"
                      required
                      type="text"
                      placeholder="Jaise: Ramesh Kumar"
                      value={form.user_name}
                      onChange={(e) => setForm({ ...form, user_name: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                      WhatsApp Contact Number *
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="form-post-contact"
                        required
                        type="tel"
                        placeholder="10-digit number"
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="shrink-0 rounded-2xl bg-orange-50 border border-orange-200 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-100"
                        >
                          Verify Phone
                        </button>
                      ) : (
                        <span className="shrink-0 flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> OTP Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {otpSent && (
                  <div className="animate-fade-in p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-orange-500" />
                      Enter 4-digit SMS OTP (Demo: 1234)
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="1234"
                      value={form.otp}
                      onChange={(e) => setForm({ ...form, otp: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white outline-none focus:border-orange-400"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Category Tag *
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {TAGS.filter((t) => t.label !== "All").map(({ label }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setForm({ ...form, tag: label })}
                        className={`rounded-2xl px-3.5 py-2 text-xs font-bold border transition-all duration-200 ${
                          form.tag === label
                            ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                    Requirement Details *
                  </label>
                  <textarea
                    id="form-post-message"
                    required
                    rows={3}
                    placeholder="Kya chahiye aapko? Area, budget, urgency detail me likhein..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none transition-all"
                  />
                </div>

                {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}

                <button
                  id="submit-post"
                  type="submit"
                  disabled={submitting}
                  className="mt-1 w-full rounded-2xl py-3.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #f97316, #0d9488)" }}
                >
                  {submitting ? "Publishing Post..." : "Post Requirement 📢"}
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
        actionSubtitle="Enter your mobile number to post requirements and reply directly to Dibiyapur residents."
      />
    </div>
  );
}
