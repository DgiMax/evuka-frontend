"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, BookOpen, CreditCard, Video, ShieldQuestion, 
  ChevronDown, MessageCircle, Mail, Settings, HelpCircle, Loader2 
} from "lucide-react";
import api from "@/lib/api/axios"; // Your API instance
import { cn } from "@/lib/utils"; // Assuming you have this

// --- Icon Mapping ---
// Maps the string from Django (choices) to Lucide Components
const iconMap: Record<string, any> = {
  'book': BookOpen,
  'credit-card': CreditCard,
  'video': Video,
  'shield': ShieldQuestion,
  'settings': Settings,
  'default': HelpCircle
};

// --- Types ---
interface HelpCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
}

interface HelpArticle {
  id: number;
  question: string;
  answer: string;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [faqs, setFaqs] = useState<HelpArticle[]>([]);
  const [searchResults, setSearchResults] = useState<HelpArticle[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // --- Fetch Initial Data ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await api.get('/help-center/');
        setCategories(res.data.categories);
        setFaqs(res.data.faqs);
      } catch (error) {
        console.error("Failed to load help center data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // --- Handle Search (Debounced) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const res = await api.get(`/help-center/?search=${searchQuery}`);
          setSearchResults(res.data.data);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Determine what to display based on search state
  const displayFaqs = searchQuery.length > 2 ? searchResults : faqs;
  const showCategories = searchQuery.length <= 2;

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
              {isSearching ? (
                <Loader2 className="animate-spin text-primary" size={20} />
              ) : (
                <Search className="text-primary" size={20} />
              )}
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers (e.g. 'refunds', 'certificates')..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-2xl transition-all"
            />
          </div>
        </div>
        
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 mix-blend-overlay"></div>
      </section>

      {/* Categories Grid (Hidden when searching) */}
      {showCategories && !isLoading && (
        <section className="container mx-auto px-4 -mt-16 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((item) => {
              const IconComponent = iconMap[item.icon] || iconMap['default'];
              return (
                <div key={item.id} className="bg-card text-card-foreground p-6 rounded-2xl shadow-lg border border-muted hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComponent size={24} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FAQs Section */}
      <section className="container mx-auto px-4 py-24 max-w-3xl">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            {searchQuery.length > 2 
                ? `Search Results for "${searchQuery}"` 
                : "Frequently Asked Questions"}
        </h2>
        
        {isLoading ? (
            <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : displayFaqs.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                <p>No results found.</p>
            </div>
        ) : (
            <div className="space-y-4">
            {displayFaqs.map((faq) => (
                <details key={faq.id} className="group bg-card border border-muted rounded-xl open:ring-2 open:ring-primary/10 open:border-primary/30 transition-all duration-200">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-lg text-foreground list-none select-none">
                    {faq.question}
                    <ChevronDown className="text-muted-foreground group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-muted/50 pt-4">
                    {/* Render basic HTML/Text. If utilizing rich text, use a parser here. */}
                    <div dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br />') }} />
                </div>
                </details>
            ))}
            </div>
        )}
      </section>

      {/* Contact CTA */}
      {/* Contact CTA */}
      <section className="bg-muted/30 py-20 border-t border-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Still need help?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            
            {/* Email Support (Active) */}
            <a href="mailto:support@evuka.com" className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-card border border-muted-foreground/20 rounded-xl hover:shadow-lg hover:border-primary/50 transition-all group">
              <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                <Mail size={20} className="text-primary group-hover:text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Email Support</p>
                <p className="font-medium text-foreground">support@evuka.com</p>
              </div>
            </a>

            {/* Live Chat (Disabled) */}
            <button 
              disabled={true}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-card border border-muted-foreground/20 rounded-xl opacity-50 cursor-not-allowed"
            >
              <div className="bg-secondary/10 p-2 rounded-full text-secondary">
                <MessageCircle size={20} />
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