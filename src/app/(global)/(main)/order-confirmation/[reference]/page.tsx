"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api/axios'; 
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface RedirectContext {
    org_slug?: string;
    type: 'organization' | 'global' | 'course' | 'event';
}

const GeometricLoader = () => (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
            <div className="relative h-16 w-16 flex items-center justify-center">
                <motion.div
                    animate={{ 
                        rotate: [0, 90, 180, 270, 360],
                        borderRadius: ["15%", "0%", "15%", "0%", "15%"] 
                    }}
                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                    className="absolute h-12 w-12 border-2 border-[#2694C6]/30"
                />
                <motion.div
                    animate={{ 
                        scale: [0.6, 1, 0.6],
                        rotate: [0, -90, -180, -270, -360],
                    }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                    className="h-6 w-6 bg-[#2694C6] rounded-sm shadow-xl shadow-[#2694C6]/20"
                />
            </div>
            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-[#2694C6]">
                Verifying
            </p>
        </div>
    </div>
);

function OrderConfirmationContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCart();
    const { fetchCurrentUser } = useAuth(); 
    
    const [status, setStatus] = useState('verifying'); 
    const [error, setError] = useState<string | null>(null);
    const [redirectContext, setRedirectContext] = useState<RedirectContext | null>(null); 
    
    useEffect(() => {
        const reference = (params.reference as string) || searchParams.get('reference');

        if (!reference) {
            setStatus('failed');
            setError('No payment reference found.');
            return;
        }

        const verifyTransaction = async () => {
            try {
                const response = await api.get(`/payments/verify/${reference}/`);
                setStatus('success');
                clearCart(); 
                await fetchCurrentUser();
                setRedirectContext(response.data.redirect_context || { type: 'global' }); 
            } catch (err: any) {
                setStatus('failed');
                setError(err.response?.data?.message || err.response?.data?.error || 'Verification failed.');
            }
        };

        verifyTransaction();
    }, [params, searchParams, clearCart, fetchCurrentUser]);

    const finalUrl = redirectContext?.type === 'organization' && redirectContext.org_slug 
        ? `/${redirectContext.org_slug}/dashboard` 
        : '/dashboard';

    if (status === 'verifying') return <GeometricLoader />;

    return (
        <div className="w-full max-w-[480px] pt-20">
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-md p-8 md:p-10 text-center shadow-sm"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="h-16 w-16 bg-[#2694C6]/10 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-[#2694C6]" />
                            </div>
                        </div>
                        
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">
                            Order Confirmed
                        </h1>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 px-4">
                            Payment verified. Your access has been granted. You can now explore your content from the dashboard.
                        </p>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={() => router.push(finalUrl)}
                                className="w-full bg-[#2694C6] text-white font-black uppercase text-[11px] tracking-widest py-4 rounded-md hover:bg-[#1e7ca8] transition-all flex items-center justify-center gap-2"
                            >
                                Enter Dashboard <ArrowRight size={14} />
                            </button>
                            <button 
                                onClick={() => router.push('/')}
                                className="w-full bg-transparent text-gray-400 font-black uppercase text-[10px] tracking-widest py-3 hover:text-gray-900 transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-red-100 rounded-md p-8 md:p-10 text-center shadow-sm"
                    >
                        <div className="flex justify-center mb-6">
                            <XCircle className="h-14 w-14 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
                            Payment Issue
                        </h1>
                        <p className="text-sm text-gray-500 font-medium mb-8 px-4">
                            {error || "We couldn't confirm your payment. If you were charged, please contact our support team."}
                        </p>
                        <button 
                            onClick={() => router.push('/cart')}
                            className="w-full bg-gray-900 text-white font-black uppercase text-[11px] tracking-widest py-4 rounded-md hover:bg-black transition-colors"
                        >
                            Return to Cart
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<GeometricLoader />}>
            <div className="bg-[#fcfcfc] min-h-screen flex justify-center p-6">
                <OrderConfirmationContent />
            </div>
        </Suspense>
    );
}