"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Store, Megaphone, ShoppingBag, Users2 } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Zap },
  { href: "/directory", label: "Directory", icon: Store },
  { href: "/ask", label: "Ask", icon: Megaphone },
  { href: "/market", label: "Buy/Sell", icon: ShoppingBag },
  { href: "/creators", label: "Creators", icon: Users2 },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-strong border-t border-slate-200/70 pb-safe">
      <div className="mx-auto flex max-w-lg items-stretch">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-bold transition-all duration-200 ${
                isActive ? "text-orange-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {isActive && (
                <span
                  className="absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full"
                  style={{ background: "linear-gradient(90deg, #f97316, #0d9488)" }}
                />
              )}
              <Icon
                className={`h-4 w-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
