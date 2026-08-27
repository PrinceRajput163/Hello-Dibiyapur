"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  MapPin,
  ChevronDown,
  Zap,
  Crosshair,
  Loader2,
  Check,
  User,
  Store,
  LogOut,
  LayoutDashboard,
  LogIn,
  UserPlus,
} from "lucide-react";

// ─── Zone data with GPS coordinates ─────────────────────────────────────────
const ZONES = [
  { label: "Auto Detect GPS", lat: 0, lng: 0, radius: 0 },
  { label: "NTPC Township", lat: 26.5877, lng: 79.2922, radius: 1.5 },
  { label: "GAIL Colony", lat: 26.5830, lng: 79.2750, radius: 1.0 },
  { label: "Phaphund Road", lat: 26.6045, lng: 79.2700, radius: 1.5 },
  { label: "Sahayal Road", lat: 26.5650, lng: 79.3100, radius: 1.5 },
  { label: "Bidhuna Road", lat: 26.5400, lng: 79.2500, radius: 2.0 },
  { label: "Auraiya", lat: 26.4650, lng: 79.5140, radius: 3.0 },
];

const NAV_LINKS = [
  { href: "/", label: "Home", emoji: "⚡" },
  { href: "/directory", label: "Directory", emoji: "🏠" },
  { href: "/ask", label: "Ask", emoji: "📢" },
  { href: "/market", label: "Buy/Sell", emoji: "🛒" },
  { href: "/creators", label: "Creators", emoji: "🤳" },
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function resolveZone(lat: number, lng: number): string {
  let best = "Dibiyapur Area";
  let bestDist = Infinity;
  for (const z of ZONES) {
    if (z.label === "Auto Detect GPS") continue;
    const d = haversineKm(lat, lng, z.lat, z.lng);
    if (d < z.radius && d < bestDist) {
      best = z.label;
      bestDist = d;
    }
  }
  return best;
}

type GpsStatus = "idle" | "loading" | "success" | "error";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, business, logout, isAuthenticated } = useAuth();

  const [zone, setZone] = useState("NTPC Township");
  const [zoneOpen, setZoneOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<GpsStatus>("idle");
  const [gpsError, setGpsError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setZoneOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const detectGps = useCallback(() => {
    if (!navigator.geolocation) {
      setGpsError("GPS not supported");
      setGpsStatus("error");
      return;
    }
    setGpsStatus("loading");
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const resolved = resolveZone(pos.coords.latitude, pos.coords.longitude);
        setZone(resolved);
        setGpsStatus("success");
        setZoneOpen(false);
        setTimeout(() => setGpsStatus("idle"), 2000);
      },
      (err) => {
        setGpsError(
          err.code === 1 ? "Location permission denied" : "Unable to detect location"
        );
        setGpsStatus("error");
        setTimeout(() => setGpsStatus("idle"), 3000);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const selectZone = (label: string) => {
    if (label === "Auto Detect GPS") {
      detectGps();
    } else {
      setZone(label);
      setZoneOpen(false);
      setGpsError(null);
    }
  };

  const isOwner = user?.role === "business_owner" || !!business;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4">
          {/* ── Left: Brand Identity ── */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 group"
              id="brand-logo-btn"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-md group-hover:scale-105 transition-transform duration-200">
                <Zap className="h-5 w-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                    Dibiyapur<span className="text-orange-500">.Live</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-600 border border-emerald-500/20">
                    Auraiya
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 leading-tight">
                  Apna Digital Shahar
                </span>
              </div>
            </Link>
          </div>

          {/* ── Center: Desktop Navigation Links ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const targetHref =
                link.href === "/" || isAuthenticated
                  ? link.href
                  : `/auth?mode=resident&redirect=${encodeURIComponent(link.href)}`;

              return (
                <Link
                  key={link.href}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  href={targetHref}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <span>{link.emoji}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ── Right: Location & User Auth ── */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GPS Geolocation Chip */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center">
                <button
                  id="gps-detect-btn"
                  onClick={detectGps}
                  title="Detect GPS Location"
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-l-full border border-r-0 border-slate-200 bg-slate-50 transition-colors hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300 ${
                    gpsStatus === "loading" ? "animate-pulse text-orange-500" : "text-slate-500"
                  }`}
                >
                  {gpsStatus === "loading" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Crosshair className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  id="location-picker-btn"
                  onClick={() => setZoneOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-r-full border border-slate-200 bg-white py-1.5 px-2 sm:px-3 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50/30"
                >
                  <MapPin className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                  <span className="max-w-[75px] sm:max-w-[100px] truncate text-slate-800 font-bold">
                    {zone}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {zoneOpen && (
                  <div className="animate-fade-in absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl z-[60] py-1">
                    <div className="px-3 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Select Location
                      </span>
                    </div>

                    {ZONES.map((z) => {
                      const isGps = z.label === "Auto Detect GPS";
                      const isActive = zone === z.label;
                      return (
                        <button
                          key={z.label}
                          id={`zone-option-${z.label.replace(/\s+/g, "-").toLowerCase()}`}
                          onClick={() => selectZone(z.label)}
                          className={`flex w-full items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors hover:bg-orange-50 ${
                            isGps
                              ? "border-b border-slate-100 font-bold text-orange-600 bg-orange-50/50"
                              : isActive
                              ? "bg-orange-50 font-bold text-orange-600"
                              : "text-slate-700"
                          }`}
                        >
                          {isGps ? (
                            <Crosshair className="h-3.5 w-3.5 shrink-0" />
                          ) : isActive ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                          ) : (
                            <span className="h-1.5 w-1.5 shrink-0" />
                          )}
                          {z.label}
                        </button>
                      );
                    })}

                    {gpsError && (
                      <div className="px-4 py-2 text-[11px] text-red-500 bg-red-50 border-t border-red-100">
                        {gpsError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── User Auth & Profile Menu ── */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {/* Owner Dashboard Shortcut */}
                  {isOwner && (
                    <Link
                      href="/owner/dashboard"
                      className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 text-xs font-extrabold shadow-sm active:scale-95 transition-all"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Link>
                  )}

                  {/* Profile Trigger */}
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white p-1 sm:px-3 sm:py-1 text-xs font-bold text-slate-700 hover:shadow-sm"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-teal-500 text-white font-bold text-[10px]">
                      {isOwner ? "🏪" : "👤"}
                    </div>
                    <span className="hidden sm:inline max-w-[90px] truncate">
                      {isOwner ? business?.name || user?.name || "Shop Owner" : user?.name || "Resident"}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>

                  {/* Direct Logout Button */}
                  <button
                    onClick={() => {
                      logout();
                      router.push("/");
                    }}
                    title="Log Out"
                    className="hidden sm:flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="animate-fade-in absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl z-[60] p-1.5 space-y-1">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {user?.name || business?.name || "Account"}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {isOwner ? "🏪 Business Owner" : "👤 Local Resident"}
                        </p>
                      </div>

                      {isOwner ? (
                        <Link
                          href="/owner/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-xl"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          Owner Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/auth?mode=owner"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                        >
                          <Store className="h-3.5 w-3.5 text-orange-500" />
                          Register as Shop Owner
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                          router.push("/");
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth"
                    className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-white px-3.5 py-2 text-xs sm:text-sm font-extrabold shadow-sm active:scale-95 transition-all"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Login / Signup</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
