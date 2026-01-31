"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { TableOfContents } from "@/components/books/TableOfContents";
import { BookActions } from '@/components/books/BookActions';
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { 
  Star, ChevronDown, ChevronUp, BookOpen, Globe, Info, X, Users, Award, Verified,
  InboxIcon, UserCheck2, ArrowLeft, Hash, Calendar, Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BookStickySidebar = ({ book }: { book: any }) => (
  <div className="relative lg:sticky lg:top-20 border-2 border-border rounded-md bg-card overflow-hidden w-full">
    <div className="aspect-[4/5] bg-muted relative border-b border-border flex items-center justify-center p-6 md:p-10">
      <div className="relative w-full h-full shadow-2xl transition-transform hover:scale-[1.02] duration-500 rounded-sm overflow-hidden border border-white/10">
        {book?.cover_image ? (
          <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
        ) : (
          <BookOpen className="h-12 w-12 text-muted-foreground/20" />
        )}
      </div>
    </div>
    
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl md:text-3xl font-black text-foreground">
          {Number(book?.price || 0) > 0 ? `KES ${Number(book.price).toLocaleString()}` : 'Free'}
        </h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#2694C6]">Full Digital Access</p>
      </div>

      <BookActions book={book} />
    </div>
  </div>
);

export default function BookDetailsView() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { activeSlug } = useActiveOrg();
  
  const [book, setBook] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [publisherProfile, setPublisherProfile] = useState<any | null>(null);
  const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);
  const [loadingPublisher, setLoadingPublisher] = useState(false);
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/books/marketplace/${slug}/`);
        setBook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, activeSlug]);

  const handleOpenPublisherProfile = async () => {
    if (!book?.publisher?.username) return;
    setIsPublisherModalOpen(true);
    setLoadingPublisher(true);
    try {
      const res = await api.get(`/users/publisher/${book.publisher.username}/`);
      setPublisherProfile(res.data);
    } catch (err) {
      console.error("Failed to load publisher profile");
    } finally {
      setLoadingPublisher(false);
    }
  };

  if (loading) return <BookDetailSkeleton />;

  const isLongDescription = (book?.long_description?.length || 0) > 800;

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="bg-[#1C1D1F] text-white py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="group flex items-center gap-2 text-gray-300 hover:text-white p-0 hover:bg-transparent font-black uppercase text-[10px] tracking-widest transition-all"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </Button>
          </div>
          <div className="lg:w-2/3 space-y-4">
            <div className="flex gap-2">
              <Badge className="bg-[#2694C6] text-white rounded-sm border-none font-black text-[10px] uppercase px-2 py-0.5">
                {book?.categories?.[0]?.name || "eBook"}
              </Badge>
              <Badge variant="outline" className="text-gray-400 border-gray-700 rounded-sm font-black text-[10px] uppercase px-2 py-0.5">
                {book?.book_format}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {book?.title}
            </h1>
            {book?.subtitle && (
                <p className="text-lg md:text-xl text-gray-400 font-medium tracking-tight mt-[-5px]">
                    {book.subtitle}
                </p>
            )}
            <p className="text-base md:text-lg text-gray-300 font-normal max-w-3xl leading-relaxed">
              {book?.short_description}
            </p>
            
            <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-3 pt-2 text-xs md:text-sm font-bold">
              <div className="flex items-center gap-1.5 text-amber-400">
                <span>{(book?.rating_avg ?? 0).toFixed(1)}</span>
                <Star size={14} className="fill-amber-400" />
                <span className="text-gray-400 underline decoration-dotted font-medium cursor-default">
                  ({(book?.sales_count ?? 0).toLocaleString()} readers)
                </span>
              </div>
              <div className="text-gray-400">
                Written by <span className="text-white font-black">{book?.authors}</span>
              </div>
              <div className="text-gray-400">
                Published by <span onClick={handleOpenPublisherProfile} className="text-[#2694C6] underline underline-offset-4 decoration-1 font-black cursor-pointer hover:text-[#1e7ca8] transition-colors">{book?.publisher?.publisher_name}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-[10px] md:text-xs font-bold text-gray-400">
               <div className="flex items-center gap-1.5"><Calendar size={14} /> Published {new Date(book?.publication_date).toLocaleDateString()}</div>
               <div className="flex items-center gap-1.5"><Globe size={14} /> English</div>
               {book?.isbn && <div className="flex items-center gap-1.5"><Hash size={14} /> ISBN {book.isbn}</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          <aside className="order-1 lg:order-2 lg:col-span-1 mt-6 lg:-mt-64 z-10 w-full max-w-md lg:max-w-none mx-auto lg:mx-0">
            <BookStickySidebar book={book} />
          </aside>

          <main className="order-2 lg:order-1 lg:col-span-2 py-8 md:py-12 space-y-10 md:space-y-12">
            <div className="border border-border rounded-md p-5 md:p-8 bg-card shadow-none">
              <h2 className="text-lg md:text-xl font-black text-foreground mb-6 flex items-center gap-3">
                <Layers className="text-[#2694C6]" size={20} /> Book Specifications
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Format</p>
                    <p className="text-sm font-black text-foreground uppercase">{book?.book_format}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Reading Level</p>
                    <p className="text-sm font-black text-foreground uppercase">
                      {typeof book?.reading_level === 'object' ? book.reading_level.name : book?.reading_level?.replace('_', ' ')}
                    </p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Language</p>
                    <p className="text-sm font-black text-foreground uppercase">English</p>
                </div>
              </div>
            </div>

            <TableOfContents contents={book?.table_of_contents || []} />

            <div className="space-y-6">
              <h2 className="text-xl font-black text-foreground uppercase tracking-widest border-b border-border pb-4">
                About this book
              </h2>
              <div className="relative">
                <div className={cn("prose prose-sm max-w-none text-muted-foreground font-medium leading-relaxed transition-all duration-500", !isExpanded && isLongDescription ? "max-h-80 overflow-hidden" : "max-h-full")}>
                  <ReactMarkdown>{book?.long_description || "No description provided."}</ReactMarkdown>
                </div>
                {!isExpanded && isLongDescription && (
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
                )}
              </div>
              {isLongDescription && (
                <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-[#2694C6] font-black uppercase text-[11px] tracking-widest hover:text-[#1e7ca8] transition-colors group">
                  {isExpanded ? (
                    <>Show Less <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" /></>
                  ) : (
                    <>Read More <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" /></>
                  )}
                </button>
              )}
            </div>

            <div className="space-y-8 pt-6">
              <h2 className="text-xl font-black text-foreground uppercase tracking-widest border-b border-border pb-4">
                Publisher
              </h2>
              <div className="space-y-5">
                <div className="flex items-end gap-4">
                  <div onClick={handleOpenPublisherProfile} className="h-16 w-16 md:h-20 md:w-20 rounded-md bg-muted border border-border flex items-center justify-center font-black text-xl text-[#2694C6] cursor-pointer overflow-hidden shrink-0 transition-transform active:scale-95">
                    {book?.publisher?.publisher_logo ? (
                      <img src={book.publisher.publisher_logo} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="text-2xl">{(book?.publisher?.publisher_name || "P")[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0 pb-1">
                    <h4 onClick={handleOpenPublisherProfile} className="font-black text-[#2694C6] text-lg hover:underline cursor-pointer leading-tight mb-1">
                      {book?.publisher?.publisher_name || "Unknown Publisher"}
                    </h4>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Verified Content Partner</p>
                  </div>
                </div>
                <div className="relative">
                  <div className={cn("text-sm text-muted-foreground font-medium leading-relaxed transition-all duration-300", !isBioExpanded ? "line-clamp-3" : "line-clamp-none")}>
                    {book?.publisher?.bio || "Professional content partner focused on high-quality digital educational resources."}
                  </div>
                </div>
                {book?.publisher?.bio?.length > 150 && (
                  <button onClick={() => setIsBioExpanded(!isBioExpanded)} className="flex items-center gap-2 text-[#2694C6] font-black uppercase text-[10px] tracking-widest hover:text-[#1e7ca8] transition-colors">
                    {isBioExpanded ? <>Show Less <ChevronUp size={14} /></> : <>Read More <ChevronDown size={14} /></>}
                  </button>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <Dialog open={isPublisherModalOpen} onOpenChange={setIsPublisherModalOpen}>
        <DialogContent className="w-[95%] sm:max-w-[550px] lg:max-w-[650px] p-0 gap-0 h-[85vh] md:h-[80vh] flex flex-col border-border/80 shadow-2xl rounded-md bg-background overflow-hidden [&>button]:hidden transition-all duration-300 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          <DialogHeader className="px-5 py-4 border-b bg-muted/50 flex flex-row items-center justify-between shrink-0 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-md border border-primary/20 shrink-0">
                <UserCheck2 className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-sm md:text-base font-bold tracking-tight text-foreground uppercase truncate">Publisher Profile</DialogTitle>
                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.15em]">Verified Content Partner</p>
              </div>
            </div>
            <button onClick={() => setIsPublisherModalOpen(false)} className="rounded-md p-2 hover:bg-muted transition -mr-2">
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
            </button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 space-y-8 custom-scrollbar">
            {loadingPublisher ? (
              <div className="space-y-10 animate-pulse">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-md border border-border bg-muted/10">
                  <div className="h-24 w-24 rounded-md bg-muted shrink-0" />
                  <div className="flex-1 space-y-3 w-full"><div className="h-6 bg-muted w-3/4 rounded" /><div className="h-3 bg-muted w-1/2 rounded" /></div>
                </div>
              </div>
            ) : publisherProfile ? (
              <>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-md border border-border bg-muted/10">
                  <div className="h-24 w-24 rounded-md border-2 border-background shadow-sm overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                    {publisherProfile.profile_image ? <img src={publisherProfile.profile_image} className="w-full h-full object-cover" alt="" /> : <span className="text-3xl font-black text-primary">{publisherProfile.display_name?.[0]}</span>}
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left space-y-2">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h3 className="text-xl font-black tracking-tight text-foreground truncate">{publisherProfile.display_name}</h3>
                      {publisherProfile.is_verified && <Verified size={18} className="text-primary shrink-0" />}
                    </div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.1em] leading-tight">{publisherProfile.headline}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase"><Users size={14} className="text-primary" /> {publisherProfile.total_students?.toLocaleString()} Readers</div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase"><Star size={14} className="text-primary fill-primary" /> {publisherProfile.average_rating} Rating</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[9px]">01</span> Publisher Story
                  </h4>
                  <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed font-medium text-sm border-l-2 border-muted pl-4"><ReactMarkdown>{publisherProfile.bio}</ReactMarkdown></div>
                </div>

                {publisherProfile.books?.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted text-[9px]">02</span> Published Works
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {publisherProfile.books.slice(0, 4).map((book: any) => (
                          <div key={book.slug} className="flex gap-3 p-2 border border-border/50 rounded-md bg-muted/5 items-center">
                            <div className="w-10 h-14 bg-muted shrink-0 overflow-hidden rounded-sm border border-border/50">
                              <img src={book.cover_image} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[10px] font-black text-foreground truncate uppercase leading-tight">{book.title}</p>
                              <p className="text-[8px] text-[#2694C6] font-bold uppercase mt-1">{book.book_format}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20">
                <InboxIcon className="h-10 w-10 text-muted-foreground/20 mb-4" /><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Profile details unavailable</p>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t bg-muted/20 flex justify-end shrink-0">
            <button 
              onClick={() => setIsPublisherModalOpen(false)} 
              className="h-10 px-6 rounded-md font-black text-[10px] text-black uppercase tracking-widest shadow-none bg-muted hover:bg-muted/80 active:scale-[0.98] transition-all"
            >
              Close Profile
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// LOCAL SKELETON COMPONENT
const BookDetailSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="bg-[#1C1D1F] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:w-2/3 space-y-6">
            <div className="flex gap-2">
              <Skeleton width={80} height={20} />
              <Skeleton width={80} height={20} />
            </div>
            <Skeleton height={60} width="85%" />
            <Skeleton height={30} width="70%" />
            <div className="flex gap-8 pt-4">
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
            </div>
          </div>
        </div>
      </div>

      {/* Layout Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sidebar Skeleton */}
          <aside className="order-1 lg:order-2 lg:col-span-1 mt-6 lg:-mt-64 z-10">
            <div className="border-2 border-border rounded-md bg-white overflow-hidden">
               <Skeleton height={320} />
               <div className="p-6 space-y-6">
                  <Skeleton height={40} width="60%" />
                  <Skeleton height={50} width="100%" />
               </div>
            </div>
          </aside>

          {/* Main Body Skeleton */}
          <main className="order-2 lg:order-1 lg:col-span-2 py-12 space-y-12">
            <Skeleton height={140} borderRadius={6} />
            <div className="space-y-4">
              <Skeleton width={200} height={30} />
              <Skeleton height={200} borderRadius={6} />
            </div>
            <div className="space-y-4">
              <Skeleton width={200} height={30} />
              <Skeleton count={3} height={60} />
            </div>
          </main>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);