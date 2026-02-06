"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Search, BookOpen, CreditCard, Video, ShieldQuestion, 
  ChevronDown, MessageCircle, Mail, Settings, HelpCircle, 
  Loader2, X, ThumbsUp, ThumbsDown, CheckCircle2, ArrowRight
} from "lucide-react";
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const iconMap: Record<string, any> = {
  'book': BookOpen,
  'credit-card': CreditCard,
  'video': Video,
  'shield': ShieldQuestion,
  'settings': Settings,
  'default': HelpCircle
};

interface HelpCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

interface HelpArticle {
  id: number;
  question: string;
  slug: string;
  answer: string;
  category_name: string;
  related_articles?: { question: string; slug: string }[];
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<Record<number, boolean>>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchContent = useCallback(async (slug?: string | null, search?: string) => {
    setIsSearching(!!search);
    try {
      let url = "/help-center/articles/";
      const params = new URLSearchParams();
      if (slug) params.append("category", slug);
      if (search) params.append("search", search);
      
      const res = await api.get(`${url}?${params.toString()}`);
      setArticles(res.data);
    } catch (error) {
      console.error("Data fetch failed", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      try {
        const catRes = await api.get('/help-center/categories/');
        setCategories(catRes.data);
        await fetchContent();
      } catch (err) {
        console.error(err);
      }
    };
    initFetch();
  }, [fetchContent]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        setActiveCategorySlug(null);
        fetchContent(null, searchQuery);
      } else if (searchQuery.length === 0 && !activeCategorySlug) {
        fetchContent();
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeCategorySlug, fetchContent]);

  const handleCategoryClick = (slug: string) => {
    const newSlug = activeCategorySlug === slug ? null : slug;
    setActiveCategorySlug(newSlug);
    setSearchQuery("");
    fetchContent(newSlug);
  };

  const handleFeedback = async (articleSlug: string, articleId: number, helpful: boolean) => {
    try {
      await api.post(`/help-center/articles/${articleSlug}/feedback/`, { helpful });
      setFeedbackGiven(prev => ({ ...prev, [articleId]: true }));
    } catch (err) {
      console.error("Feedback failed", err);
    }
  };

