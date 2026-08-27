"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { UserProfile, UserRole, Business } from "./types";
import { supabase } from "./supabase";

interface AuthContextType {
  user: UserProfile | null;
  business: Business | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, name?: string) => Promise<boolean>;
  registerUser: (data: { name: string; phone: string; area_zone: string }) => Promise<UserProfile>;
  registerBusinessOwner: (data: {
    owner_name: string;
    business_name: string;
    category: string;
    address: string;
    phone: string;
    whatsapp: string;
    area_zone: string;
    has_delivery: boolean;
    opening_time?: string;
    closing_time?: string;
    description?: string;
  }) => Promise<{ user: UserProfile; business: Business }>;
  updateBusiness: (updates: Partial<Business>) => Promise<Business | null>;
  logout: () => void;
  recordLead: (type: "call" | "whatsapp" | "view", businessId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "dibiyapur_live_user";
const LOCAL_STORAGE_BIZ_KEY = "dibiyapur_live_business";
const PHONE_KEY = "dibiyapur_user_phone";
const ROLE_KEY = "dibiyapur_user_role";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
      const storedBiz = localStorage.getItem(LOCAL_STORAGE_BIZ_KEY);
      const storedPhone = localStorage.getItem(PHONE_KEY);
      const storedRole = (localStorage.getItem(ROLE_KEY) as UserRole) || "user";

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (storedPhone) {
        // Construct fallback user from phone
        setUser({
          id: "u_" + Date.now(),
          name: storedRole === "business_owner" ? "Shop Owner" : "Resident User",
          phone: storedPhone,
          role: storedRole,
          area_zone: "NTPC Township",
          created_at: new Date().toISOString(),
        });
      }

      if (storedBiz) {
        setBusiness(JSON.parse(storedBiz));
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSession = (u: UserProfile | null, b: Business | null = null) => {
    setUser(u);
    setBusiness(b);
    if (u) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(u));
      localStorage.setItem(PHONE_KEY, u.phone);
      localStorage.setItem(ROLE_KEY, u.role);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem(PHONE_KEY);
      localStorage.removeItem(ROLE_KEY);
    }
    if (b) {
      localStorage.setItem(LOCAL_STORAGE_BIZ_KEY, JSON.stringify(b));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_BIZ_KEY);
    }
  };

  const registerUser = async (data: { name: string; phone: string; area_zone: string }): Promise<UserProfile> => {
    const cleanPhone = data.phone.trim().replace(/\D/g, "");
    const newUser: UserProfile = {
      id: "u_" + Date.now(),
      name: data.name.trim(),
      phone: cleanPhone,
      role: "user",
      area_zone: data.area_zone,
      created_at: new Date().toISOString(),
    };

    saveSession(newUser, null);
    return newUser;
  };

  const registerBusinessOwner = async (data: {
    owner_name: string;
    business_name: string;
    category: string;
    address: string;
    phone: string;
    whatsapp: string;
    area_zone: string;
    has_delivery: boolean;
    opening_time?: string;
    closing_time?: string;
    description?: string;
  }): Promise<{ user: UserProfile; business: Business }> => {
    const bizId = "b_" + Date.now();
    const cleanPhone = data.phone.trim().replace(/\D/g, "");
    const cleanWhatsapp = data.whatsapp.trim().replace(/\D/g, "") || cleanPhone;

    const newBiz: Business = {
      id: bizId,
      name: data.business_name.trim(),
      owner_name: data.owner_name.trim(),
      category: data.category,
      address: data.address.trim(),
      area_zone: data.area_zone,
      phone: cleanPhone,
      whatsapp: cleanWhatsapp,
      is_open: true,
      has_delivery: data.has_delivery,
      opening_time: data.opening_time || "09:00 AM",
      closing_time: data.closing_time || "09:00 PM",
      description: data.description?.trim() || "",
      call_leads: 0,
      whatsapp_leads: 0,
      view_leads: 1,
      created_at: new Date().toISOString(),
    };

    try {
      await supabase.from("businesses").insert([{
        name: newBiz.name,
        category: newBiz.category,
        area_zone: newBiz.area_zone,
        phone: newBiz.phone,
        is_open: newBiz.is_open,
        has_delivery: newBiz.has_delivery,
      }]);
    } catch {
      // optimistic
    }

    const newUser: UserProfile = {
      id: "u_" + Date.now(),
      name: data.owner_name.trim(),
      phone: cleanPhone,
      role: "business_owner",
      area_zone: data.area_zone,
      business_id: bizId,
      business_name: data.business_name.trim(),
      created_at: new Date().toISOString(),
    };

    saveSession(newUser, newBiz);
    return { user: newUser, business: newBiz };
  };

  const login = async (phone: string, name?: string): Promise<boolean> => {
    const cleanPhone = phone.trim().replace(/\D/g, "");
    const isLikelyOwner = cleanPhone.endsWith("0");

    const demoUser: UserProfile = {
      id: "u_" + Date.now(),
      name: name || (isLikelyOwner ? "Sharma Ji (Owner)" : "Ramesh Kumar"),
      phone: cleanPhone,
      role: isLikelyOwner ? "business_owner" : "user",
      area_zone: "NTPC Township",
      business_name: isLikelyOwner ? "Sharma Electronics & Hardware" : undefined,
      business_id: isLikelyOwner ? "b_demo" : undefined,
      created_at: new Date().toISOString(),
    };

    const demoBiz: Business | null = isLikelyOwner
      ? {
          id: "b_demo",
          name: "Sharma Electronics & Hardware",
          owner_name: demoUser.name,
          category: "Electrician",
          address: "Shop #14, Main Market, NTPC Gate Road, Dibiyapur",
          area_zone: "NTPC Township",
          phone: cleanPhone,
          whatsapp: cleanPhone,
          is_open: true,
          has_delivery: true,
          opening_time: "09:00 AM",
          closing_time: "09:00 PM",
          description: "All types of electrical fittings, inverters, house wiring and instant repairing service.",
          call_leads: 48,
          whatsapp_leads: 132,
          view_leads: 520,
          created_at: new Date().toISOString(),
        }
      : null;

    saveSession(demoUser, demoBiz);
    return true;
  };

  const updateBusiness = async (updates: Partial<Business>): Promise<Business | null> => {
    if (!business) return null;
    const updated = { ...business, ...updates };
    setBusiness(updated);
    localStorage.setItem(LOCAL_STORAGE_BIZ_KEY, JSON.stringify(updated));

    try {
      await supabase
        .from("businesses")
        .update({
          is_open: updated.is_open,
          has_delivery: updated.has_delivery,
          phone: updated.phone,
          name: updated.name,
        })
        .eq("name", updated.name);
    } catch {
      // optimistic
    }

    return updated;
  };

  const recordLead = (type: "call" | "whatsapp" | "view", businessId?: string) => {
    if (business && (!businessId || business.id === businessId)) {
      const updated = {
        ...business,
        call_leads: (business.call_leads || 0) + (type === "call" ? 1 : 0),
        whatsapp_leads: (business.whatsapp_leads || 0) + (type === "whatsapp" ? 1 : 0),
        view_leads: (business.view_leads || 0) + (type === "view" ? 1 : 0),
      };
      setBusiness(updated);
      localStorage.setItem(LOCAL_STORAGE_BIZ_KEY, JSON.stringify(updated));
    }
  };

  const logout = () => {
    saveSession(null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        business,
        loading,
        isAuthenticated: !!user,
        login,
        registerUser,
        registerBusinessOwner,
        updateBusiness,
        logout,
        recordLead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
