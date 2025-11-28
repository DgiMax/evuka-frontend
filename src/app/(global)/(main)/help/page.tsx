"use client";

import React from "react";
import { Search, BookOpen, CreditCard, Video, ShieldQuestion, ChevronDown, MessageCircle, Mail, ArrowRight } from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-24 pb-32 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">How can we help you?</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Find answers, troubleshoot issues, and get back to learning practical skills.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-primary" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for answers (e.g. 'refunds', 'certificates')..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-2xl transition-all"
            />
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 mix-blend-overlay"></div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: BookOpen, label: "Courses & Content", desc: "Access, progress, and materials" },
            { icon: CreditCard, label: "Billing & Payments", desc: "Wallets, refunds, and pricing" },
            { icon: Video, label: "Live Classes", desc: "Jitsi setup and troubleshooting" },
            { icon: ShieldQuestion, label: "Account & Security", desc: "Login, passwords, and roles" },
          ].map((item, i) => (
            <div key={i} className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-muted hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon size={24} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-lg mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="container mx-auto px-4 py-24 max-w-3xl">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <details className="group bg-card border border-muted rounded-xl open:ring-2 open:ring-primary/10 open:border-primary/30 transition-all duration-200">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-lg text-foreground list-none select-none">
              How do I join a Live Class?
              <ChevronDown className="text-muted-foreground group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              <p>Once you enroll in a course or register for an event, the <strong>"Join Live"</strong> button will become active on your dashboard 15 minutes before the scheduled start time.</p>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm border border-muted">
                <strong>Note:</strong> We use Jitsi Meet for secure video conferencing. No additional software installation is required; it runs directly in your browser.
              </div>
            </div>
          </details>

          <details className="group bg-card border border-muted rounded-xl open:ring-2 open:ring-primary/10 open:border-primary/30 transition-all duration-200">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-lg text-foreground list-none select-none">
              What payment methods are accepted?
              <ChevronDown className="text-muted-foreground group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              We process all payments securely via <strong>Paystack</strong>. Depending on your region, you can pay using:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Credit or Debit Cards (Visa, Mastercard)</li>
                <li>Mobile Money (M-Pesa, Airtel Money)</li>
                <li>Direct Bank Transfer</li>
              </ul>
            </div>
          </details>

          <details className="group bg-card border border-muted rounded-xl open:ring-2 open:ring-primary/10 open:border-primary/30 transition-all duration-200">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-lg text-foreground list-none select-none">
              How does the Wallet system work?
              <ChevronDown className="text-muted-foreground group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              Your Evuka Wallet acts as a ledger for all your transactions.
              <ul className="mt-2 space-y-2">
                <li><strong>For Students:</strong> It tracks payments made for courses and events. Refunds are credited here first.</li>
                <li><strong>For Tutors/Orgs:</strong> Revenue from courses accumulates here. You can request a payout to your bank or mobile money once you reach the minimum threshold.</li>
              </ul>
            </div>
          </details>

          <details className="group bg-card border border-muted rounded-xl open:ring-2 open:ring-primary/10 open:border-primary/30 transition-all duration-200">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-lg text-foreground list-none select-none">
              Can I access courses offline?
              <ChevronDown className="text-muted-foreground group-open:rotate-180 transition-transform duration-200" />
            </summary>
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              Currently, Evuka requires an active internet connection to track progress and stream video content accurately. However, instructors may enable downloadable resources (PDFs, Slides) which can be accessed offline once saved to your device.
            </div>
          </details>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-muted/30 py-20 border-t border-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Still need help?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:support@evuka.com" className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-muted-foreground/20 rounded-xl hover:shadow-lg hover:border-primary/50 transition-all group">
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail size={20} className="text-primary group-hover:text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email Support</p>
                <p className="font-medium text-foreground">support@evuka.com</p>
              </div>
            </a>

            <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-muted-foreground/20 rounded-xl hover:shadow-lg hover:border-primary/50 transition-all group">
              <div className="bg-secondary/10 p-2 rounded-full group-hover:bg-secondary group-hover:text-white transition-colors">
                <MessageCircle size={20} className="text-secondary group-hover:text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Live Chat</p>
                <p className="font-medium text-foreground">Start a conversation</p>
              </div>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}