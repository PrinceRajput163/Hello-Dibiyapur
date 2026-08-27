"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { Phone, ArrowRight, Store, UserCheck, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError("Kripya 10-digit mobile number enter karein.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(phone, name || undefined);
      if (phone.endsWith("0")) {
        router.push("/owner/dashboard");
      } else {
        router.push("/directory");
      }
    } catch {
      setError("Login error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (type: "owner" | "resident") => {
    setLoading(true);
    if (type === "owner") {
      await login("9876543210", "Sharma Ji");
      router.push("/owner/dashboard");
    } else {
      await login("9876500001", "Ramesh Kumar");
      router.push("/directory");
    }
  };

  return (
    <div className="py-10 max-w-md mx-auto">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 px-3.5 py-1 text-xs font-bold text-orange-700">
          <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          <span>Dibiyapur Live Login</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Mobile number enter karke turant account access karein
        </p>
      </div>

      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-100 shadow-xl space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Mobile Phone Number *
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <Phone className="h-4 w-4 text-slate-400" />
              <input
                type="tel"
                required
                placeholder="10-digit number (e.g. 9876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1.5 block">
              Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Aapka Naam"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white font-extrabold py-3.5 text-sm shadow-lg active:scale-95 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? "Logging in..." : "Login to Dibiyapur Live"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* ── Quick Demo Login Shortcuts ── */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo("resident")}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-700 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              Resident Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo("owner")}
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 transition-colors"
            >
              <Store className="h-3.5 w-3.5" />
              Owner Demo
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 text-xs sm:text-sm text-slate-500 font-medium">
        New to Dibiyapur Live?{" "}
        <Link href="/auth/register" className="font-extrabold text-orange-600 hover:underline">
          Register with Dual-Role Account
        </Link>
      </div>
    </div>
  );
}
