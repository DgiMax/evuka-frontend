"use client";

import React from "react";
import { Lock, Eye, Server, Trash2, UserCheck, Database, ShieldCheck } from "lucide-react";

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
            Rooted in Kenyan law, built for practical, community-driven education.
          </p>
          <p className="mt-4 text-sm font-mono opacity-70">Updated: December 2025</p>
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
              <p className="text-sm text-muted-foreground">Essential data: Name, email, organization role, and course progress. Profile photos are optional.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20 group">
              <ShieldCheck className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-foreground mb-2">How we keep it safe</h3>
              <p className="text-sm text-muted-foreground">HttpOnly-secured JWT tokens, server-side validation, and encrypted storage.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20 group">
              <Trash2 className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-foreground mb-2">Your Control</h3>
              <p className="text-sm text-muted-foreground">You can request data deletion. Guardians manage data for students under 18 via GuardianLink.</p>
            </div>

            <div className="bg-muted/30 p-6 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20 group">
              <Server className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="font-bold text-foreground mb-2">Trusted Partners</h3>
              <p className="text-sm text-muted-foreground">We use Paystack for payments, Jitsi for video, and AWS/MinIO for storage.</p>
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
                Evuka is a practical e-learning platform enabling organizations to manage education through live events, quizzes, and assignments. 
                This policy outlines how we collect, process, and store user data in compliance with the 
                <strong> Kenya Data Protection Act (2019)</strong> and international standards.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">2. Data Controller & Processor Roles</h3>
              <div className="grid md:grid-cols-2 gap-4 not-prose">
                <div className="p-4 rounded-xl bg-card border border-muted shadow-sm">
                  <span className="block text-xs font-bold text-primary uppercase tracking-wider mb-1">Data Controllers</span>
                  <span className="font-semibold text-foreground">Organizations (Schools)</span>
                  <p className="text-sm mt-1">They own the taxonomy (Subjects/Levels) and manage student enrollment.</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-muted shadow-sm">
                  <span className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1">Data Processor</span>
                  <span className="font-semibold text-foreground">Evuka Platform</span>
                  <p className="text-sm mt-1">We process data to deliver the dashboard, assessments, and live classes.</p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">3. Information Collected</h3>
              <ul className="space-y-2 list-none pl-0">
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>Identity Data:</strong> Name, email, phone number, and Organization ID.</span>
                </li>
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>Academic Data:</strong> Quiz scores, assignment submissions (files/text), and auto-saved notes.</span>
                </li>
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>Activity Logs:</strong> Video timestamps (LessonProgress), live class attendance, and discussion replies.</span>
                </li>
                <li className="flex gap-3">
                  <Database size={20} className="text-secondary shrink-0 mt-1" />
                  <span><strong>Financial Data:</strong> Transaction history via Paystack. We do <strong>not</strong> store card details.</span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">4. Purpose of Processing & Retention</h3>
              <p>
                We use data to generate organizational reports, facilitate live video sessions via Jitsi Meet, and provide AI-assisted learning support via Google Gemini. 
                Assignment files are stored securely using AWS S3/MinIO protocols and are retained only as long as the organization requires.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h3 className="text-xl font-bold text-foreground mb-3">7. Third-Party Services</h3>
              <p>We work with trusted processors to provide our core infrastructure:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 not-prose">
                {[
                  { name: 'Paystack', role: 'Payments' },
                  { name: 'Jitsi Meet', role: 'Live Video' },
                  { name: 'Google Gemini', role: 'AI Assistant' },
                  { name: 'AWS / MinIO', role: 'Cloud Storage' }
                ].map(partner => (
                  <div key={partner.name} className="bg-muted px-4 py-3 rounded-lg text-center border border-transparent hover:border-primary/20 transition-colors">
                    <div className="text-sm font-bold text-foreground">{partner.name}</div>
                    <div className="text-xs text-muted-foreground">{partner.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-secondary/5 p-8 rounded-2xl border border-secondary/10">
              <h3 className="text-xl font-bold text-foreground mb-4">9. Your Rights</h3>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Access personal performance reports</li>
                  <li>Request account deletion</li>
                  <li>Manage parent/guardian consent</li>
                </ul>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Export notes and assignment data</li>
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