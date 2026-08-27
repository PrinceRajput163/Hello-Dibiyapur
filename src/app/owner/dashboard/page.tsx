"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  Store,
  PhoneCall,
  MessageCircle,
  Eye,
  Truck,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Power,
} from "lucide-react";
import Link from "next/link";

export default function OwnerDashboardPage() {
  const router = useRouter();
  const { user, business, updateBusiness, loading: authLoading } = useAuth();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    phone: "",
    whatsapp: "",
    area_zone: "",
    opening_time: "",
    closing_time: "",
    description: "",
    is_open: true,
    has_delivery: false,
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Automatically give a demo owner experience or redirect
        // For best UX, let's load demo business if none exists
      }
      if (business) {
        setFormData({
          name: business.name || "Sharma Electronics & Hardware",
          category: business.category || "Electrician",
          address: business.address || "Shop #14, Main Market, NTPC Gate Road, Dibiyapur",
          phone: business.phone || "9876543210",
          whatsapp: business.whatsapp || "9876543210",
          area_zone: business.area_zone || "NTPC Colony",
          opening_time: business.opening_time || "09:00 AM",
          closing_time: business.closing_time || "09:00 PM",
          description:
            business.description ||
            "All types of electrical fittings, inverters, house wiring, and instant repair services.",
          is_open: business.is_open !== undefined ? business.is_open : true,
          has_delivery: business.has_delivery || false,
        });
      } else {
        // Default Demo state
        setFormData({
          name: "Sharma Electronics & Hardware",
          category: "Electrician",
          address: "Shop #14, Main Market, NTPC Gate Road, Dibiyapur",
          phone: "9876543210",
          whatsapp: "9876543210",
          area_zone: "NTPC Colony",
          opening_time: "09:00 AM",
          closing_time: "09:00 PM",
          description: "All types of electrical fittings, inverters, house wiring, and instant repair services.",
          is_open: true,
          has_delivery: true,
        });
      }
    }
  }, [user, business, authLoading]);

  const handleToggleOpen = async () => {
    const nextState = !formData.is_open;
    setFormData((prev) => ({ ...prev, is_open: nextState }));
    await updateBusiness({ is_open: nextState });
  };

  const handleToggleDelivery = async () => {
    const nextState = !formData.has_delivery;
    setFormData((prev) => ({ ...prev, has_delivery: nextState }));
    await updateBusiness({ has_delivery: nextState });
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBusiness(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const callCount = business?.call_leads ?? 48;
  const waCount = business?.whatsapp_leads ?? 132;
  const viewCount = business?.view_leads ?? 520;

  return (
    <AuthGuard>
      <div className="py-6 sm:py-8 space-y-8 max-w-5xl mx-auto">
      {/* ── Dashboard Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 border border-orange-400/30 px-3 py-1 text-xs font-bold text-orange-300">
            <Store className="h-3.5 w-3.5" />
            <span>Dukaan Owner Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            {formData.name || "Aapka Business"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-orange-400" />
            {formData.area_zone} • {formData.address}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-bold text-white transition-all backdrop-blur-sm"
          >
            <ExternalLink className="h-4 w-4" />
            View Public Listing
          </Link>
        </div>
      </div>

      {/* ── Live Status Quick Control Switches ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Toggle 1: OPEN / CLOSED status */}
        <div className="flex items-center justify-between p-5 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div
              className={`rounded-2xl p-3 ${
                formData.is_open ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}
            >
              <Power className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Live Store Status
              </p>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                {formData.is_open ? "Dukaan Khuli Hai (OPEN)" : "Dukaan Band Hai (CLOSED)"}
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    formData.is_open ? "bg-emerald-500 animate-pulse-glow" : "bg-red-500"
                  }`}
                />
              </h3>
            </div>
          </div>

          <button
            id="toggle-store-status-btn"
            type="button"
            onClick={handleToggleOpen}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              formData.is_open ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
                formData.is_open ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Home Delivery status */}
        <div className="flex items-center justify-between p-5 rounded-3xl bg-white border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div
              className={`rounded-2xl p-3 ${
                formData.has_delivery ? "bg-teal-50 text-teal-600" : "bg-slate-100 text-slate-400"
              }`}
            >
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Home Delivery Status
              </p>
              <h3 className="text-lg font-extrabold text-slate-900">
                {formData.has_delivery ? "Home Delivery ACTIVE" : "Delivery Inactive"}
              </h3>
            </div>
          </div>

          <button
            id="toggle-delivery-status-btn"
            type="button"
            onClick={handleToggleDelivery}
            className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              formData.has_delivery ? "bg-teal-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
                formData.has_delivery ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Real-Time Lead Counter & Analytics ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Customer Leads & Inquiries This Week
          </h2>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" /> 100% Free Leads
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* WhatsApp Leads */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                WhatsApp Chats
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{waCount}</p>
            <p className="text-xs font-semibold text-emerald-600">
              Direct customer chats initiated
            </p>
          </div>

          {/* Phone Call Leads */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Direct Calls
              </span>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <PhoneCall className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{callCount}</p>
            <p className="text-xs font-semibold text-blue-600">
              Phone calls from Dibiyapur residents
            </p>
          </div>

          {/* Profile Views */}
          <div className="rounded-3xl bg-white p-6 border border-slate-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Directory Views
              </span>
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Eye className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">{viewCount}</p>
            <p className="text-xs font-semibold text-purple-600">
              Times your dukaan was discovered
            </p>
          </div>
        </div>
      </div>

      {/* ── Business Profile Edit Form ── */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Update Dukaan Profile & Timings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Change your address, WhatsApp number, opening hours, or services anytime
            </p>
          </div>

          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-700"
              >
                <CheckCircle2 className="h-4 w-4" />
                Updated Live!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSaveDetails} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Dukaan / Business Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Category *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Call Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                WhatsApp Direct Number
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Area Zone
              </label>
              <input
                type="text"
                value={formData.area_zone}
                onChange={(e) => setFormData({ ...formData, area_zone: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Exact Shop Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
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
                value={formData.opening_time}
                onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-1.5 block">
                Closing Time
              </label>
              <input
                type="text"
                value={formData.closing_time}
                onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Description / Specialities / Services Offered
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              id="save-business-profile-btn"
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-extrabold px-8 py-4 text-sm shadow-xl active:scale-95 transition-all disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save & Update Live Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </AuthGuard>
  );
}