  const scrollToArticle = (slug: string) => {
    const element = document.getElementById(`article-${slug}`);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        const details = element.closest('details');
        if (details) details.open = true;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      
      <section className="bg-primary text-primary-foreground pt-20 pb-28 md:pt-24 md:pb-32 px-4 text-center relative overflow-hidden border-b border-white/10 shadow-none">
        <div className="relative z-10 max-w-3xl mx-auto">
          <Badge variant="outline" className="mb-6 px-4 py-1 border-white/30 text-white bg-white/10 rounded-full uppercase text-[10px] font-bold tracking-[0.2em] shadow-none">
            Evuka Support Hub
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            How can we help?
          </h1>
          
          <div className="relative max-w-2xl mx-auto group px-2">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              {isSearching ? <Loader2 className="animate-spin text-primary" size={20} /> : <Search className="text-primary" size={20} />}
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..." 
              className="w-full pl-14 pr-14 py-4 md:py-5 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none border-4 border-transparent focus:border-white/20 shadow-none transition-all text-base md:text-lg font-medium"
            />
            {searchQuery && (
              <button onClick={() => {setSearchQuery(""); fetchContent();}} className="absolute inset-y-0 right-7 flex items-center text-gray-400 hover:text-primary">
                <X size={20} />
              </button>
            )}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </section>

      <section className="container mx-auto px-4 -mt-12 md:-mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((item) => {
            const IconComponent = iconMap[item.icon] || iconMap['default'];
            const isActive = activeCategorySlug === item.slug;
            return (
              <button 
                key={item.id} 
                onClick={() => handleCategoryClick(item.slug)}
                className={cn(
                  "flex flex-col items-start p-6 rounded-xl border transition-all duration-200 text-left shadow-none group",
                  isActive ? "bg-primary border-primary text-primary-foreground" : "bg-card border-border hover:border-primary/50 text-card-foreground"
                )}
              >
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors", isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white")}>
                  <IconComponent size={20} />
                </div>
                <h3 className="font-bold text-xs sm:text-sm uppercase tracking-widest">{item.name}</h3>
                <p className="text-xs mt-2 leading-relaxed opacity-70 font-medium">{item.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
        <div className="flex flex-col items-center mb-10 md:mb-12 space-y-2">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-center uppercase">
            {searchQuery.length > 2 ? `Search Results` : activeCategorySlug ? categories.find(c => c.slug === activeCategorySlug)?.name : "Helpful Articles"}
          </h2>
          <div className="h-1 w-12 bg-primary rounded-full"></div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl border border-border"></div>)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-border bg-muted/20">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
            <h3 className="text-lg font-bold text-muted-foreground">No matches found</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
            {articles.map((faq) => (
              <details 
                key={faq.id} 
                id={`article-${faq.slug}`}
                className="group bg-card border border-border rounded-xl transition-all open:border-primary/30 shadow-none overflow-hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 md:p-6 font-bold text-base md:text-lg text-foreground list-none select-none">
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] md:text-[10px] text-primary uppercase tracking-[0.2em] font-black mb-1">{faq.category_name}</span>
                    <span className="pr-4">{faq.question}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full border border-border flex items-center justify-center group-open:bg-primary group-open:border-primary transition-all shrink-0">
                    <ChevronDown className="text-muted-foreground group-open:text-white group-open:rotate-180 transition-transform duration-300" size={16} />
                  </div>
                </summary>
                
                <div className="flex flex-col lg:flex-row border-t border-border/50">
                    <div className="flex-1 p-5 md:p-8">
                        <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert font-medium mb-10 text-foreground/80" dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, '<br />') }} />
                        
                        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Was this helpful?</span>
                            {feedbackGiven[faq.id] ? (
                            <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                <CheckCircle2 size={16} /> Thank you!
                            </div>
                            ) : (
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleFeedback(faq.slug, faq.id, true)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all text-[10px] font-black uppercase tracking-widest shadow-none">
                                <ThumbsUp size={14} /> Yes
                                </button>
                                <button onClick={() => handleFeedback(faq.slug, faq.id, false)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-[10px] font-black uppercase tracking-widest shadow-none">
                                <ThumbsDown size={14} /> No
                                </button>
                            </div>
                            )}
                        </div>
                    </div>

                    {faq.related_articles && faq.related_articles.length > 0 && (
                        <div className="w-full lg:w-72 bg-muted/20 p-6 lg:border-l border-border/50">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Related Topics</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                {faq.related_articles.map((related) => (
                                    <li key={related.slug}>
                                        <button 
                                            onClick={() => scrollToArticle(related.slug)}
                                            className="text-left text-xs font-bold text-foreground/70 hover:text-primary transition-colors flex items-start gap-2 group/link"
                                        >
                                            <ArrowRight size={12} className="shrink-0 mt-0.5 lg:opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                            {related.question}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      <section className="bg-muted/30 py-20 md:py-24 border-y border-border shadow-none">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-4 text-foreground uppercase tracking-tight">Still need support?</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-12 font-medium px-4">If these articles didn't solve your issue, our dedicated team is ready to assist you via email.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto px-2">
              <a href="mailto:support@evuka.com" className="flex flex-col items-center p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all group shadow-none">
                <div className="bg-primary/10 p-4 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all mb-4"><Mail size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Email Support</span>
                <span className="font-bold text-foreground text-sm md:text-base">support@evuka.com</span>
              </a>
              <div className="flex flex-col items-center p-8 bg-card border border-border rounded-2xl opacity-50 cursor-not-allowed shadow-none">
                <div className="bg-secondary/10 p-4 rounded-xl text-secondary mb-4"><MessageCircle size={24} /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Direct Chat</span>
                <span className="font-bold text-foreground italic uppercase text-sm md:text-base">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}