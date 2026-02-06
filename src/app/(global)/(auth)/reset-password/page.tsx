"use client";

import React, { useState } from "react";
import Input from "@/components/ui/FormInput";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

const PRIMARY_TEXT_CLASS = "text-[#2694C6]";
const PRIMARY_BUTTON_CLASS = "bg-primary hover:bg-[#1f7ba5] transition-colors"; 

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const origin = window.location.origin;
      await forgotPassword(email, origin);
      setMessage("If an account with that email exists, a password reset link has been sent.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm md:max-w-md"> 

      <div className="bg-white rounded-md border border-gray-200 overflow-hidden">
        
        <div className="text-center p-6 sm:p-7 border-b border-gray-100 bg-background"> 
          <div className="mx-auto mb-3" style={{ width: '180px', height: '64px' }}>
             <Image
                src="/logo.png"
                alt="Evuka Logo"
                width={180}
                height={64}
                className="object-contain"
              />
          </div>
          <h1 className={`text-xl font-bold text-black`}>
            Forgot Your Password?
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            We'll help you get back into your account.
          </p>
        </div>
        
        <div className="w-full p-6 sm:p-7"> 
          
          {message ? (
            <div className="text-center">
              <p className="text-green-600 text-lg font-medium">{message}</p>
              
              <Link href="/login" className="block w-full mt-6">
                <button 
                    type="button"
                    className={`w-full text-white py-3 rounded-md font-semibold ${PRIMARY_BUTTON_CLASS}`}
                >
                    ← Back to Log In
                </button>
              </Link>
            </div>
            
          ) : (
            <>
              <p className="text-center text-gray-600 text-sm mb-4">
                Enter your email address below and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full text-white py-3 rounded-md font-semibold disabled:opacity-70 disabled:cursor-not-allowed ${PRIMARY_BUTTON_CLASS}`}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Remember your password?{" "}
          <Link href="/login" className={`${PRIMARY_TEXT_CLASS} font-medium hover:underline`}>
            Log In
          </Link>
        </p>
      </div>

    </div>
  );
}