'use client';
import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, Loader2 } from 'lucide-react';
export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [gatewayFilter, setGatewayFilter] = useState('All');
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams();
            if (search)
                q.set('search', search);
            if (statusFilter !== 'All')
                q.set('status', statusFilter);
            if (gatewayFilter !== 'All')
                q.set('gateway', gatewayFilter);
            const res = await fetch(`/api/admin/orders?${q.toString()}`);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders || []);
            }
        }
        catch (err) {
            console.error('Error fetching admin orders:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrders();
        }, 200);
        return () => clearTimeout(timer);
    }, [search, statusFilter, gatewayFilter]);
    return (<div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Orders & Transaction Logs</h1>
          <p className="text-xs text-slate-400 mt-1">Audit customer purchases, gateway settlement IDs, and coupon redemptions</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 text-xs flex-1 min-w-[200px] max-w-md">
          <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0"/>
          <input type="text" placeholder="Search order #, customer email, or course..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"/>
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-300 focus:outline-none">
          <option value="All">All Statuses</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select value={gatewayFilter} onChange={(e) => setGatewayFilter(e.target.value)} className="rounded-xl bg-slate-900 border border-slate-800 py-2 px-3 text-xs text-slate-300 focus:outline-none">
          <option value="All">All Gateways</option>
          <option value="test">Sandbox Test</option>
          <option value="razorpay">Razorpay</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (<div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500"/>
        </div>) : orders.length === 0 ? (<div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center text-xs text-slate-400">
          No orders match your filter criteria.
        </div>) : (<div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Order ID</th>
                  <th className="py-3.5 px-4 font-semibold">Customer</th>
                  <th className="py-3.5 px-4 font-semibold">Course Title</th>
                  <th className="py-3.5 px-4 font-semibold">Amount Paid</th>
                  <th className="py-3.5 px-4 font-semibold">Gateway</th>
                  <th className="py-3.5 px-4 font-semibold">Points Earned</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((ord) => (<tr key={ord._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-200 block">{ord.customerDetails?.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{ord.customerDetails?.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      <span className="line-clamp-1 max-w-xs">{ord.guideTitle}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{ord.amount}
                      {ord.discountAmount > 0 && (<span className="text-[10px] text-emerald-400 block font-normal">(-₹{ord.discountAmount} disc)</span>)}
                    </td>
                    <td className="py-3.5 px-4 font-mono uppercase text-slate-400">
                      {ord.paymentGateway}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-amber-300">
                      {ord.pointsEarned > 0 ? `+${ord.pointsEarned} pts` : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ord.status === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                        <CheckCircle2 className="h-3 w-3"/>
                        {ord.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

    </div>);
}
