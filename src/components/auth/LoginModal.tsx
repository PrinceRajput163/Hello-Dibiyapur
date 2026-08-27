"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import {
  Lock,
  Phone,
  ArrowRight,
  X,
  Store,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  actionTitle?: string;
  actionSubtitle?: string;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSuccess,
  actionTitle = "Login to Continue",
  actionSubtitle = "Enter your phone number to unlock direct WhatsApp, Call & Posting actions.",
}: LoginModalProps) {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Kripya 10-digit mobile number enter karein.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      // Store phone in localStorage as requested
      localStorage.setItem("dibiyapur_user_phone", cleanPhone);
      await login(cleanPhone, name.trim() || undefined);

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop with dark blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900/95 border border-slate-700/80 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Icon and Title */}
          <div className="space-y-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-500/20">
              <Lock className="h-6 w-6 text-white" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full mb-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Dibiyapur Live Gatekeeper</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {actionTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                {actionSubtitle}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                Mobile Phone Number *
              </label>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-800/90 border border-slate-700 px-4 py-3 text-sm focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/20 transition-all">
                <span className="font-extrabold text-slate-400 shrink-0">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-transparent text-white font-semibold placeholder:text-slate-500 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                Aapka Naam (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl bg-slate-800/90 border border-slate-700 px-4 py-3 text-sm text-white font-semibold placeholder:text-slate-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-extrabold py-3.5 text-sm shadow-xl active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? "Verifying..." : "Continue & Unlock Action"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Quick links */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Are you a shop owner in Dibiyapur?
            </p>
            <Link
              href="/auth/register?role=business_owner"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 hover:underline"
            >
              <Store className="h-3.5 w-3.5" />
              Register as Business Owner & Get Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
