"use client";

import React from "react";
import { Lock, Eye, Server, Trash2, UserCheck, Globe, Database, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            We value your privacy and are committed to keeping your information safe. 
            Rooted in Kenyan law, built for global standards.
          </p>
          <p className="mt-4 text-sm font-mono opacity-70">Updated: September 2025</p>
        </div>
        
        {/* Background blobs using theme colors */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </section>

      {/* "Privacy in Simple Terms" - Dynamic Cards */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="bg-card text-card-foreground rounded-3xl shadow-xl border border-muted p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3">
            <span className="bg-secondary/10 text-secondary p-2 rounded-lg"><Eye size={24}/></span>
            Privacy in Simple Terms
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20 group">
              <UserCheck className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-foreground mb-2">What we collect</h3>
              <p className="text-sm text-muted-foreground">Only what’s necessary – name, email, school, and learning activity. Profile photos are optional.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20 group">
              <ShieldCheck className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-foreground mb-2">How we keep it safe</h3>
              <p className="text-sm text-muted-foreground">Strong encryption, secure systems, and regular checks. We comply with the Kenya Data Protection Act.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20 group">
              <Trash2 className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-foreground mb-2">Your Control</h3>
              <p className="text-sm text-muted-foreground">You can always ask us to delete or update your data. Parents must consent for users under 18.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20 group">
              <Server className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-foreground mb-2">Trusted Partners</h3>
              <p className="text-sm text-muted-foreground">Data is stored with reliable providers like Hostinger & Bunny.net. We never sell your personal data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <h2 className="text-3xl font-bold text-foreground mb-8">Detailed Privacy & Data Protection Policy</h2>

          <div className="space-y-12">
            
            {/* Section 1 */}
            <div className="border-l-4 border-primary pl-6">
              <h3 className="text-xl font-bold text-foreground mb-3">1. Introduction</h3>
              <p>
                E-vuka is an educational technology platform designed to bridge digital excellence with cultural heritage. 
                This policy outlines how we collect, process, and store user data in compliance with the 
                <strong> Kenya Data Protection Act (2019)</strong> and the <strong>General Data Protection Regulation (GDPR)</strong>.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">2. Data Controller & Processor Roles</h3>
              <div className="grid md:grid-cols-2 gap-4 not-prose">
                <div className="p-4 rounded-xl bg-card border border-muted shadow-sm">
                  <span className="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Data Controllers</span>
                  <span className="font-semibold text-foreground">Schools & Institutions</span>
                  <p className="text-sm mt-1">They determine the purpose of data collection for their students.</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-muted shadow-sm">
                  <span className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">Data Processor</span>
                  <span className="font-semibold text-foreground">E-vuka Platform</span>
                  <p className="text-sm mt-1">We process data solely to provide and improve the platform's services.</p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">3. Information Collected</h3>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>Mandatory:</strong> Name, email, school/group association.</span>
                </li>
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>System Data:</strong> Device type, IP address, browser type, location.</span>
                </li>
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>Learning Data:</strong> Courses, progress, assignments, forum interactions.</span>
                </li>
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>Payment Data:</strong> Processed securely via third parties. We do <strong>not</strong> store full card details.</span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">4. Purpose of Processing & Retention</h3>
              <p>
                We use data to personalize learning journeys through AI, support communication, and enable cultural content sharing. 
                Data is kept only as long as necessary. Anonymized cultural content may be archived with consent for heritage preservation.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">7. Third-Party Services</h3>
              <p>We work with trusted processors who operate under strict Data Processing Agreements (DPAs):</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 not-prose">
                {['Hostinger', 'Bunny.net', 'BuddyBoss', 'LearnDash'].map(partner => (
                  <div key={partner} className="bg-muted px-4 py-2 rounded-lg text-center text-sm font-medium text-foreground">
                    {partner}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10">
              <h3 className="text-xl font-bold text-foreground mb-4">9. Your Rights</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access and correct data</li>
                  <li>Request deletion</li>
                  <li>Withdraw consent</li>
                </ul>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Export learning progress</li>
                  <li>File complaints with regulators</li>
                </ul>
              </div>
              <div className="mt-6 pt-6 border-t border-secondary/20">
                <p className="font-bold text-foreground">Contact Privacy Office:</p>
                <p>Baricho Road, Ambar HSE, 2nd Floor, DGIMAX Studios</p>
                <a href="mailto:inbox@digi-collektive.com" className="text-primary hover:underline font-medium">inbox@digi-collektive.com</a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}