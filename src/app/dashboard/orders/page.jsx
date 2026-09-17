'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, FileText, CheckCircle2, Printer, ArrowLeft, Loader2 } from 'lucide-react';
export default function OrderHistoryPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/orders/my-orders');
                const data = await res.json();
                if (data.success && data.orders) {
                    setOrders(data.orders);
                }
            }
            catch (err) {
                console.error('Error fetching orders:', err);
            }
            finally {
                setLoading(false);
            }
        }
        if (user) {
            fetchOrders();
        }
    }, [user]);
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500"/>
      </div>);
    }
    return (<div className="relative min-h-screen py-10">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-20 left-10 h-80 w-80 bg-brand-600/10"/>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">
                <ArrowLeft className="h-4 w-4"/>
              </Link>
              <h1 className="text-2xl font-extrabold text-white">Order History & Invoices</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              View transaction receipts and print formal tax invoices for expense reporting
            </p>
          </div>
        </div>

        {orders.length === 0 ? (<div className="rounded-2xl bg-slate-900 border border-slate-800 p-12 text-center space-y-3">
            <ShoppingBag className="h-10 w-10 text-slate-500 mx-auto"/>
            <h3 className="text-base font-bold text-white">No Orders Found</h3>
            <p className="text-xs text-slate-400">You have not completed any purchases yet.</p>
            <Link href="/" className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold">
              Browse Catalog
            </Link>
          </div>) : (<div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Order ID</th>
                    <th className="py-3.5 px-4 font-semibold">Course Guide</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Amount Paid</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {orders.map((ord) => (<tr key={ord._id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-medium text-white">{ord.orderNumber}</td>
                      <td className="py-4 px-4 font-semibold text-slate-200">
                        <span className="line-clamp-1">{ord.guideTitle}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                })}
                      </td>
                      <td className="py-4 px-4 font-bold text-white">₹{ord.amount}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${ord.status === 'success'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>
                          <CheckCircle2 className="h-3 w-3"/>
                          {ord.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => setSelectedInvoice(ord)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium text-xs transition-colors">
                          <FileText className="h-3.5 w-3.5 text-brand-400"/>
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 p-8 shadow-2xl space-y-6 text-slate-200">
            
            {/* Modal Actions */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-400"/>
                <h3 className="text-base font-bold text-white">Tax Invoice Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white">
                  <Printer className="h-3.5 w-3.5"/> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300">
                  Close
                </button>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="space-y-6 text-xs bg-slate-950 p-6 rounded-xl border border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-white">LearnForge Academy</h2>
                  <p className="text-slate-400">Digital Digital Rights Managed Learning Platform</p>
                  <p className="text-slate-500 text-[11px]">GSTIN: 27AABCL1234F1Z5</p>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-brand-400 block">{selectedInvoice.orderNumber}</span>
                  <span className="text-slate-400 text-[11px]">
                    Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Billed To:</span>
                  <p className="font-bold text-white">{selectedInvoice.customerDetails?.name || user?.name}</p>
                  <p className="text-slate-400">{selectedInvoice.customerDetails?.email || user?.email}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Gateway:</span>
                  <p className="font-bold uppercase text-slate-300">{selectedInvoice.paymentGateway}</p>
                  <p className="font-mono text-[10px] text-slate-500">{selectedInvoice.paymentGatewayPaymentId || 'VERIFIED'}</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <table className="w-full text-left">
                  <thead className="border-b border-slate-800 text-slate-400 font-semibold">
                    <tr>
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">Discount</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-3 font-semibold text-white">
                        {selectedInvoice.guideTitle}
                        <span className="block text-[10px] text-slate-500 font-normal">Digital In-Browser DRM License</span>
                      </td>
                      <td className="py-3 text-right">₹{selectedInvoice.originalPrice || selectedInvoice.amount}</td>
                      <td className="py-3 text-right text-emerald-400">-₹{selectedInvoice.discountAmount || 0}</td>
                      <td className="py-3 text-right font-bold text-white">₹{selectedInvoice.amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-300">Total Paid:</span>
                <span className="text-xl text-white">₹{selectedInvoice.amount}</span>
              </div>
            </div>

          </div>
        </div>)}

    </div>);
}
