"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, ShieldCheck, Video, 
  ArrowRight, PlayCircle, Clock, Calendar,
  BookText, Radio
} from "lucide-react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import EnrolledCourseCard from "./EnrolledCourseCard";
import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import api from "@/lib/api/axios";
import { Button } from "@/components/ui/button";
import { EventDetailModal } from "../events/EventDetailModal";

interface LiveSession {
  id: number;
  title: string;
  course: string;
  course_slug: string;
  start: string;
  is_live: boolean;
  can_join: boolean;
  room_id: string | null;
}

interface DashboardData {
  greeting: string;
  context: {
    type: "personal" | "organization";
    label: string;
    org_slug: string | null;
  };
  live_today: LiveSession[];
  live_upcoming: LiveSession[];
  courses: any[];
  events: any[];
  library: any[];
  organizations: any[];
}

const SectionHeader = ({ title, link, linkText, hideLink }: { title: string; link?: string; linkText?: string; hideLink?: boolean }) => (
  <div className="flex flex-row justify-between items-center mb-6 border-b border-gray-100 pb-3">
    <h2 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-tighter">{title}</h2>
    {link && !hideLink && (
      <Link href={link} className="text-[10px] font-black uppercase tracking-widest text-[#2694C6] hover:underline flex items-center gap-1">
        {linkText} <ArrowRight size={12} />
      </Link>
    )}
  </div>
);

