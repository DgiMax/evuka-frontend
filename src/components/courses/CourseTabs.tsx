"use client";

import React from "react";
import { ActiveContent } from "./CourseLearningView";
import { cn } from "@/lib/utils";

export type TabType = "Overview" | "Content" | "Resources" | "Q&A" | "Notes" | "Announcements";

interface CourseContentTabsProps {
    activeTab: TabType;
    setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
    activeContent: ActiveContent | null;
}

const CourseContentTabs = ({ activeTab, setActiveTab, activeContent }: CourseContentTabsProps) => {

    const baseTabs: TabType[] = ["Overview", "Q&A", "Notes", "Announcements"];
    let contentTabs: TabType[] = baseTabs;

    if (activeContent?.type === 'lesson') {
        const lesson = activeContent.data as any;
        contentTabs = ["Content", ...baseTabs];

        if (lesson.resources && (lesson.resources.links?.length || lesson.resources.files?.length)) {
            contentTabs.splice(1, 0, "Resources");
        }
    } else if (activeContent?.type === 'quiz' || activeContent?.type === 'assignment' || activeContent?.type === 'live') {
        contentTabs = ["Content", ...baseTabs];
    } else {
        contentTabs = ["Overview", ...baseTabs.slice(1)];
    }

    return (
        <div className="border-b border-gray-200 bg-white sticky top-[64px] z-30">
            <nav className="flex space-x-6 px-4 md:px-8 overflow-x-auto" aria-label="Tabs">
                {contentTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200",
                            activeTab === tab
                                ? "border-primary text-primary"
                                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default CourseContentTabs;