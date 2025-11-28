"use client";

import React from "react";
import { Check, ArrowRight, Wallet, Users, LayoutDashboard } from "lucide-react";

export default function PartnerPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#2694C6] text-white py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Launch Your Digital School with Evuka</h1>
                <p className="text-lg text-blue-100 mb-8">
                    Don't just upload courses. Build an organization. Manage students, payments, and live events all in one platform.
                </p>
                <button className="bg-white text-[#2694C6] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                    Start Teaching <ArrowRight size={18} />
                </button>
            </div>
            <div className="hidden md:block bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-sm">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-400 p-2 rounded-lg"><Wallet className="text-white" size={20}/></div>
                        <div>
                            <p className="font-bold">Automated Payouts</p>
                            <p className="text-sm text-blue-100">Via Paystack & Mobile Money</p>
                        </div>
                    </div>
                    <div className="h-px bg-white/20"></div>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-400 p-2 rounded-lg"><Users className="text-white" size={20}/></div>
                        <div>
                            <p className="font-bold">Student Management</p>
                            <p className="text-sm text-blue-100">Track progress & grades</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Partner with Us?</h2>
            
            <div className="space-y-8">
                <div className="flex gap-4 items-start">
                    <div className="mt-1 bg-green-100 p-1 rounded-full"><Check className="text-green-600" size={16} /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Total Ownership</h3>
                        <p className="text-gray-600">Create your own "Organization" within Evuka. Define your own Grade Levels, Subjects, and Categories to match your physical curriculum.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="mt-1 bg-green-100 p-1 rounded-full"><Check className="text-green-600" size={16} /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Integrated Finance</h3>
                        <p className="text-gray-600">Built-in wallet ledgers. We handle the payment processing via Paystack, so you can focus on teaching. Withdraw directly to your bank or mobile money.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="mt-1 bg-green-100 p-1 rounded-full"><Check className="text-green-600" size={16} /></div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Hybrid Learning Tools</h3>
                        <p className="text-gray-600">Schedule recurring live classes, workshops, or hackathons. Our system handles the registration links and attendance tracking for you.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-6">Ready to expand your reach?</h2>
            <button className="bg-[#2694C6] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#1f7ba5] transition-colors">
                Register as an Organization
            </button>
        </div>
      </div>
    </div>
  );
}