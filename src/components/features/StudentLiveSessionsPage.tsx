"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Video, Search, Calendar, Clock, Radio, ArrowLeft, Inbox,
  ChevronDown, CheckCircle2, X, LayoutGrid, BookOpen, Layers
} from "lucide-react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { useAuth } from "@/context/AuthContext";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import api from "@/lib/api/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface LiveSession {
  id: number;
  title: string;
  course_title: string;
  course_slug: string;
  start: string;
  end: string;
  is_live: boolean;
  can_join: boolean;
  status: 'upcoming' | 'live' | 'completed';
}

interface GroupedClass {
    class_title: string;
    lessons: LiveSession[];
}

interface GroupedCourse {
  course: string;
  classes: GroupedClass[];
}

interface LiveSessionsData {
  context: { type: string; label: string; };
  happening_today: LiveSession[];
  grouped_data: GroupedCourse[];
}

export default function StudentLiveSessionsPage() {
  const { user, loading: authLoading } = useAuth();
  const { activeSlug } = useActiveOrg();
  const router = useRouter();

  const [data, setData] = useState<LiveSessionsData | null>(null);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  
  const [collapsedCourses, setCollapsedCourses] = useState<Record<string, boolean>>({});
  const [collapsedClasses, setCollapsedClasses] = useState<Record<string, boolean>>({});
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const fetchSessions = useCallback(async () => {
    setFetching(true);
    try {
      const params = new URLSearchParams();
      if (activeSlug) params.append("active_org", activeSlug);
      if (searchQuery) params.append("search", searchQuery);
      if (dateFilter) params.append("date", dateFilter);
      const res = await api.get(`/users/student/live-sessions/?${params.toString()}`);
      
      const serverData: LiveSessionsData = res.data;
      setData(serverData);

      if (serverData.grouped_data.length > 0) {
          const firstCourse = serverData.grouped_data[0];
          const courseMap: Record<string, boolean> = {};
          const classMap: Record<string, boolean> = {};

          serverData.grouped_data.forEach((c, idx) => {
              courseMap[c.course] = idx !== 0; 
          });

          if (firstCourse.classes.length > 0) {
              firstCourse.classes.forEach((cl, idx) => {
                  classMap[`${firstCourse.course}-${cl.class_title}`] = idx !== 0;
              });
          }
          
          setCollapsedCourses(courseMap);
          setCollapsedClasses(classMap);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  }, [activeSlug, searchQuery, dateFilter]);

  useEffect(() => {
    if (!authLoading && user) fetchSessions();
  }, [fetchSessions, authLoading, user]);

  const toggleCourse = (name: string) => setCollapsedCourses(p => ({ ...p, [name]: !p[name] }));
  const toggleClass = (courseName: string, classTitle: string) => {
      const key = `${courseName}-${classTitle}`;
      setCollapsedClasses(p => ({ ...p, [key]: !p[key] }));
  };

  const { futureData, finishedData } = useMemo(() => {
    if (!data) return { futureData: [], finishedData: [] };
    
    const future: GroupedCourse[] = [];
    const finished: GroupedCourse[] = [];

    data.grouped_data.forEach(courseGroup => {
        const futureClasses: GroupedClass[] = [];
        const finishedClasses: GroupedClass[] = [];

        courseGroup.classes.forEach(cls => {
            const upLessons = cls.lessons.filter(l => l.status !== 'completed');
            const finLessons = cls.lessons.filter(l => l.status === 'completed');

            if (upLessons.length > 0) futureClasses.push({ class_title: cls.class_title, lessons: upLessons });
            if (finLessons.length > 0) finishedClasses.push({ class_title: cls.class_title, lessons: finLessons });
        });

        if (futureClasses.length > 0) future.push({ course: courseGroup.course, classes: futureClasses });
        if (finishedClasses.length > 0) finished.push({ course: courseGroup.course, classes: finishedClasses });
    });

    return { futureData: future, finishedData: finished };
  }, [data]);

  const isDataEmpty = !data?.happening_today?.length && !futureData.length && !finishedData.length;

  if (authLoading || (fetching && !data)) return <LiveSessionsSkeleton />;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
            <div>
              <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest mb-4">
                <ArrowLeft size={14} /> Back
              </button>
              <div className="flex items-center gap-2 font-black uppercase text-[9px] tracking-[0.3em] text-[#2694C6] mb-1">
                <Video size={12} /> {data?.context.label}
              </div>
              <h1 className="text-3xl font-black tracking-tighter uppercase leading-none text-gray-900">Live Classroom</h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="text" placeholder="Search sessions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-md py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-[#2694C6] w-full md:w-64 transition-all" />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="bg-white border border-gray-200 text-gray-900 rounded-md py-2.5 pl-10 pr-4 text-xs font-bold appearance-none focus:outline-none focus:border-[#2694C6]" />
              </div>
            </div>
          </div>

          {isDataEmpty ? (
            <div className="py-32 text-center bg-white rounded-md border-2 border-dashed border-gray-200">
               <Inbox className="mx-auto text-gray-200 mb-4" size={48} />
               <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">No sessions available</h3>
               <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {data?.happening_today && data.happening_today.length > 0 && (
                <section className="bg-white rounded-md border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Radio className="text-[#2694C6] animate-pulse" size={20} />
                    <h2 className="text-sm font-black uppercase tracking-tighter text-gray-900">Happening Today</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.happening_today.map((session) => (
                      <div key={session.id} className="bg-gray-50 border border-gray-100 rounded-md p-5 flex flex-col justify-between group transition-all hover:border-[#2694C6]/20">
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                             <p className="text-[9px] font-black text-[#2694C6] uppercase tracking-widest">{session.course_title}</p>
                             {session.is_live && <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
                          </div>
                          <h3 className="font-bold text-sm text-gray-900 leading-tight uppercase tracking-tight">{session.title}</h3>
                          <div className="flex items-center gap-2 mt-2 text-gray-400">
                              <Clock size={10} />
                              <span className="text-[9px] font-bold uppercase">{new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        {session.can_join ? (
                          <Button onClick={() => router.push(`/course-learning/${session.course_slug}?type=live&id=${session.id}&mode=player`)} className="w-full h-10 font-black uppercase text-[10px] tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-[0.98]">Join Now</Button>
                        ) : (
                          <div className="w-full h-10 flex items-center justify-center border border-gray-200 rounded text-[9px] font-black uppercase text-gray-400 tracking-widest bg-white/50 text-center">Starts Soon</div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {futureData.length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center gap-2 px-2">
                     <Layers className="text-gray-400" size={16} />
                     <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Upcoming Curriculum</h2>
                  </div>
                  
                  {futureData.map((courseGroup) => (
                    <div key={courseGroup.course} className="space-y-4">
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                          <button onClick={() => toggleCourse(courseGroup.course)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-all text-left">
                              <div className="flex items-center gap-4">
                                  <div className="bg-primary/5 p-2.5 rounded-md border border-primary/10">
                                      <BookOpen size={16} className="text-primary" />
                                  </div>
                                  <div>
                                      <h3 className="text-[12px] font-black uppercase tracking-widest text-gray-900">{courseGroup.course}</h3>
                                      <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 tracking-tight">{courseGroup.classes.length} Active Classes</p>
                                  </div>
                              </div>
                              <ChevronDown className={cn("text-gray-400 transition-transform duration-300", !collapsedCourses[courseGroup.course] && "rotate-180")} size={20} />
                          </button>

                          {!collapsedCourses[courseGroup.course] && (
                              <div className="p-4 md:p-6 bg-gray-50/30 border-t border-gray-100 space-y-4 animate-in fade-in duration-300">
                                  {courseGroup.classes.map((classGroup) => {
                                      const classKey = `${courseGroup.course}-${classGroup.class_title}`;
                                      return (
                                          <div key={classGroup.class_title} className="bg-white border border-gray-200 rounded-md overflow-hidden">
                                              <button onClick={() => toggleClass(courseGroup.course, classGroup.class_title)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white">
                                                  <div className="flex items-center gap-3 text-gray-600">
                                                      <LayoutGrid size={14} className="text-primary/40" />
                                                      <span className="text-[10px] font-black uppercase tracking-widest">{classGroup.class_title}</span>
                                                      <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded text-gray-400 font-bold">{classGroup.lessons.length} Sessions</span>
                                                  </div>
                                                  <ChevronDown className={cn("text-gray-300 transition-transform", !collapsedClasses[classKey] && "rotate-180")} size={14} />
                                              </button>
                                              
                                              {!collapsedClasses[classKey] && (
                                                  <div className="divide-y divide-gray-50 border-t border-gray-50">
                                                      {classGroup.lessons.map((session) => (
                                                          <div key={session.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:bg-gray-50/50 transition-all">
                                                              <div className="flex gap-4 items-center min-w-0">
                                                                  <div className={cn("h-10 w-10 rounded-md flex items-center justify-center shrink-0", session.status === 'live' ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400")}>
                                                                      {session.status === 'live' ? <Radio size={18} /> : <Clock size={18} />}
                                                                  </div>
                                                                  <div className="min-w-0">
                                                                      <h4 className="text-[13px] font-black text-gray-900 uppercase tracking-tight truncate">{session.title}</h4>
                                                                      <div className="flex items-center gap-3 mt-1">
                                                                          <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1"><Calendar size={10} /> {new Date(session.start).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                                          <span className="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1"><Clock size={10} /> {new Date(session.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                              <div className="flex items-center justify-end sm:justify-start">
                                                                  {session.can_join ? (
                                                                      <Button onClick={() => router.push(`/course-learning/${session.course_slug}?type=live&id=${session.id}&mode=player`)} className="h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[9px] tracking-widest rounded transition-all active:scale-95">Join Session</Button>
                                                                  ) : (
                                                                      <div className="px-4 py-2 border border-gray-100 rounded text-[8px] font-black uppercase text-gray-300 tracking-widest italic whitespace-nowrap">Access Scheduled</div>
                                                                  )}
                                                              </div>
                                                          </div>
                                                      ))}
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>
                          )}
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {finishedData.length > 0 && (
                <section className="pt-10 border-t border-gray-200">
                     <button onClick={() => setIsArchiveOpen(!isArchiveOpen)} className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 rounded-md border border-gray-200 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="p-2.5 rounded-md bg-gray-100 text-gray-400">
                                <CheckCircle2 size={18} />
                           </div>
                           <div className="text-left">
                                <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-600 leading-none">Finished Sessions Archive</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Playback recorded virtual classes</span>
                           </div>
                        </div>
                        <ChevronDown className={cn("text-gray-400 transition-transform duration-500", isArchiveOpen && "rotate-180")} size={20} />
                     </button>
                     
                     {isArchiveOpen && (
                       <div className="mt-6 space-y-4 animate-in slide-in-from-top-4 duration-500">
                          {finishedData.map((courseGroup) => (
                            <div key={`fin-${courseGroup.course}`} className="bg-white border border-gray-200 rounded-md p-6 opacity-80 transition-opacity hover:opacity-100">
                               <div className="flex items-center gap-3 mb-4 border-b border-gray-50 pb-3">
                                    <BookOpen size={12} className="text-gray-300" />
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{courseGroup.course}</h5>
                               </div>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                  {courseGroup.classes.flatMap(c => c.lessons).map(session => (
                                    <div key={session.id} className="flex items-center justify-between group py-2 border-b border-gray-50 last:border-0">
                                       <div className="min-w-0">
                                            <span className="block text-[11px] font-black text-gray-600 uppercase truncate group-hover:text-primary transition-colors">{session.title}</span>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">{new Date(session.start).toLocaleDateString()}</span>
                                       </div>
                                       <Button 
                                          variant="ghost" 
                                          onClick={() => router.push(`/course-learning/${session.course_slug}?type=live&id=${session.id}`)}
                                          className="h-8 px-4 text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white"
                                        >
                                            Review
                                        </Button>
                                    </div>
                                  ))}
                               </div>
                            </div>
                          ))}
                       </div>
                     )}
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveSessionsSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f4f6" highlightColor="#ffffff">
      <div className="min-h-screen bg-[#F8F9FA] py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="border-b border-gray-200 pb-8 mb-12">
            <Skeleton width={100} height={10} className="mb-4" />
            <Skeleton width={300} height={40} />
          </div>
          <Skeleton height={200} borderRadius={8} className="mb-10" />
          <div className="space-y-6">
            <Skeleton height={80} borderRadius={8} />
            <Skeleton height={80} borderRadius={8} />
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}