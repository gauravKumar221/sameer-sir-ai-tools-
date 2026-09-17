'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, ShieldCheck, Tag, CreditCard, CheckCircle2, ArrowRight, Sparkles, Lock, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
export default function CheckoutPage() {
    const params = useParams();
    const guideId = params?.id;
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    // Checkout calculation state
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [selectedGateway, setSelectedGateway] = useState('test');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(null);
    const [checkoutError, setCheckoutError] = useState(null);
    useEffect(() => {
        async function fetchGuide() {
            if (!guideId)
                return;
            setLoading(true);
            try {
                const res = await fetch(`/api/guides/${guideId}`);
                const data = await res.json();
                if (data.success && data.guide) {
                    setGuide(data.guide);
                    if (data.access?.isPurchased) {
                        // User already owns this guide
                        router.push(`/dashboard/reader/${data.guide.id || data.guide._id}`);
                    }
                }
            }
            catch (err) {
                console.error('Error loading checkout guide:', err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchGuide();
    }, [guideId, router]);
    // Apply Coupon
    const handleApplyCoupon = async () => {
        if (!couponCode.trim() || !guide)
            return;
        setCouponLoading(true);
        setCouponError(null);
        try {
            const res = await fetch('/api/coupons/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: couponCode.trim(),
                    orderAmount: guide.price,
                }),
            });
            const data = await res.json();
            if (data.success && data.coupon) {
                setAppliedCoupon(data.coupon);
                setCouponError(null);
            }
            else {
                setAppliedCoupon(null);
                setCouponError(data.error || 'Invalid coupon code');
            }
        }
        catch {
            setCouponError('Error validating coupon');
        }
        finally {
            setCouponLoading(false);
        }
    };
    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
    };
    // Calculations
    const basePrice = guide?.price || 0;
    const couponDiscount = appliedCoupon ? appliedCoupon.calculatedDiscount : 0;
    const finalAmount = Math.max(0, Math.round(basePrice - couponDiscount));
    // Execute Checkout Payment
    const handleCompletePayment = async () => {
        if (!user) {
            router.push(`/login?redirect=/checkout/${guideId}`);
            return;
        }
        setIsProcessing(true);
        setCheckoutError(null);
        try {
            // 1. Create Order on Server
            const orderRes = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guideId: guide.id || guide._id,
                    couponCode: appliedCoupon?.code || '',
                    redeemPoints: 0,
                    paymentGateway: selectedGateway,
                }),
            });
            const orderData = await orderRes.json();
            if (!orderData.success) {
                throw new Error(orderData.error || 'Failed to create order');
            }
            // 2. Verify Payment (simulated sandbox or gateway webhook verification)
            const verifyRes = await fetch('/api/orders/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: orderData.order.id,
                    paymentId: `SIM_${Date.now()}_${selectedGateway.toUpperCase()}`,
                    signature: 'MOCK_VERIFIED_SIGNATURE',
                    gateway: selectedGateway,
                }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
                throw new Error(verifyData.error || 'Payment verification failed');
            }
            // 3. Trigger Confetti celebration
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
            });
            setPaymentSuccess(verifyData.order);
            await refreshUser();
        }
        catch (err) {
            console.error('Checkout error:', err);
            setCheckoutError(err.message || 'Payment processing failed');
        }
        finally {
            setIsProcessing(false);
        }
    };
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500"/>
      </div>);
    }
    if (!guide) {
        return (<div className="min-h-screen flex items-center justify-center p-4">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-8 text-center max-w-md">
          <AlertCircle className="h-10 w-10 text-rose-400 mx-auto mb-3"/>
          <h2 className="text-base font-bold text-white">Course Not Found</h2>
          <Link href="/" className="mt-4 inline-block text-xs text-brand-400 hover:underline">
            Return to Store
          </Link>
        </div>
      </div>);
    }
    return (<div className="relative min-h-screen py-12">
      
      {/* Ambient glow */}
      <div className="ambient-glow top-20 left-1/4 h-80 w-80 bg-brand-600/10"/>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href={`/guides/${guide.slug}`} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5"/> Back to Course Overview
          </Link>
          <h1 className="text-2xl font-extrabold text-white mt-2">Secure Checkout</h1>
          <p className="text-xs text-slate-400">Complete your purchase to gain instant in-browser DRM reader access</p>
        </div>

        {/* Success Modal / Screen */}
        {paymentSuccess ? (<div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-8 text-center space-y-6 max-w-xl mx-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <CheckCircle2 className="h-9 w-9"/>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Payment Successful</span>
              <h2 className="text-2xl font-extrabold text-white">You&apos;re Enrolled!</h2>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Your order <span className="font-mono font-semibold text-white">#{paymentSuccess.orderNumber}</span> has been confirmed. The digital course handbook is now unlocked in your library.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href={`/dashboard/reader/${guide.id || guide._id}`} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-brand-500/30 transition-transform hover:scale-105">
                <BookOpen className="h-4 w-4"/>
                <span>Open in DRM Canvas Reader</span>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                View My Purchases
              </Link>
            </div>
          </div>) : (<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Order Summary, Discounts & Payment Gateways */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Item Card */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex gap-4 items-center">
                <div className="h-20 w-28 rounded-xl overflow-hidden bg-slate-950 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={guide.coverImage} alt={guide.title} className="h-full w-full object-cover"/>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider">{guide.category}</span>
                  <h3 className="text-sm font-bold text-white truncate">{guide.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{guide.pdfFiles?.length || 1} Document</span>
                    <span>•</span>
                    <span className="text-emerald-400 flex items-center gap-1"><ShieldCheck className="h-3 w-3"/> DRM Protected</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-white">₹{guide.price}</span>
                  {guide.originalPrice && (<span className="text-xs text-slate-500 block line-through">₹{guide.originalPrice}</span>)}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-brand-400"/>
                  Have a Coupon or Promo Code?
                </h4>
                
                {appliedCoupon ? (<div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-xs">
                    <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                      <CheckCircle2 className="h-4 w-4"/>
                      <span>Code <strong>{appliedCoupon.code}</strong> applied (-₹{appliedCoupon.calculatedDiscount})</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs text-rose-400 hover:underline font-semibold">
                      Remove
                    </button>
                  </div>) : (<div className="flex gap-2">
                    <input type="text" placeholder="e.g. WELCOME50, PRO20, MEGA50" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 focus:outline-none focus:border-brand-500 font-mono"/>
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()} className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-50 transition-colors">
                      {couponLoading ? 'Checking...' : 'Apply Code'}
                    </button>
                  </div>)}

                {couponError && (<p className="text-xs text-rose-400">{couponError}</p>)}

                <p className="text-[11px] text-slate-500">
                  Tip: Try demo coupons <code className="text-brand-300 font-mono">WELCOME50</code> for ₹50 off or <code className="text-brand-300 font-mono">PRO20</code> for 20% off.
                </p>
              </div>

              {/* Payment Gateway Selector */}
              <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-brand-400"/>
                  Select Payment Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Instant Test / Sandbox Gateway */}
                  <button type="button" onClick={() => setSelectedGateway('test')} className={`p-3.5 rounded-xl border text-left transition-all ${selectedGateway === 'test'
                ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-400"/> Sandbox Test
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Instant 1-click test checkout</span>
                  </button>

                  {/* Razorpay Gateway */}
                  <button type="button" onClick={() => setSelectedGateway('razorpay')} className={`p-3.5 rounded-xl border text-left transition-all ${selectedGateway === 'razorpay'
                ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Razorpay (India)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">UPI, Cards, NetBanking</span>
                  </button>

                  {/* Stripe Gateway */}
                  <button type="button" onClick={() => setSelectedGateway('stripe')} className={`p-3.5 rounded-xl border text-left transition-all ${selectedGateway === 'stripe'
                ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white">Stripe</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Global Visa/Mastercard</span>
                  </button>

                </div>
              </div>

            </div>

            {/* Right Col: Price Breakdown & Purchase Action */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 shadow-2xl">
                
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Payment Breakdown</h3>

                <div className="space-y-3 text-xs border-b border-slate-800 pb-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Course Guide Price</span>
                    <span>₹{basePrice}</span>
                  </div>

                  {couponDiscount > 0 && (<div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>)}

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>DRM Viewer License</span>
                    <span className="text-emerald-400 font-medium">Included</span>
                  </div>
                </div>

                {/* Final Total */}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">Final Payable</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">₹{finalAmount}</span>
                    <span className="block text-[10px] text-slate-400">Taxes inclusive</span>
                  </div>
                </div>

                {checkoutError && (<div className="rounded-xl bg-rose-950/60 border border-rose-800/60 p-3 text-xs text-rose-200">
                    {checkoutError}
                  </div>)}

                {/* Submit Checkout Button */}
                {user ? (<button onClick={handleCompletePayment} disabled={isProcessing} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-brand-500/25 disabled:opacity-50 transition-all hover:scale-[1.02]">
                    {isProcessing ? (<>
                        <Loader2 className="h-4 w-4 animate-spin"/>
                        <span>Verifying & Granting Access...</span>
                      </>) : (<>
                        <Lock className="h-4 w-4"/>
                        <span>Pay ₹{finalAmount} & Unlock Guide</span>
                      </>)}
                  </button>) : (<Link href={`/login?redirect=/checkout/${guideId}`} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xl shadow-brand-500/25 transition-all">
                    <span>Login to Complete Purchase</span>
                    <ArrowRight className="h-4 w-4"/>
                  </Link>)}

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400"/>
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>

              </div>
            </div>

          </div>)}

      </div>
    </div>);
}
