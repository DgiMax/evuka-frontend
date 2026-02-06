"use client";

import React from "react";
import { Check, ArrowRight, Wallet, Users, BookOpen } from "lucide-react";

export default function PartnerPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-[#2694C6] text-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              Empower Learners as a <br className="hidden lg:block" /> Creator or Publisher
            </h1>
            <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-xl mx-auto md:mx-0">
              Whether you're an independent tutor building a digital school or a 
              publisher distributing academic manuscripts, Evuka provides the 
              infrastructure for your success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <a
                href="https://tutors.e-vuka.com/"
                className="w-full sm:w-auto bg-white text-[#2694C6] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-none"
              >
                Become a Tutor <ArrowRight size={18} />
              </a>
              <a
                href="https://publishers.e-vuka.com/"
                className="w-full sm:w-auto bg-blue-900/30 border border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-none"
              >
                Become a Publisher <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="hidden md:block bg-white/10 p-8 rounded-2xl border border-white/20 backdrop-blur-sm shadow-none">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-400 p-2 rounded-lg">
                  <Wallet className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-white">Automated Payouts</p>
                  <p className="text-sm text-blue-100">Daily settlements via Paystack</p>
                </div>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex items-center gap-4">
                <div className="bg-purple-400 p-2 rounded-lg">
                  <BookOpen className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-white">Global Distribution</p>
                  <p className="text-sm text-blue-100">Reach thousands of active students</p>
                </div>
              </div>
              <div className="h-px bg-white/20"></div>
              <div className="flex items-center gap-4">
                <div className="bg-orange-400 p-2 rounded-lg">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-bold text-white">Advanced Management</p>
                  <p className="text-sm text-blue-100">Robust student & reader analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center mb-12 uppercase tracking-[0.3em] text-[10px] sm:text-[11px] font-black text-[#2694C6]">
            Partnership Opportunities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-none">
                For Educators
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-blue-100 p-1.5 rounded-full shrink-0 shadow-none">
                    <Check className="text-blue-600" size={14} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Organization Control</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Build your brand with customized levels, specific subjects, and unique curricula 
                      tailored to your teaching goals.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-blue-100 p-1.5 rounded-full shrink-0 shadow-none">
                    <Check className="text-blue-600" size={14} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Live Sessions</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Utilize integrated tools for scheduled workshops, hackathons, and recurring classes 
                      with automated attendance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-8 md:pt-0 border-t border-gray-100 md:border-t-0">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-none">
                For Publishers
              </div>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-emerald-100 p-1.5 rounded-full shrink-0 shadow-none">
                    <Check className="text-emerald-600" size={14} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Secure Hosting</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Distribute digital books, academic research, and proprietary manuscripts 
                      with advanced access controls.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="mt-1 bg-emerald-100 p-1.5 rounded-full shrink-0 shadow-none">
                    <Check className="text-emerald-600" size={14} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">Reader Insights</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Gain access to deep engagement metrics and analytics for every title 
                      listed in your digital catalog.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20 md:py-28 border-t border-gray-100 shadow-none">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 tracking-tight leading-tight">
            Ready to expand your reach?
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto text-sm sm:text-base px-2 leading-relaxed">
            Join a growing network of professionals delivering world-class 
            education and high-quality resources across the continent.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6 px-4">
            <a
              href="https://tutors.e-vuka.com/organizations/create"
              className="w-full sm:w-auto bg-[#2694C6] text-white px-12 py-5 rounded-lg font-black uppercase text-[11px] tracking-[0.2em] hover:bg-[#1f7ba5] transition-all active:scale-95 shadow-none"
            >
              Start an Organization
            </a>
            <a
              href="https://publishers.e-vuka.com/register"
              className="w-full sm:w-auto bg-white border border-gray-300 text-gray-900 px-12 py-5 rounded-lg font-black uppercase text-[11px] tracking-[0.2em] hover:bg-gray-50 transition-all active:scale-95 shadow-none"
            >
              Register as Publisher
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}