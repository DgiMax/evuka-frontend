"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useActiveOrg } from "@/lib/hooks/useActiveOrg";

const MenuIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

interface HeaderProps {
  courseTitle: string;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CourseHeader = ({ courseTitle, setIsSidebarOpen }: HeaderProps) => {
  const { activeSlug } = useActiveOrg();

  const dashboardHref = activeSlug ? `/${activeSlug}/dashboard` : "/dashboard";

  return (
    <header className="bg-background h-[64px] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40 border-b border-gray-200">
      <div className="flex items-center gap-4 min-w-0">
        <Link
          href={dashboardHref}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all group shrink-0"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden md:inline text-sm font-bold uppercase tracking-wider">
            Dashboard
          </span>
        </Link>

        <div className="h-6 w-[1px] bg-gray-200 hidden md:block" />

        <h1 className="text-base md:text-lg font-black text-gray-900 truncate">
          {courseTitle}
        </h1>
      </div>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden p-2 text-gray-800 hover:text-[#2694C6] transition-colors"
      >
        <MenuIcon />
      </button>
    </header>
  );
};

export default CourseHeader;