const EmptyState = ({ icon: Icon, title, description, actionLink, actionText }: { 
  icon: any, 
  title: string, 
  description?: string,
  actionLink?: string,
  actionText?: string 
}) => (
  <div className="col-span-full py-12 px-6 text-center bg-gray-50/50 rounded-md border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100">
        <Icon size={20} className="text-gray-300" />
    </div>
    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 mb-1">{title}</h3>
    {description && <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mb-4">{description}</p>}
    {actionLink && actionText && (
      <Link href={actionLink} className="text-[9px] font-black uppercase tracking-widest text-[#2694C6] hover:bg-[#2694C6]/5 px-4 py-1.5 rounded border border-[#2694C6]/20 transition-all">
        {actionText}
      </Link>
    )}
  </div>
);

export default function DashboardView({ slug }: { slug: string | null }) {
  const { user, loading } = useAuth();
  const { activeSlug } = useActiveOrg();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [activeEventSlug, setActiveEventSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchDashboardData = async () => {
      setFetching(true);
      try {
        const url = slug ? `/users/dashboard/?active_org=${slug}` : "/users/dashboard/";
        const res = await api.get(url);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchDashboardData();
  }, [user, slug]);

  if (loading || (fetching && !data)) return <DashboardSkeleton />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="bg-primary pt-12 pb-24">
        <div className="container mx-auto px-4 max-w-7xl text-white">
          <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] opacity-70 mb-2">
            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
            {data.context.label}
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2">{data.greeting}!</h1>
          <p className="opacity-70 text-sm md:text-base font-medium max-w-xl leading-tight">
            {slug 
              ? `Welcome to the ${data.context.label} learning portal.`
              : "Your learning journey continues. Pick up exactly where you left off."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-12 space-y-8">
        
        {data.live_today.length > 0 && (
          <section className="bg-white rounded-md border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Radio className="text-[#2694C6] animate-pulse" size={20} />
                <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900">Happening Today</h2>
              </div>
              <Link href={activeSlug ? `/${activeSlug}/dashboard/live-sessions` : "/dashboard/live-sessions"} className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-[#2694C6] transition-colors">
                All Sessions
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.live_today.map((session) => (
                <div key={session.id} className="bg-gray-50 border border-gray-100 rounded-md p-5 flex flex-col justify-between group transition-all hover:border-[#2694C6]/20">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-black text-[#2694C6] uppercase tracking-widest">{session.course}</p>
                      {session.is_live && <span className="flex h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />}
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 leading-tight uppercase tracking-tight">{session.title}</h3>
                    <div className="flex items-center gap-2 mt-2 text-gray-400">
                        <Clock size={10} />
                        <span className="text-[9px] font-bold uppercase">{new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  {session.can_join ? (
                    <Button 
                      className="w-full h-10 font-black uppercase text-[10px] tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/10 transition-all active:scale-[0.98]"
                      onClick={() => router.push(`/course-learning/${session.course_slug}?type=live&id=${session.id}&mode=player`)}
                    >
                      Join Now
                    </Button>
                  ) : (
                    <div className="w-full h-10 flex items-center justify-center border border-gray-200 rounded text-[9px] font-black uppercase text-gray-400 tracking-widest bg-white/50">
                        Starts {new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-md border border-border p-6 shadow-sm">
              <SectionHeader 
                title="My Learning" 
                link="/courses" 
                linkText="Explore Marketplace" 
                hideLink={!!slug} 
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.courses.length > 0 ? (
                  data.courses.map((course) => <EnrolledCourseCard key={course.slug} course={course} />)
                ) : (
                  <EmptyState 
                    icon={PlayCircle} 
                    title="No Active Courses" 
                    description={slug ? "Contact your administrator for enrollment" : "Explore our catalog to start learning"}
                    actionLink={slug ? undefined : "/courses"}
                    actionText={slug ? undefined : "Browse Courses"}
                  />
                )}
              </div>
            </section>

            {data.live_upcoming.length > 0 && (
              <section className="bg-white rounded-md border border-border p-6 shadow-sm">
                <SectionHeader 
                  title="Future Sessions" 
                  link={activeSlug ? `/${activeSlug}/dashboard/live-sessions` : "/dashboard/live-sessions"} 
                  linkText="All Sessions" 
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.live_upcoming.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 rounded bg-gray-50 border border-gray-100 transition-all hover:border-[#2694C6]/20">
                      <div className="min-w-0">
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{session.course}</p>
                        <h4 className="text-[10px] font-bold text-gray-900 uppercase truncate">{session.title}</h4>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <p className="text-[9px] font-black text-[#2694C6] uppercase">
                          {new Date(session.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase">
                          {new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white rounded-md border border-border p-6 shadow-sm">
              <SectionHeader 
                title="My Library" 
                link="/my-library" 
                linkText="Open Library" 
                hideLink={false} 
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.library.length > 0 ? (
                  data.library.map((book) => (
                    <Link href={`/read/${book.slug}`} key={book.slug} className="group">
                      <div className="aspect-[3/4] relative rounded-sm overflow-hidden shadow-sm border border-gray-100 mb-2 bg-gray-50">
                        <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <h4 className="text-[10px] font-black text-gray-900 uppercase leading-tight line-clamp-1 group-hover:text-[#2694C6] transition-colors">{book.title}</h4>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{book.author}</p>
                    </Link>
                  ))
                ) : (
                  <EmptyState 
                    icon={BookText} 
                    title="No Books Found" 
                    description="Visit the bookstore to add items to your collection"
                    actionLink="/books"
                    actionText="Visit Bookstore"
                  />
                )}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white rounded-md border border-border p-6 shadow-sm">
              <SectionHeader 
                title="Events" 
                link={activeSlug ? `/${activeSlug}/dashboard/registered-events` : "/dashboard/registered-events"} 
                linkText="View All" 
                hideLink={!!slug} 
              />
              <div className="space-y-5">
                {data.events.length > 0 ? (
                  data.events.map((event) => (
                    <div key={event.slug} onClick={() => setActiveEventSlug(event.slug)} className="flex gap-4 group cursor-pointer">
                      <div className="h-12 w-12 shrink-0 relative rounded-sm overflow-hidden bg-gray-100 border border-gray-100">
                        <Image src={event.banner || "/placeholder.svg"} alt="" fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex flex-col justify-center">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-tighter leading-tight line-clamp-1 group-hover:text-[#2694C6] transition-colors">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-black text-[#2694C6] uppercase bg-[#2694C6]/5 px-1.5 py-0.5 rounded">{event.type}</span>
                          <span className="text-[8px] text-gray-400 font-bold">{new Date(event.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 flex flex-col items-center border-t border-gray-50">
                    <Calendar size={20} className="text-gray-200 mb-2" />
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">No upcoming events</p>
                  </div>
                )}
              </div>
            </section>

            {!slug && data.organizations.length > 0 && (
              <section className="bg-white rounded-md border border-border p-6 shadow-sm">
                <SectionHeader title="My Organizations" />
                <div className="space-y-3">
                  {data.organizations.map((org) => (
                    <Link href={`/${org.slug}`} key={org.slug} className="flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-[#2694C6]/5 transition-all border border-gray-100 group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 relative rounded-full overflow-hidden bg-white border border-gray-200">
                          {org.logo ? <Image src={org.logo} alt="" fill className="object-cover" /> : <Building2 size={12} className="m-2 text-gray-400" />}
                        </div>
                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter group-hover:text-[#2694C6]">{org.name}</span>
                      </div>
                      <ShieldCheck size={14} className="text-[#2694C6]" />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      <EventDetailModal 
        isOpen={!!activeEventSlug} 
        onClose={() => setActiveEventSlug(null)} 
        slug={activeEventSlug} 
      />
    </div>
  );
}

const DashboardSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="bg-primary pt-12 pb-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <Skeleton width={150} height={12} className="mb-4 opacity-20" />
          <Skeleton width={300} height={40} className="mb-4 opacity-20" />
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-7xl -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton height={300} borderRadius={4} />
            <Skeleton height={200} borderRadius={4} />
          </div>
          <div className="space-y-8">
            <Skeleton height={300} borderRadius={4} />
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);