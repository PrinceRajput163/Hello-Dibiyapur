"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2, Lock } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const storedPhone = typeof window !== "undefined" ? localStorage.getItem("dibiyapur_user_phone") : null;
      if (!user && !storedPhone) {
        router.replace(`/auth?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <p className="text-xs font-bold text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  const storedPhone = typeof window !== "undefined" ? localStorage.getItem("dibiyapur_user_phone") : null;
  if (!user && !storedPhone) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="p-4 rounded-3xl bg-orange-50 border border-orange-200 text-orange-600">
          <Lock className="h-8 w-8" />
        </div>
        <p className="text-sm font-extrabold text-slate-800">Redirecting to Auth Gate...</p>
      </div>
    );
  }

  return <>{children}</>;
}
