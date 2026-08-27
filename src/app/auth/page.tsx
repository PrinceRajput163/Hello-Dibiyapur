'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMode = searchParams.get('mode') || 'resident';

  const [mode, setMode] = useState<'resident' | 'owner'>(initialMode === 'owner' ? 'owner' : 'resident');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [area, setArea] = useState('NTPC Township');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('Retail');

  useEffect(() => {
    if (initialMode === 'owner') setMode('owner');
  }, [initialMode]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert('Kripya 10-digit mobile number enter karein');
      return;
    }

    // Save session
    localStorage.setItem('dibiyapur_user_phone', phone);
    localStorage.setItem('dibiyapur_user_name', name || 'Resident');
    localStorage.setItem('dibiyapur_user_role', mode === 'owner' ? 'business_owner' : 'user');

    if (mode === 'owner') {
      router.push('/owner/dashboard');
    } else {
      router.push('/directory');
    }
  };

  return (
    <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-white">
      {/* Tab Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 rounded-2xl mb-8">
        <button
          type="button"
          onClick={() => setMode('resident')}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all ${mode === 'resident' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
        >
          Resident Login
        </button>
        <button
          type="button"
          onClick={() => setMode('owner')}
          className={`py-2.5 text-xs font-bold rounded-xl transition-all ${mode === 'owner' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
        >
          Shop Owner
        </button>
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === 'resident' ? 'Welcome to Dibiyapur Live' : 'Register Your Business'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {mode === 'resident' ? 'Enter details to explore local services' : 'Reach 20,000+ local Dibiyapur customers'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Your Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {mode === 'owner' && (
          <>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Shop / Business Name
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="e.g. Sharma Sweets & Cafe"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Retail">Retail & General Store</option>
                <option value="Food">Food & Restaurants</option>
                <option value="Medical">Medical & Pharmacy</option>
                <option value="Services">Electronics & Repair</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Area / Locality
          </label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="NTPC Township">NTPC Township</option>
            <option value="GAIL Colony">GAIL Colony</option>
            <option value="Phaphund Road">Phaphund Road</option>
            <option value="Sahayal Road">Sahayal Road</option>
            <option value="Bidhuna Road">Bidhuna Road</option>
            <option value="Auraiya City">Auraiya City</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Mobile Number (WhatsApp)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm font-semibold">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          {mode === 'resident' ? 'Continue to Dibiyapur Live →' : 'Create Storefront Now →'}
        </button>
      </form>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Suspense fallback={<div className="text-emerald-400 font-semibold text-sm">Loading Auth Portal...</div>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}