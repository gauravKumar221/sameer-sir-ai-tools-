'use client';
import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Coins, CreditCard, CheckCircle2, Save, Loader2 } from 'lucide-react';
export default function AdminSettingsPage() {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);
    // Form states
    const [platformName, setPlatformName] = useState('LearnForge PDF Academy');
    const [pointsEarnRate, setPointsEarnRate] = useState(10);
    const [pointsRedeemRate, setPointsRedeemRate] = useState(0.5);
    const [supportEmail, setSupportEmail] = useState('support@learnforge.io');
    const [testGatewayEnabled, setTestGatewayEnabled] = useState(true);
    const [razorpayEnabled, setRazorpayEnabled] = useState(true);
    const [razorpayKeyId, setRazorpayKeyId] = useState('');
    const [razorpayKeySecret, setRazorpayKeySecret] = useState('');
    const [stripeEnabled, setStripeEnabled] = useState(true);
    const [stripePublishableKey, setStripePublishableKey] = useState('');
    const [stripeSecretKey, setStripeSecretKey] = useState('');
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/admin/settings');
                const data = await res.json();
                if (data.success && data.settings) {
                    const s = data.settings;
                    setSettings(s);
                    setPlatformName(s.platformName || 'LearnForge PDF Academy');
                    setPointsEarnRate(s.pointsEarnRate ?? 10);
                    setPointsRedeemRate(s.pointsRedeemRate ?? 0.5);
                    setSupportEmail(s.supportEmail || 'support@learnforge.io');
                    setTestGatewayEnabled(s.testGatewayEnabled ?? true);
                    setRazorpayEnabled(s.razorpayEnabled ?? true);
                    setRazorpayKeyId(s.razorpayKeyId || '');
                    setRazorpayKeySecret(s.razorpayKeySecret || '');
                    setStripeEnabled(s.stripeEnabled ?? true);
                    setStripePublishableKey(s.stripePublishableKey || '');
                    setStripeSecretKey(s.stripeSecretKey || '');
                }
            }
            catch (err) {
                console.error('Error fetching settings:', err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchSettings();
    }, []);
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccessMsg(null);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    platformName,
                    pointsEarnRate: Number(pointsEarnRate),
                    pointsRedeemRate: Number(pointsRedeemRate),
                    supportEmail,
                    testGatewayEnabled,
                    razorpayEnabled,
                    razorpayKeyId,
                    razorpayKeySecret,
                    stripeEnabled,
                    stripePublishableKey,
                    stripeSecretKey,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to save settings');
            }
            setSuccessMsg('Settings updated successfully!');
            setTimeout(() => setSuccessMsg(null), 4000);
        }
        catch (err) {
            alert(err.message || 'Failed to update settings');
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (<div className="py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500"/>
      </div>);
    }
    return (<div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Platform & Loyalty Configuration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure cashback points earning rates, checkout redemption rules, and payment gateways
          </p>
        </div>
      </div>

      {successMsg && (<div className="flex items-center gap-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 p-4 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400"/>
          <span>{successMsg}</span>
        </div>)}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Points & Loyalty Engine Card */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Coins className="h-5 w-5 text-amber-400"/>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Points & Rewards Rules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Points Earn Rate (% of ₹ Spent)</label>
              <input type="number" min={0} max={100} value={pointsEarnRate} onChange={(e) => setPointsEarnRate(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-white focus:outline-none focus:border-amber-500 font-mono"/>
              <p className="text-[11px] text-slate-500">
                Example: 10 means a customer gets 10 points for every ₹100 spent (10% reward).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Point Redemption Value (₹ per 1 pt)</label>
              <input type="number" step="0.05" min={0.01} value={pointsRedeemRate} onChange={(e) => setPointsRedeemRate(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-white focus:outline-none focus:border-amber-500 font-mono"/>
              <p className="text-[11px] text-slate-500">
                Example: 0.50 means 100 points will give a ₹50 discount on checkout.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Gateways Config */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <CreditCard className="h-5 w-5 text-brand-400"/>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payment Gateways & Keys</h3>
          </div>

          {/* Sandbox Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Simulated Sandbox Test Gateway</span>
              <span className="text-[11px] text-slate-400">Allows instant 1-click test purchases in development</span>
            </div>
            <label className="cursor-pointer">
              <input type="checkbox" checked={testGatewayEnabled} onChange={(e) => setTestGatewayEnabled(e.target.checked)} className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-purple-600"/>
            </label>
          </div>

          {/* Razorpay Options */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Razorpay (India Gateway)</span>
              <label className="cursor-pointer">
                <input type="checkbox" checked={razorpayEnabled} onChange={(e) => setRazorpayEnabled(e.target.checked)} className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-purple-600"/>
              </label>
            </div>
            {razorpayEnabled && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Key ID</label>
                  <input type="text" value={razorpayKeyId} onChange={(e) => setRazorpayKeyId(e.target.value)} placeholder="rzp_live_xxx / rzp_test_xxx" className="w-full rounded-lg bg-slate-900 border border-slate-800 py-1.5 px-3 text-white font-mono"/>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Key Secret</label>
                  <input type="password" value={razorpayKeySecret} onChange={(e) => setRazorpayKeySecret(e.target.value)} placeholder="••••••••••••" className="w-full rounded-lg bg-slate-900 border border-slate-800 py-1.5 px-3 text-white font-mono"/>
                </div>
              </div>)}
          </div>

          {/* Stripe Options */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Stripe (Global Gateway)</span>
              <label className="cursor-pointer">
                <input type="checkbox" checked={stripeEnabled} onChange={(e) => setStripeEnabled(e.target.checked)} className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-purple-600"/>
              </label>
            </div>
            {stripeEnabled && (<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Publishable Key</label>
                  <input type="text" value={stripePublishableKey} onChange={(e) => setStripePublishableKey(e.target.value)} placeholder="pk_live_xxx / pk_test_xxx" className="w-full rounded-lg bg-slate-900 border border-slate-800 py-1.5 px-3 text-white font-mono"/>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Secret Key</label>
                  <input type="password" value={stripeSecretKey} onChange={(e) => setStripeSecretKey(e.target.value)} placeholder="sk_live_xxx / sk_test_xxx" className="w-full rounded-lg bg-slate-900 border border-slate-800 py-1.5 px-3 text-white font-mono"/>
                </div>
              </div>)}
          </div>
        </div>

        {/* General Settings */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <SettingsIcon className="h-5 w-5 text-purple-400"/>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">General Platform Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Platform Brand Name</label>
              <input type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-white focus:outline-none focus:border-purple-500"/>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Support / Invoicing Email</label>
              <input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-white focus:outline-none focus:border-purple-500"/>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/25 disabled:opacity-50 transition-all hover:scale-105">
            {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Save className="h-4 w-4"/>}
            <span>Save All Configurations</span>
          </button>
        </div>

      </form>

    </div>);
}
