"use client";

import React, { useState, useEffect } from "react";
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
  Lock,
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

export default function AuthGatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUser, registerBusinessOwner, login, user } = useAuth();

  const modeParam = searchParams.get("mode");
  const redirectParam = searchParams.get("redirect") || "/directory";

  const [tab, setTab] = useState<"resident" | "owner">(
    modeParam === "owner" ? "owner" : "resident"
  );

  // Mode A: Resident Form
  const [residentForm, setResidentForm] = useState({
    name: "",
    phone: "",
    area_zone: ZONES[0],
  });

  // Mode B: Shop Owner Form
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
    if (modeParam === "owner") {
      setTab("owner");
    } else if (modeParam === "resident") {
      setTab("resident");
    }
  }, [modeParam]);

  const handleResidentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = residentForm.phone.trim().replace(/\D/g, "");
    if (!residentForm.name.trim() || cleanPhone.length < 10) {
      setErrorMsg("Kripya apna poora naam aur 10-digit mobile number bharein.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await registerUser({
        name: residentForm.name,
        phone: cleanPhone,
        area_zone: residentForm.area_zone,
      });
      setSuccessMsg("Resident Account Verified! Opening Dibiyapur Live...");
      setTimeout(() => {
        router.push(redirectParam);
      }, 1000);
    } catch {
      setErrorMsg("Authentication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = ownerForm.phone.trim().replace(/\D/g, "");
    if (
      !ownerForm.owner_name.trim() ||
      !ownerForm.business_name.trim() ||
      cleanPhone.length < 10 ||
      !ownerForm.address.trim()
    ) {
      setErrorMsg("Owner Name, Business Name, 10-digit Phone aur Shop Address zaroori hain.");
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await registerBusinessOwner({
        ...ownerForm,
        phone: cleanPhone,
        whatsapp: ownerForm.whatsapp || cleanPhone,
      });
      setSuccessMsg("Business Registered Successfully! Opening Owner Dashboard...");
      setTimeout(() => {
        router.push("/owner/dashboard");
      }, 1000);
    } catch {
      setErrorMsg("Registration error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (type: "resident" | "owner") => {
    setLoading(true);
    setErrorMsg(null);
    if (type === "resident") {
      await login("9876500001", "Ramesh Kumar");
      router.push(redirectParam);
    } else {
      await login("9876543210", "Sharma Ji (Owner)");
      router.push("/owner/dashboard");
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      {/* ── Top Header ── */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3.5 py-1 text-xs font-bold text-orange-700">
          <Lock className="h-3.5 w-3.5 text-orange-500" />
          <span>Dibiyapur Live Sequential Auth Gate</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Login / Register to Continue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Dibiyapur Live directory, community ask board aur marketplace access karne ke liye login karein.
        </p>
      </div>

      {/* ── Modern Tabs ── */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-3xl bg-slate-200/80 mb-8 border border-slate-300/60 shadow-inner">
        <button
          type="button"
          onClick={() => {
            setTab("resident");
            setErrorMsg(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            tab === "resident"
              ? "bg-white text-slate-900 shadow-md scale-[1.01]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <UserCheck className="h-4 w-4 text-blue-600" />
          <span>Resident Login / Signup</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("owner");
            setErrorMsg(null);
          }}
          className={`flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-extrabold transition-all duration-200 ${
            tab === "owner"
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md scale-[1.01]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Dukaan Owner Register</span>
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

      {/* ── Form Box ── */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, x: tab === "resident" ? -15 : 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl"
      >
        {tab === "resident" ? (
          /* ── TAB 1: RESIDENT LOGIN / SIGNUP ── */
          <form onSubmit={handleResidentSubmit} className="space-y-4">
            <div className="border-b border-slate-100 pb-3 mb-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Local Resident Access
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Quick entry with full access to directory, community ask feed, and 2nd-hand market.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Full Name (Aapka Naam) *
              </label>
              <input
                type="text"
                required
                placeholder="Jaise: Amit Sharma, Sunita Devi"
                value={residentForm.name}
                onChange={(e) => setResidentForm({ ...residentForm, name: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Mobile Phone Number *
              </label>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="font-extrabold text-slate-400 text-sm shrink-0">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number"
                  value={residentForm.phone}
                  onChange={(e) => setResidentForm({ ...residentForm, phone: e.target.value })}
                  className="flex-1 bg-transparent text-sm outline-none text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Primary Area / Colony in Dibiyapur *
              </label>
              <select
                value={residentForm.area_zone}
                onChange={(e) => setResidentForm({ ...residentForm, area_zone: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 transition-all font-medium"
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
                {loading ? "Verifying..." : "Enter Dibiyapur Live"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          /* ── TAB 2: DUKAAN OWNER REGISTER ── */
          <form onSubmit={handleOwnerSubmit} className="space-y-4">
            <div className="border-b border-slate-100 pb-3 mb-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Store className="h-5 w-5 text-orange-500" />
                Register Dukaan & Open Owner Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct listing on Directory + Owner Dashboard with live analytics and status control.
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
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
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
                placeholder="Shop #12, Near SBI Bank, Main Market, Dibiyapur"
                value={ownerForm.address}
                onChange={(e) => setOwnerForm({ ...ownerForm, address: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  Calling Phone Number *
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <span className="font-extrabold text-slate-400 text-sm shrink-0">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit number"
                    value={ownerForm.phone}
                    onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                    className="flex-1 bg-transparent text-sm outline-none text-slate-800 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                  WhatsApp Direct Number
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                  <span className="font-extrabold text-slate-400 text-sm shrink-0">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="WhatsApp number"
                    value={ownerForm.whatsapp}
                    onChange={(e) => setOwnerForm({ ...ownerForm, whatsapp: e.target.value })}
                    className="flex-1 bg-transparent text-sm outline-none text-slate-800 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-teal-50 border border-teal-200 cursor-pointer">
              <input
                id="owner-delivery-check"
                type="checkbox"
                checked={ownerForm.has_delivery}
                onChange={(e) => setOwnerForm({ ...ownerForm, has_delivery: e.target.checked })}
                className="h-4 w-4 rounded accent-teal-600"
              />
              <label htmlFor="owner-delivery-check" className="text-xs sm:text-sm font-bold text-teal-800 cursor-pointer">
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

        {/* ── Quick 1-Click Demo Shortcut ── */}
        <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
            Quick 1-Click Instant Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo("resident")}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              Resident Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("owner")}
              className="flex items-center justify-center gap-1.5 p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 transition-colors"
            >
              <Store className="h-4 w-4" />
              Dukaan Owner Demo
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
