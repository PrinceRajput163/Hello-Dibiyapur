"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  UserCheck,
  Building2,
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  Truck,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const ZONES = [
  "NTPC Township",
  "GAIL Colony",
  "Phaphund Road",
  "Sahayal Road",
  "Bidhuna Road",
  "Auraiya City",
  "Other Local Area",
];

const CATEGORIES = [
  "Doctor/Clinic",
  "Electrician",
  "Kirana & General Store",
  "Restaurants / Cafe",
  "Tutors & Coaching",
  "Mechanics & Auto",
  "Hardware & Sanitary",
  "Clothing & Boutique",
  "Other Business / Service",
];

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUser, registerBusinessOwner, user } = useAuth();

  const initialRole = searchParams.get("role") === "business_owner" ? "business_owner" : "user";
  const [role, setRole] = useState<"user" | "business_owner">(initialRole);

  // Resident Form
  const [userForm, setUserForm] = useState({
    name: "",
    phone: "",
    area_zone: ZONES[0],
  });

  // Business Owner Form
  const [ownerForm, setOwnerForm] = useState({
    owner_name: "",
    business_name: "",
    category: CATEGORIES[0],
    address: "",
    phone: "",
    whatsapp: "",
    area_zone: ZONES[0],
    has_delivery: false,
    opening_time: "09:00 AM",
    closing_time: "09:00 PM",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "business_owner" || r === "user") {
      setRole(r);
    }
  }, [searchParams]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.phone.trim()) {
      setErrorMsg("Kripya apna poora naam aur mobile number bharein.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await registerUser(userForm);
      setSuccessMsg("Resident Account Successfully Created! Redirecting...");
      setTimeout(() => {
        router.push("/directory");
      }, 1200);
    } catch {
      setErrorMsg("Registration error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !ownerForm.owner_name.trim() ||
      !ownerForm.business_name.trim() ||
      !ownerForm.phone.trim() ||
      !ownerForm.address.trim()
    ) {
      setErrorMsg("Owner Name, Business Name, Address aur Phone zaroori hain.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await registerBusinessOwner(ownerForm);
      setSuccessMsg("Business Successfully Registered! Opening Owner Dashboard...");
      setTimeout(() => {
        router.push("/owner/dashboard");
      }, 1200);
    } catch {
      setErrorMsg("Registration error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      {/* ── Header ── */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3.5 py-1 text-xs font-bold text-orange-700">
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          <span>Dibiyapur Live Dual-Role Registration</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Create Your Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Choose whether you are a local resident or registering a business/dukaan in Dibiyapur.
        </p>
      </div>

      {/* ── Role Selector Toggle ── */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-3xl bg-slate-200/80 mb-8 border border-slate-300/60 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setRole("user");
            setErrorMsg(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            role === "user"
              ? "bg-white text-slate-900 shadow-md scale-[1.01]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCheck className="h-4 w-4 text-blue-600" />
          <span>Resident / Public</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRole("business_owner");
            setErrorMsg(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            role === "business_owner"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-[1.01]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Shop / Business Owner</span>
        </button>
      </div>

      {/* ── Success Alert ── */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Error Alert ── */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* ── Form Card ── */}
      <motion.div
        key={role}
        initial={{ opacity: 0, x: role === "user" ? -15 : 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl"
      >
        {role === "user" ? (
          /* ── MODE A: RESIDENT / PUBLIC FORM ── */
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="border-b border-slate-100 pb-3 mb-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Resident Profile Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Grants access to post requirements, buy/sell second-hand items, and contact businesses.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Full Name (Aapka Poora Naam) *
              </label>
              <input
                type="text"
                required
                placeholder="Jaise: Amit Sharma, Sunita Devi"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit mobile number"
                value={userForm.phone}
                onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Primary Area / Colony *
              </label>
              <select
                value={userForm.area_zone}
                onChange={(e) => setUserForm({ ...userForm, area_zone: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all"
              >
                {ZONES.map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 text-sm shadow-lg active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? "Creating Account..." : "Complete Resident Registration"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          /* ── MODE B: BUSINESS / SHOP OWNER FORM ── */
          <form onSubmit={handleOwnerSubmit} className="space-y-4">
            <div className="border-b border-slate-100 pb-3 mb-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                Dukaan / Business Registration
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct listing on Directory Hub + Owner Dashboard with live analytics and status control.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Owner / Proprietor Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={ownerForm.owner_name}
                  onChange={(e) => setOwnerForm({ ...ownerForm, owner_name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Business / Dukaan Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharma Electronics & Hardware"
                  value={ownerForm.business_name}
                  onChange={(e) => setOwnerForm({ ...ownerForm, business_name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Business Category *
                </label>
                <select
                  value={ownerForm.category}
                  onChange={(e) => setOwnerForm({ ...ownerForm, category: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Area Zone *
                </label>
                <select
                  value={ownerForm.area_zone}
                  onChange={(e) => setOwnerForm({ ...ownerForm, area_zone: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
                >
                  {ZONES.map((z) => (
                    <option key={z}>{z}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Exact Shop Address *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Shop #12, Near SBI Bank, Main Market, Dibiyapur"
                value={ownerForm.address}
                onChange={(e) => setOwnerForm({ ...ownerForm, address: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Call Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={ownerForm.phone}
                  onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  WhatsApp Direct Number
                </label>
                <input
                  type="tel"
                  placeholder="WhatsApp number"
                  value={ownerForm.whatsapp}
                  onChange={(e) => setOwnerForm({ ...ownerForm, whatsapp: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Opening Time
                </label>
                <input
                  type="text"
                  placeholder="09:00 AM"
                  value={ownerForm.opening_time}
                  onChange={(e) => setOwnerForm({ ...ownerForm, opening_time: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Closing Time
                </label>
                <input
                  type="text"
                  placeholder="09:00 PM"
                  value={ownerForm.closing_time}
                  onChange={(e) => setOwnerForm({ ...ownerForm, closing_time: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Short Description & Services
              </label>
              <textarea
                rows={2}
                placeholder="Aapki dukaan par kya kya milta hai ya konsi services available hain..."
                value={ownerForm.description}
                onChange={(e) => setOwnerForm({ ...ownerForm, description: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none transition-all"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-teal-50 border border-teal-200 cursor-pointer">
              <input
                id="owner-delivery"
                type="checkbox"
                checked={ownerForm.has_delivery}
                onChange={(e) => setOwnerForm({ ...ownerForm, has_delivery: e.target.checked })}
                className="h-4 w-4 rounded accent-teal-600"
              />
              <label htmlFor="owner-delivery" className="text-xs sm:text-sm font-bold text-teal-800 cursor-pointer">
                Home Delivery Available in Dibiyapur
              </label>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-extrabold py-4 text-sm shadow-xl active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? "Registering Dukaan..." : "Register Dukaan & Open Dashboard"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* ── Login Link ── */}
      <div className="text-center mt-6 text-xs sm:text-sm text-slate-500 font-medium">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-extrabold text-orange-600 hover:underline">
          Login with Phone Number
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          <p className="text-xs font-bold text-slate-500">Loading registration...</p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
