"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Building2, ShieldCheck, Video, 
  ArrowRight, PlayCircle, Clock, Calendar 
} from "lucide-react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import EnrolledCourseCard from "./EnrolledCourseCard";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LiveSession {
  id: number;
  title: string;
  course: string;
  start: string;
  is_live: boolean;
  room_id: string | null;
}

interface DashboardCourse {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  progress: number;
  is_completed: boolean;
  next_lesson: string;
}

interface DashboardEvent {
  title: string;
  slug: string;
  start: string;
  type: string;
  banner: string | null;
}

interface DashboardBook {
  title: string;
  slug: string;
  cover: string | null;
  author: string;
}

interface DashboardOrg {
  name: string;
  slug: string;
  logo: string | null;
  level: string | null;
}

interface DashboardData {
  greeting: string;
  context: {
    type: "personal" | "organization";
    label: string;
    org_slug: string | null;
  };
  live_now: LiveSession[];
  courses: DashboardCourse[];
  events: DashboardEvent[];
  library: DashboardBook[];
  organizations: DashboardOrg[];
}

const SectionHeader = ({ title, link, linkText }: { title: string; link?: string; linkText?: string }) => (
  <div className="flex flex-row justify-between items-center mb-6 border-b border-gray-100 pb-3">
    <h2 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-tighter">{title}</h2>
    {link && (
      <Link href={link} className="text-[10px] font-black uppercase tracking-widest text-[#2694C6] hover:underline flex items-center gap-1">
        {linkText} <ArrowRight size={12} />
      </Link>
    )}
  </div>
);

export default function DashboardView({ slug }: { slug: string | null }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setFetching(true);
      setData(null);
      
      try {
        const url = slug ? `/users/dashboard/?active_org=${slug}` : "/users/dashboard/";
        const res = await api.get(url, {
            headers: {
                'X-Organization-Slug': slug || ''
            }
        });
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
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 text-white">
              <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] opacity-70">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                {data.context.label}
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter">
                {data.greeting}!
              </h1>
              <p className="opacity-70 text-sm md:text-base font-medium max-w-xl leading-tight">
                {data.context.type === "personal" 
                  ? "Your learning journey continues. Pick up exactly where you left off." 
                  : `Welcome to the ${data.context.label} learning portal.`}
              </p>
            </div>
            
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl -mt-12 space-y-8">
        {data.live_now.length > 0 && (
          <section className="bg-white rounded-md border border-border shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <Video className="text-[#2694C6]" size={20} />
              <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900">Upcoming Live Sessions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.live_now.map((session) => {
                const startTime = new Date(session.start);
                const activationTime = new Date(startTime.getTime() - 20 * 60000);
                const canJoin = now >= activationTime;

                return (
                  <div key={session.id} className="bg-gray-50 border border-gray-100 rounded-md p-5 flex flex-col justify-between group transition-all hover:border-[#2694C6]/30">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[9px] font-black text-[#2694C6] uppercase tracking-widest">{session.course}</p>
                        <div className="flex items-center gap-3 text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar size={10} />
                            <span className="text-[9px] font-bold">
                                {startTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={10} />
                            <span className="text-[9px] font-bold">
                                {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight mb-4">{session.title}</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        disabled={!canJoin}
                        className={cn(
                          "w-full h-10 font-black uppercase text-[10px] tracking-widest transition-all",
                          canJoin ? "bg-[#2694C6] hover:bg-[#1e7ca8] text-white shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        )}
                        onClick={() => router.push(`/live/${session.id}`)}
                      >
                        {canJoin ? "Join Live Now" : "Locked"}
                      </Button>
                      {!canJoin && (
                        <p className="text-[8px] text-center text-amber-600 font-black uppercase tracking-widest">
                          Room activates 20m before schedule
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-md border border-border p-6 shadow-sm">
              <SectionHeader title="My Learning" link={slug ? `/${slug}/courses` : "/courses"} linkText="Explore All" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data.courses.map((course) => (
                  <EnrolledCourseCard key={course.slug} course={course} />
                ))}
                {data.courses.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-gray-50 rounded border-2 border-dashed flex flex-col items-center">
                    <PlayCircle size={32} className="text-gray-300 mb-2" />
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">No Active Enrollments</p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-md border border-border p-6 shadow-sm">
              <SectionHeader title="My Library" link="/books" linkText="Open Library" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {data.library.map((book) => (
                  <Link href={`/books/${book.slug}`} key={book.slug} className="group">
                    <div className="aspect-[3/4] relative rounded-sm overflow-hidden shadow-sm border border-gray-100 mb-2 bg-gray-50">
                      <Image src={book.cover || "/placeholder.svg"} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h4 className="text-[10px] font-black text-gray-900 uppercase leading-tight line-clamp-1 group-hover:text-[#2694C6] transition-colors">{book.title}</h4>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">{book.author}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="bg-white rounded-md border border-border p-6 shadow-sm">
              <SectionHeader title="Events Calendar" link="/events" linkText="View All" />
              <div className="space-y-5">
                {data.events.map((event) => (
                  <Link href={`/events/${event.slug}`} key={event.slug} className="flex gap-4 group">
                    <div className="h-14 w-14 shrink-0 relative rounded-sm overflow-hidden bg-gray-100 border border-gray-100">
                      <Image src={event.banner || "/placeholder.svg"} alt="" fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex flex-col justify-center">
                      <h4 className="text-[11px] font-black text-gray-900 uppercase tracking-tighter leading-tight line-clamp-1 group-hover:text-[#2694C6] transition-colors">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-black text-[#2694C6] uppercase bg-[#2694C6]/5 px-1.5 py-0.5 rounded">{event.type}</span>
                        <span className="text-[9px] text-gray-400 font-bold">
                          {new Date(event.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {!slug && data.organizations.length > 0 && (
              <section className="bg-white rounded-md border border-border p-6 shadow-sm">
                <SectionHeader title="Organizations" />
                <div className="space-y-3">
                  {data.organizations.map((org) => (
                    <Link href={`/${org.slug}`} key={org.slug} className="flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-[#2694C6]/5 transition-all border border-gray-100 group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 relative rounded-full overflow-hidden bg-white border border-gray-200">
                          {org.logo ? <Image src={org.logo} alt="" fill className="object-cover" /> : <Building2 size={14} className="m-2 text-gray-400" />}
                        </div>
                        <span className="text-[11px] font-black text-gray-900 uppercase tracking-tighter group-hover:text-[#2694C6]">{org.name}</span>
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
          <Skeleton width={500} height={20} className="opacity-20" />
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-7xl -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton height={400} borderRadius={8} />
            <Skeleton height={250} borderRadius={8} />
          </div>
          <div className="space-y-8">
            <Skeleton height={350} borderRadius={8} />
            <Skeleton height={200} borderRadius={8} />
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);