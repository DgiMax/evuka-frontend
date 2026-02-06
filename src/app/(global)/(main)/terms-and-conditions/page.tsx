"use client";

import React, { useState, useEffect } from "react";
import { Shield, Scale, Book, CreditCard, Users, Copyright, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "intro", title: "1. Purpose & Scope", icon: Book },
  { id: "accounts", title: "2. Accounts & Roles", icon: Users },
  { id: "payments", title: "3. Payments & Wallets", icon: CreditCard },
  { id: "content", title: "4. Ownership & AI", icon: Copyright },
  { id: "indigenous", title: "5. Indigenous Knowledge", icon: Shield },
  { id: "license", title: "6. Platform License", icon: Scale },
  { id: "takedown", title: "7. Enforcement & Takedown", icon: Scale },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState("intro");

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
      <header className="bg-primary text-primary-foreground pt-24 pb-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 font-light max-w-2xl">
            Governing your use of the Evuka Platform, Publishers Ecosystem, and Community.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Last Updated: February 2026
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      </header>

      <div className="container mx-auto px-4 -mt-20 relative z-20 pb-24">
        <div className="grid lg:grid-cols-12 gap-8">
          
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 bg-card text-card-foreground rounded-2xl border border-muted p-2 overflow-hidden shadow-none">
              <nav className="flex flex-col space-y-1">
                {SECTIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left w-full",
                      activeSection === item.id
                        ? "bg-primary text-primary-foreground"
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

          <main className="lg:col-span-9 space-y-8">
            <div id="intro" className="bg-card text-card-foreground rounded-2xl p-8 border border-muted/50 shadow-none">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                1. Purpose & Scope
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>
                  This policy governs the use of services provided by the Evuka Platform and its dedicated subdomains (including <strong>tutors.e-vuka.com</strong> and <strong>publishers.e-vuka.com</strong>).
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-4">
                  <li><strong>Organization Admins:</strong> Institutions managing schools and specialized curricula.</li>
                  <li><strong>Tutors:</strong> Independent educators providing courses and live learning.</li>
                  <li><strong>Publishers:</strong> Authors and organizations distributing digital manuscripts and books.</li>
                  <li><strong>Students:</strong> Learners accessing educational and cultural assets.</li>
                </ul>
              </div>
            </div>

            <div id="accounts" className="bg-card text-card-foreground rounded-2xl p-8 border border-muted/50 shadow-none">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                2. User Accounts & Subdomains
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground space-y-4">
                <p>
                  Access to Evuka is segmented into specific professional contexts. Users must register under the appropriate domain for their intended use.
                </p>
                <div className="grid md:grid-cols-3 gap-4 not-prose">
                  <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><Users size={16}/> Tutors</h3>
                    <p className="text-xs mt-1">Manage courses and live events through the Tutor portal.</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><BookOpen size={16}/> Publishers</h3>
                    <p className="text-xs mt-1">Dedicated access via publishers.e-vuka.com for digital asset distribution.</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-xl border border-muted">
                    <h3 className="font-semibold text-foreground flex items-center gap-2"><Shield size={16}/> Students</h3>
                    <p className="text-xs mt-1">Centralized access to learning materials and certification records.</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="payments" className="bg-card text-card-foreground rounded-2xl p-8 border border-muted/50 shadow-none">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                3. Payments & Wallets
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>
                  Financial transactions for courses, level-access, and digital books are processed via <strong>Paystack</strong>.
                </p>
                <ul className="list-disc pl-5 mt-4 space-y-2">
                  <li><strong>Wallet Transparency:</strong> All Creators and Publishers maintain a ledger for automated revenue share tracking.</li>
                  <li><strong>Payouts:</strong> Revenue is settled to verified banking or mobile money accounts linked to the user's professional profile.</li>
                </ul>
              </div>
            </div>

            <div id="content" className="bg-card text-card-foreground rounded-2xl p-8 border border-muted/50 shadow-none">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                4. Ownership & AI Usage
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold border border-secondary/20 shadow-none">A</div>
                  <div>
                    <h3 className="font-bold text-foreground">Author & Publisher Rights</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Publishers and Authors retain full copyright over their manuscripts and digital books. Evuka acts as a secure distribution and DRM facilitator.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold border border-secondary/20 shadow-none">B</div>
                  <div>
                    <h3 className="font-bold text-foreground">Instructor IP</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Tutors maintain ownership of video and course logic. By using Evuka, you grant us the operational license to deliver your content to paying students.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0 text-secondary font-bold border border-secondary/20 shadow-none">C</div>
                  <div>
                    <h3 className="font-bold text-foreground">AI Assistance</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      AI features (powered by Google Gemini) are tools for learning enhancement and should not be considered authoritative for legal or technical certification.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div id="indigenous" className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-8 relative overflow-hidden shadow-none">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 shadow-none"></div>
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 relative z-10">
                5. Protection of Indigenous Knowledge
              </h2>
              <div className="space-y-4 relative z-10 text-foreground/80">
                <p className="font-medium">
                  We acknowledge that specific cultural expressions and traditions shared on this platform are owned by the communities that originated them.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <Shield className="text-primary shrink-0 mt-1" size={18} />
                    <span>Evuka strictly prohibits the unauthorized reproduction or commercial exploitation of indigenous cultural assets.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div id="license" className="bg-card text-card-foreground rounded-2xl p-8 border border-muted/50 shadow-none">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                6. Platform License
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>Users grant Evuka a non-exclusive license to host and stream contributed content solely for platform delivery. This includes:</p>
                <ul className="list-none pl-0 space-y-2">
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Global content delivery and streaming.</li>
                  <li className="flex items-center gap-2"><ChevronRight size={16} className="text-secondary"/> Automated accessibility tagging and transcription.</li>
                </ul>
              </div>
            </div>

            <div id="takedown" className="bg-card text-card-foreground rounded-2xl p-8 border border-muted/50 shadow-none">
              <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                7. Enforcement & Takedown
              </h2>
              <div className="prose prose-gray max-w-none text-muted-foreground">
                <p>
                  We comply with the <strong>Kenya Copyright Act</strong>. Unauthorized content reported via valid legal notices will be removed promptly from all subdomains.
                </p>
                <div className="mt-8 p-6 bg-muted rounded-xl border border-muted-foreground/10 shadow-none">
                  <h4 className="font-bold text-foreground mb-2">Evuka Intellectual Property Office</h4>
                  <p className="text-sm">DGIMAX Studios, Ambar HSE, 2nd Floor, Baricho Road, Nairobi.</p>
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