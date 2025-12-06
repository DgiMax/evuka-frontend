"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EnrolledCourseCard from "./EnrolledCourseCard";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api/axios";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";
import { Building2, ShieldCheck } from "lucide-react";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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

interface Organization {
  name: string;
  slug: string;
  logo: string | null;
  level: string;
}

interface DashboardData {
  context_type: "personal" | "organization";
  display_name: string;
  enrolled_courses: Course[];
  registered_events: Event[];
  my_organizations?: Organization[];
}

const EmptyPlaceholder = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-md col-span-full h-32">
    <p className="text-gray-500 text-base italic text-center">{message}</p>
  </div>
);

const DashboardSkeleton = () => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="rounded-md p-6 md:p-8 mb-8 relative shadow-sm bg-gray-100 h-40 flex flex-col justify-center">
        <Skeleton width={100} className="mb-2" />
        <Skeleton width="50%" height={32} className="mb-2" />
        <Skeleton width="30%" />
      </div>

      {[1, 2, 3].map((section) => (
        <section key={section} className="mb-10 p-6 bg-white rounded-md shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
            <Skeleton width={200} height={24} />
            <Skeleton width={80} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((card) => (
              <div key={card} className="border border-gray-200 rounded-md overflow-hidden bg-white">
                <Skeleton height={140} />
                <div className="p-4">
                  <Skeleton width="80%" height={20} className="mb-2" />
                  <Skeleton width="40%" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </SkeletonTheme>
);

const OrganizationList = ({ orgs }: { orgs: Organization[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {orgs.length > 0 ? (
      orgs.map((org) => (
        <Link href={`/${org.slug}`} key={org.slug} className="block group h-full">
            <div className="bg-card p-4 border border-border h-full rounded-lg shadow-sm hover:shadow-md hover:border-primary transition-all flex items-start space-x-4">
                
                <div className="relative h-16 w-16 flex-shrink-0 bg-muted rounded-full border border-border overflow-hidden">
                    {org.logo ? (
                        <Image
                            src={org.logo}
                            alt={org.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                            <Building2 className="w-8 h-8" />
                        </div>
                    )}
                </div>
                
                <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-foreground text-base group-hover:text-primary transition-colors leading-snug break-words">
                        {org.name}
                    </h3>
                    
                    <div className="flex items-center mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/30">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            {org.level || "Member"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
      ))
    ) : (
      <EmptyPlaceholder message="You are not a member of any organization yet." />
    )}
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
            ? `/${activeSlug}/events/${event.slug}`
            : `/events/${event.slug}`;
          return (
            <Link href={eventHref} key={event.slug} className="block group h-full">
              <div className="bg-white p-1 overflow-hidden border border-gray-200 h-full rounded-md shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="relative h-32 w-full flex-shrink-0">
                  <Image
                    src={event.banner_image || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:opacity-90 transition-opacity rounded-sm"
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
    if (!user) return;

    let isMounted = true;
    setFetching(true);
    setError(null);

    const fetchDashboardData = async () => {
      let apiUrl = "/users/dashboard/";
      if (activeSlug) {
        apiUrl = `/users/dashboard/?active_org=${activeSlug}`;
      }

      try {
        const res = await api.get(apiUrl);
        if (isMounted) {
          setData(res.data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Could not load dashboard data.");
        }
      } finally {
        if (isMounted) {
          setFetching(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };

  }, [user, activeSlug]);

  if (loading || (fetching && !data)) {
    return <DashboardSkeleton />;
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
        <p className="text-gray-500 text-lg">Dashboard data is unavailable.</p>
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

        <div className="bg-gradient-to-r from-primary to-[#5BB5D8] rounded-lg p-5 sm:p-6 md:p-8 mb-8 relative shadow-xl">
            <p className="text-white/90 text-xs sm:text-sm mb-1">{currentDate}</p>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-1 break-words">
                Welcome{data.context_type === "personal" ? " back" : ""}, {data.display_name}!
            </h1>
            <p className="text-white/80 text-xs sm:text-sm md:text-base leading-snug">
                {welcomeMessage}
            </p>
        </div>

        {!activeSlug && data.my_organizations && (
          <section className="mb-10 p-6 bg-white rounded-md shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-border/70 pb-3">
                <h2 className="text-xl md:text-2xl font-bold text-foreground shrink-0">
                    My Organizations
                </h2>
                <Link
                    href="/organizations/browse"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors mt-2 sm:mt-0"
                >
                    Browse More
                </Link>
            </div>
            <OrganizationList orgs={data.my_organizations} />
          </section>
        )}

        <section className="mb-10 p-6 bg-white rounded-md shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-border/70 pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-foreground shrink-0">
                  My Enrolled Courses
              </h2>
              {!activeSlug && (
                  <Link
                      href={coursesLink}
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors mt-2 sm:mt-0"
                  >
                      Browse All
                  </Link>
              )}
          </div>
          <CourseList courses={data.enrolled_courses} />
        </section>

        <section className="p-6 bg-white rounded-md shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-border/70 pb-3">
              <h2 className="text-xl md:text-2xl font-bold text-foreground shrink-0">
                  Upcoming Events
              </h2>
              {!activeSlug && (
                  <Link
                      href={eventsLink}
                      className="text-sm text-primary hover:text-primary/80 font-medium transition-colors mt-2 sm:mt-0"
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