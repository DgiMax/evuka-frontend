"use client";

import React, { useState, useEffect } from "react";
import { Shield, Scale, Book, CreditCard, Users, Copyright, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging

// --- Navigation Items ---
const SECTIONS = [
  { id: "intro", title: "1. Purpose & Scope", icon: Book },
  { id: "accounts", title: "2. User Accounts & Roles", icon: Users },
  { id: "payments", title: "3. Payments & Wallets", icon: CreditCard },
  { id: "content", title: "4. Ownership of Content", icon: Copyright },
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
            Governing your use of the E-vuka Platform, Content, and Community.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Last Updated: September 2025
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
                  This <strong>Intellectual Property & Content Use Policy</strong> governs how intellectual property (IP) is created, shared, and protected on the E-vuka Platform. It applies to:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li><strong>Instructors and Contributors</strong> uploading courses, tutorials, or cultural content.</li>
                  <li><strong>Learners and Community Members</strong> accessing, using, or sharing content.</li>
                  <li><strong>Partners and Institutions</strong> licensing or distributing E-vuka materials.</li>
                </ul>
                <p className="mt-4">
                  E-vuka respects the rights of creators while ensuring that learners and communities benefit from safe, ethical, and culturally sensitive use of content.
                </p>
              </div>
            </div>

            {/* Accounts Card */}
            <div id="accounts" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                2. User Accounts & Organizational Structure
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground space-y-4">
                <p>
                  E-vuka operates on a deep organizational structure. Users may hold different roles depending on the context:
                </p>
                <div className="grid md:grid-cols-2 gap-4 not-prose">
                  <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                    <h3 className="font-semibold text-foreground">Organization Admins</h3>
                    <p className="text-sm mt-1">Responsible for managing taxonomy (Levels, Subjects), students, and local content.</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                    <h3 className="font-semibold text-foreground">Tutors & Creators</h3>
                    <p className="text-sm mt-1">Host live events via Jitsi and manage course materials.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payments Card */}
            <div id="payments" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                3. Payments, Wallets & Payouts
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>
                  We utilize <strong>Paystack</strong> as our primary payment gateway for card and mobile money transactions.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong>Enrollment:</strong> Immediate access is granted upon successful payment confirmation.</li>
                  <li><strong>Wallet Ledger:</strong> A complete transaction history is maintained for every user and organization. Refunds and earnings are credited here.</li>
                  <li><strong>Payouts:</strong> Tutors and Organizations must complete a two-step validation before requesting payouts to bank accounts or mobile wallets.</li>
                </ul>
              </div>
            </div>

            {/* IP Ownership Card */}
            <div id="content" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                4. Ownership of Content
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold">A</div>
                  <div>
                    <h3 className="font-bold text-foreground">Instructor & Contributor Content</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Instructors retain ownership of the courses and materials they create. By uploading, you grant E-vuka a limited license to host and distribute it.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold">B</div>
                  <div>
                    <h3 className="font-bold text-foreground">Learner Content</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Learners retain ownership of projects and forum posts but grant E-vuka permission to display them within the learning environment.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold">C</div>
                  <div>
                    <h3 className="font-bold text-foreground">Platform Content</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Logos, code, and curated materials remain the sole property of E-vuka and DGIMAX Studios.
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
                  We recognize that indigenous stories, traditions, and cultural expressions contributed through workshops are the intellectual property of the originating community.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <Shield className="text-primary shrink-0 mt-1" size={18} />
                    <span>Such content cannot be misappropriated, sold, or reproduced outside the platform without consent.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Shield className="text-primary shrink-0 mt-1" size={18} />
                    <span>E-vuka commits to consultation with communities and custodians when showcasing or archiving cultural content.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Licensing */}
            <div id="license" className="bg-card text-card-foreground rounded-2xl p-8 shadow-sm border border-muted/50">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                6. License Granted to E-vuka
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>By contributing content, you grant E-vuka the right to:</p>
                <ul className="list-none pl-0 space-y-2">
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Host, reproduce, stream, and distribute your content within the platform.</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Translate or adapt content for accessibility (e.g., indigenous language support, AI captioning).</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Feature content in promotions, provided attribution is maintained.</li>
                </ul>
                <p className="text-sm mt-4 italic">
                  *This license is non-exclusive, meaning you may use your content elsewhere.
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
                  E-vuka complies with the <strong>Kenya Copyright Act (2001, revised 2019)</strong>, GDPR, and international treaties (WIPO).
                </p>
                <p className="mt-4">
                  If you believe your IP rights are infringed, submit a takedown request with supporting evidence. E-vuka will investigate promptly and remove verified infringing material.
                </p>
                
                <div className="mt-8 p-6 bg-muted rounded-xl border border-muted-foreground/10">
                  <h4 className="font-bold text-foreground mb-2">E-vuka Intellectual Property Office</h4>
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