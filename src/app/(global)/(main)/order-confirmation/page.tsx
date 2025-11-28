// components/layouts/OrderConfirmationPage.tsx (or similar)

"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api/axios'; 
import { useAuth } from '@/context/AuthContext'; // ⬅️ Ensure this is used
import { Loader2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---
type IconProps = { className?: string; };

interface RedirectContext {
    org_slug?: string;
    type: 'organization' | 'global' | 'course' | 'event';
}

// --- SVG ICONS ---
const CheckCircleIcon = ({ className = "w-16 h-16" }: IconProps) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCart();
    
    // 🟢 CRITICAL: Access fetchCurrentUser from useAuth
    const { fetchCurrentUser } = useAuth(); 
    
    const [status, setStatus] = useState('verifying'); 
    const [error, setError] = useState<string | null>(null);
    const [redirectContext, setRedirectContext] = useState<RedirectContext | null>(null); 
    
    // --- Data Fetching ---
    useEffect(() => {
        const reference = searchParams.get('reference');

        if (!reference) {
            setStatus('failed');
            setError('No payment reference found. Your order may not have been processed.');
            return;
        }

        const verifyTransaction = async () => {
            try {
                const response = await api.get(`/payments/verify/${reference}/`);
                
                setStatus('success');
                clearCart(); 
                
                // 🚀 STEP 1: Reload User Profile
                // This ensures the AuthContext has the new active OrgMembership details 
                // before the user is redirected.
                await fetchCurrentUser();
                
                // 🚀 STEP 2: Capture Redirect Context
                setRedirectContext(response.data.redirect_context || { type: 'global' }); 

            } catch (err: any) {
                setStatus('failed');
                const errorMessage = err.response?.data?.message || 
                                     err.response?.data?.error || 
                                     'An error occurred during payment verification.';
                setError(errorMessage);
            }
        };

        verifyTransaction();
    }, [searchParams, clearCart, fetchCurrentUser]); // Add fetchCurrentUser to dependencies

    // --- Derived Redirect URL and Rendering ---
    const getRedirectUrl = () => {
        if (!redirectContext) return '/dashboard';
        
        // 1. Organization Enrollment (highest priority)
        if (redirectContext.type === 'organization' && redirectContext.org_slug) {
            return `/org/${redirectContext.org_slug}/dashboard`;
        }
        
        // 2. Default to global user dashboard
        return '/dashboard';
    };


    if (status === 'verifying') {
        return (
             <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                <p className="text-lg text-gray-700">Verifying your payment, please wait...</p>
             </div>
        );
    }

    if (status === 'failed') {
         return (
             <div className="text-center">
                 <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
                 <p className="text-gray-600 mt-2">{error || "We couldn't verify your payment."}</p>
                 <button 
                     onClick={() => router.push('/cart')}
                     className="w-full sm:w-auto mt-6 bg-[#2694C6] text-white font-bold py-3 px-8 rounded-md hover:bg-[#1f7ba5] transition-colors">
                     Return to Cart
                 </button>
             </div>
        );
    }
    
    // Success State
    const finalUrl = getRedirectUrl();
    const buttonText = redirectContext?.type === 'organization' ? 'Go to Organization Dashboard' : 'Go to My Dashboard';

    return (
        <div className="w-full max-w-2xl bg-white p-8 border rounded-md text-center">
            <div className="flex justify-center text-green-500 mb-4">
                <CheckCircleIcon className="w-16 h-16" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Thank You For Your Purchase!</h1>
            <p className="text-gray-600 mt-2">Your order has been confirmed and you can now access your content.</p>
            
            <button 
                onClick={() => router.push(finalUrl)}
                className="w-full sm:w-auto mt-8 bg-[#2694C6] text-white font-bold py-3 px-8 rounded-md hover:bg-[#1f7ba5] transition-colors">
                {buttonText}
            </button>
        </div>
    );
}


export default function OrderConfirmationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
                <OrderConfirmationContent />
            </div>
        </Suspense>
    );
}