"use client";

import React from "react";

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

// --- 1. Define the props to accept the course title ---
interface HeaderProps {
  courseTitle: string;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// --- 2. Accept courseTitle as a prop ---
const CourseHeader = ({ courseTitle, setIsSidebarOpen }: HeaderProps) => {
  return (
    <header className="bg-background p-4 flex items-center justify-between sticky top-0 z-40 border-b border-gray-200">
      {/* --- 3. Use the dynamic courseTitle prop --- */}
      <h1 className="text-xl font-bold text-gray-900 truncate pr-4">
        {courseTitle}
      </h1>

      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden text-gray-800 hover:text-[#2694C6] transition"
      >
        <MenuIcon />
      </button>
    </header>
  );
};

export default CourseHeader;