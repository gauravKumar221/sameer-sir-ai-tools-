'use client';
import React, { useEffect, useState } from 'react';
import { Tag, Plus, Trash2, X, Loader2 } from 'lucide-react';
export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    // Form Fields
    const [code, setCode] = useState('');
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(20);
    const [minOrderAmount, setMinOrderAmount] = useState(299);
    const [maxDiscount, setMaxDiscount] = useState(200);
    const [usageLimit, setUsageLimit] = useState(1000);
    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/coupons');
            const data = await res.json();
            if (data.success) {
                setCoupons(data.coupons || []);
            }
        }
        catch (err) {
            console.error('Error fetching coupons:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCoupons();
    }, []);
    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    discountType,
                    discountValue: Number(discountValue),
                    minOrderAmount: Number(minOrderAmount),
                    maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
                    usageLimit: Number(usageLimit),
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to create coupon');
            }
            setModalOpen(false);
            setCode('');
            fetchCoupons();
        }
        catch (err) {
            alert(err.message || 'Error creating coupon');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDeleteCoupon = async (id, couponCode) => {
        if (!confirm(`Delete coupon "${couponCode}"?`))
            return;
        try {
            const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchCoupons();
            }
        }
        catch (err) {
            console.error('Delete coupon error:', err);
        }
    };
    return (<div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Coupons & Promo Codes</h1>
          <p className="text-xs text-slate-400 mt-1">Configure percentage discounts and flat value promo vouchers</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20">
          <Plus className="h-4 w-4"/>
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      {loading ? (<div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500"/>
        </div>) : coupons.length === 0 ? (<div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center text-xs text-slate-400">
          No active coupons found. Create a promo code to offer checkout discounts.
        </div>) : (<div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Coupon Code</th>
                <th className="py-3.5 px-4 font-semibold">Discount Type</th>
                <th className="py-3.5 px-4 font-semibold">Value</th>
                <th className="py-3.5 px-4 font-semibold">Min Order</th>
                <th className="py-3.5 px-4 font-semibold">Usage</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {coupons.map((c) => (<tr key={c._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                    {c.code}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-purple-300">
                    {c.discountType}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                    {c.maxDiscount && <span className="text-[10px] text-slate-400 block font-normal">(up to ₹{c.maxDiscount})</span>}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">
                    ₹{c.minOrderAmount || 0}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {c.usedCount || 0} / {c.usageLimit || '∞'}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button onClick={() => handleDeleteCoupon(c._id, c.code)} className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 transition-colors" title="Delete Coupon">
                      <Trash2 className="h-3.5 w-3.5"/>
                    </button>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>)}

      {/* Create Coupon Modal */}
      {modalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-400"/>
                <span>Create New Coupon</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Coupon Code (Uppercase) *</label>
                <input type="text" required placeholder="e.g. FLASH50, SPECIAL20" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white uppercase font-mono focus:outline-none focus:border-purple-500"/>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Discount Type</label>
                  <select value={discountType} onChange={(e) => setDiscountType(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Discount Value *</label>
                  <input type="number" required min={1} value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Min Order Amount (₹)</label>
                  <input type="number" min={0} value={minOrderAmount} onChange={(e) => setMinOrderAmount(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>

                {discountType === 'percentage' && (<div className="space-y-1">
                    <label className="font-semibold text-slate-300">Max Cap (₹)</label>
                    <input type="number" min={0} value={maxDiscount} onChange={(e) => setMaxDiscount(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                  </div>)}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-50">
                  {saving ? 'Creating...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

    </div>);
}
