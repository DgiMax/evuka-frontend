// components/pages/DashboardView.tsx - Finalized Context-Aware Fetching

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import { useRouter } from "next/navigation";
import EnrolledCourseCard from "./EnrolledCourseCard"
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { Loader2 } from "lucide-react";


interface Course {
    slug: string;
    title: string;
    tutor: string;
    progress: number;
    thumbnail: string | null;
}

interface Event {
    slug: string;
    title: string;
    start_time: string;
    banner_image: string | null;
}

interface DashboardData {
    context_type: "personal" | "organization";
    display_name: string;
    enrolled_courses: Course[];
    registered_events: Event[];
}

const EmptyPlaceholder = ({ message }: { message: string }) => (
    <div className="flex items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-md col-span-full h-32">
        <p className="text-gray-500 text-base italic text-center">{message}</p>
    </div>
);

const CourseList = ({ courses }: { courses: Course[] }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
            courses.map((course) => (
                <EnrolledCourseCard key={course.slug} course={course} />
            ))
        ) : (
            <EmptyPlaceholder message="You haven't enrolled in any active courses yet. Start your learning journey!" />
        )}
    </div>
);

const EventList = ({ events }: { events: Event[] }) => {
    const { activeSlug } = useActiveOrg();

    const PRIMARY_BLUE_HOVER = "hover:text-[#2E7FA0]";

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
                events.map((event) => {
                    const eventHref = activeSlug
                        ? `/ ${activeSlug}/events/${event.slug}`
                        : `/events/${event.slug}`;
                    return (
                        <Link href={eventHref} key={event.slug} className="block group h-full">
                            <div className="bg-white p-1 overflow-hidden border border-gray-200 h-full rounded-md shadow-sm hover:shadow-md transition-all flex flex-col">
                                <div className="relative h-32 w-full flex-shrink-0">
                                    <Image
                                        src={event.banner_image || "/placeholder.svg"}
                                        alt={event.title}
                                        fill
                                        sizes="100vw"
                                        style={{ objectFit: "cover" }}
                                        className="group-hover:opacity-90 transition-opacity rounded-sm"
                                    />
                                </div>
                                <div className="p-3 flex flex-col flex-grow justify-center">
                                    <h3 className={`font-bold text-sm mb-0.5 line-clamp-2 leading-snug text-gray-800 ${PRIMARY_BLUE_HOVER}`}>
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs">
                                        {new Date(event.start_time).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <EmptyPlaceholder message="You have no upcoming events registered." />
            )}
        </div>
    );
};


export default function DashboardView() {
    const { user, loading } = useAuth();
    const { activeSlug } = useActiveOrg(); 
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (!user) {
            return; 
        }
        
        setFetching(true);
        setError(null);
        setData(null); 

        const fetchDashboardData = async () => {
            
            let apiUrl = "/users/dashboard/";
            if (activeSlug) {
                apiUrl = `/users/dashboard/?active_org=${activeSlug}`;
            }

            try {
                const res = await api.get(apiUrl); 
                setData(res.data);
            } catch (err) {
                console.error("Dashboard fetch error:", err);
                setError("Could not load dashboard data.");
                setData(null);
            } finally {
                setFetching(false);
            }
        };
        
        const timeoutId = setTimeout(fetchDashboardData, 0); 

        return () => clearTimeout(timeoutId);

    }, [user, activeSlug]); 

    if (loading || fetching) { 
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                 <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
                <p className="text-gray-500 text-lg">Loading your dashboard...</p>
            </div>
        );
    }
    if (error) { 
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }
    if (!data) { 
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg">
                    Dashboard data is unavailable.
                </p>
            </div>
        );
    }

    const currentDate = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const welcomeMessage =
        data.context_type === "personal"
            ? "Every step forward counts — dive back into your learning."
            : `Viewing the dashboard for ${data.display_name}.`;

    const coursesLink = activeSlug ? `/${activeSlug}/courses` : "/courses";
    const eventsLink = activeSlug ? `/${activeSlug}/events` : "/events";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                
                <div className="bg-gradient-to-r from-[#3B9FC9] to-[#5BB5D8] rounded-md p-6 md:p-8 mb-8 relative shadow-lg">
                    <p className="text-white/90 text-sm mb-1">{currentDate}</p>
                    <h1 className="text-white text-2xl md:text-3xl font-bold mb-1">
                        Welcome {data.context_type === "personal" ? "back, " : ""}{data.display_name}!
                    </h1>
                    <p className="text-white/80 text-sm md:text-base">
                        {welcomeMessage}
                    </p>
                </div>

                <section className="mb-10 p-6 bg-white rounded-md shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">My Enrolled Courses</h2>
                        {!activeSlug && (
                            <Link
                                href={coursesLink}
                                className="text-sm text-[#3B9FC9] hover:text-[#2E7FA0] font-medium transition-colors"
                            >
                                Browse All
                            </Link>
                        )}
                    </div>
                    <CourseList courses={data.enrolled_courses} />
                </section>

                <section className="p-6 bg-white rounded-md shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800">Upcoming Events</h2>
                        {!activeSlug && (
                            <Link
                                href={eventsLink}
                                className="text-sm text-[#3B9FC9] hover:text-[#2E7FA0] font-medium transition-colors"
                            >
                                View Events
                            </Link>
                        )}
                    </div>
                    <EventList events={data.registered_events} />
                </section>
            </div>
        </div>
    );
}