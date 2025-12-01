"use client";

import React, { useState, useEffect } from "react";
import { Shield, Scale, Book, CreditCard, Users, Copyright, ChevronRight, Bot } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging

// --- Navigation Items ---
const SECTIONS = [
  { id: "intro", title: "1. Purpose & Scope", icon: Book },
  { id: "accounts", title: "2. Accounts & Roles", icon: Users },
  { id: "payments", title: "3. Payments & Wallets", icon: CreditCard },
  { id: "content", title: "4. Ownership & AI", icon: Copyright }, // Added AI hint
  { id: "indigenous", title: "5. Indigenous Knowledge", icon: Shield },
  { id: "license", title: "6. Platform License", icon: Scale },
  { id: "takedown", title: "7. Enforcement & Takedown", icon: Scale },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("intro");

  // Simple scroll spy to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      {/* Header */}
      <header className="bg-primary text-primary-foreground pt-24 pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 font-light max-w-2xl">
            Governing your use of the Evuka Platform, Live Events, and Community.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Last Updated: December 2025
          </div>
        </div>
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </header>

      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation (Sticky) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 bg-card text-card-foreground rounded-2xl shadow-xl border border-muted p-2 overflow-hidden">
              <nav className="flex flex-col space-y-1">
                {SECTIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full",
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon size={18} className={cn("shrink-0", activeSection === item.id ? "text-primary-foreground" : "text-primary")} />
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-8">
            {/* Intro Card */}
            <div id="intro" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                1. Purpose & Scope
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>
                  This <strong>Intellectual Property & Content Use Policy</strong> governs how intellectual property (IP) is created, shared, and protected on the Evuka Platform. It applies to all users accessing our services via the web or mobile applications.
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li><strong>Organization Admins</strong> managing school taxonomies and student data.</li>
                  <li><strong>Tutors</strong> hosting live classes and creating assessments.</li>
                  <li><strong>Students & Guardians</strong> accessing coursework and tracking progress.</li>
                </ul>
                <p className="mt-4">
                  Evuka is designed to facilitate practical, event-driven learning while respecting the rights of all creators and communities.
                </p>
              </div>
            </div>

            {/* Accounts Card */}
            <div id="accounts" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                2. User Accounts & Organizational Context
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground space-y-4">
                <p>
                  Evuka operates on a <strong>multi-tenant architecture</strong>. Your access to data is strictly contextual based on the Organization you are currently viewing.
                </p>
                <div className="grid md:grid-cols-2 gap-4 not-prose">
                  <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                    <h3 className="font-semibold text-foreground">Organization Admins</h3>
                    <p className="text-sm mt-1">Responsible for defining Categories, Levels (Grades), and managing the specific content taxonomy for their institution.</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                    <h3 className="font-semibold text-foreground">Guardians (Parents)</h3>
                    <p className="text-sm mt-1">Linked via <strong>GuardianLink</strong> to oversee student progress and authorize payments for minors.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments Card */}
            <div id="payments" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                3. Payments, Wallets & Enrollment
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>
                  We utilize <strong>Paystack</strong> as our secure payment gateway for all card and mobile money transactions.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong>Two-Step Enrollment:</strong> Paid courses require enrollment validation followed by external payment initiation. Access is granted immediately upon webhook confirmation.</li>
                  <li><strong>Wallet Ledger:</strong> Organizations maintain a transparent ledger of all incoming fees and outgoing payouts.</li>
                  <li><strong>Refunds:</strong> Refunds are processed at the discretion of the specific Organization, subject to the platform's standard processing fees.</li>
                </ul>
              </div>
            </div>

            {/* IP Ownership Card */}
            <div id="content" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                4. Ownership & AI Usage
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold">A</div>
                  <div>
                    <h3 className="font-bold text-foreground">Instructor Content</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Tutors retain ownership of their video materials and quiz content. By uploading to Evuka (via our S3/MinIO secure storage), you grant us a license to deliver this content to enrolled students.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold">B</div>
                  <div>
                    <h3 className="font-bold text-foreground">AI-Assisted Features</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Our platform uses <strong>Google Gemini</strong> to provide learning assistance. Suggestions generated by the AI are for educational purposes and do not constitute professional advice.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold">C</div>
                  <div>
                    <h3 className="font-bold text-foreground">Platform Assets</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      The underlying code, designs, and the "Evuka" trademark remain the sole property of DGIMAX Studios.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Indigenous Knowledge - Highlighted Section */}
            <div id="indigenous" className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 relative z-10">
                5. Protection of Indigenous Knowledge
              </h2>
              <div className="space-y-4 relative z-10 text-foreground/80">
                <p className="font-medium">
                  We recognize that indigenous stories, traditions, and cultural expressions contributed through community workshops are the intellectual property of the originating community.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <Shield className="text-primary shrink-0 mt-1" size={18} />
                    <span>Such content cannot be misappropriated, sold, or reproduced outside the platform without explicit consent.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Shield className="text-primary shrink-0 mt-1" size={18} />
                    <span>Evuka commits to consultation with communities and custodians when showcasing or archiving cultural content.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Licensing */}
            <div id="license" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                6. License Granted to Evuka
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>By contributing content, you grant Evuka the right to:</p>
                <ul className="list-none pl-0 space-y-2">
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Host, secure, and stream your content via our video infrastructure.</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Adapt content for accessibility (e.g., AI-driven captioning and translation).</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Feature aggregated statistics in platform reports.</li>
                </ul>
                <p className="text-sm mt-4 italic">
                  *This license is non-exclusive, meaning you are free to use your own content elsewhere.
                </p>
              </div>
            </div>

            {/* Takedown */}
            <div id="takedown" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                7. Enforcement & Contact
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>
                  Evuka complies with the <strong>Kenya Copyright Act</strong> and international IP standards. 
                  We respond promptly to valid takedown requests regarding unauthorized content.
                </p>
                <p className="mt-4">
                  If you believe your IP rights are infringed, please submit a formal request.
                </p>
                
                <div className="mt-8 p-6 bg-muted rounded-xl border border-muted-foreground/10">
                  <h4 className="font-bold text-foreground mb-2">Evuka Intellectual Property Office</h4>
                  <p className="text-sm">Baricho Road, Ambar HSE, 2nd Floor, DGIMAX Studios</p>
                  <p className="text-sm mt-1">Email: <a href="mailto:inbox@digi-collektive.com" className="text-primary hover:underline">inbox@digi-collektive.com</a></p>
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}