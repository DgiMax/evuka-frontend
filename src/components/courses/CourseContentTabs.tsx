"use client";
import React from "react";
import { ActiveContent } from "./CourseLearningView"; 

export type TabType = "Overview" | "Content" | "Resources" | "Q&A" | "Notes" | "Announcements";

interface CourseContentTabsProps {
    activeTab: TabType;
    setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
    activeContent: ActiveContent | null; // Needed for filtering
}

const ALL_TABS: { key: TabType, label: string }[] = [
    { key: "Overview", label: "Course Overview" },
    { key: "Content", label: "Lesson Content" }, // Specific to Lesson details/quiz link
    { key: "Q&A", label: "Q&A" },
    { key: "Notes", label: "Notes" },
    { key: "Announcements", label: "Announcements" },
];

/**
 * Filters the tabs based on the currently selected curriculum item.
 */
const getRelevantTabs = (activeContent: ActiveContent | null): TabType[] => {
    if (!activeContent) return [];
    
    const { type } = activeContent;
    let baseTabs: TabType[] = ['Overview', 'Q&A', 'Notes', 'Announcements'];

    if (type === 'lesson') {
        // Lessons show Content tab alongside general tabs.
        // Inserting 'Content' after 'Overview'
        return ['Overview', 'Content', 'Q&A', 'Notes', 'Announcements'];
        
    } else if (type === 'live') {
        // Live classes only show Course Overview and general tabs.
        return baseTabs;
        
    } else {
        // Assignment or Quiz: hide tabs as the main content slot displays the form/redirect.
        return [];
    }
};


export default function CourseContentTabs({ activeTab, setActiveTab, activeContent }: CourseContentTabsProps) {
    const relevantTabs = getRelevantTabs(activeContent);

    if (relevantTabs.length === 0) {
        return null;
    }
    
    // Ensure the active tab is still relevant after filtering. If not, reset to 'Overview'.
    if (activeContent && !relevantTabs.includes(activeTab)) {
        setActiveTab("Overview");
    }

    return (
        <div className="border border-border border-gray-200 bg-white sticky top-16 lg:top-0 z-30 mt-4 px-4">
            <nav className="-mb-px flex space-x-8 overflow-x-auto px-4 md:px-0" aria-label="Tabs">
                {ALL_TABS
                    .filter(tab => relevantTabs.includes(tab.key))
                    .map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                            ${activeTab === tab.key
                                ? "border-[#2694C6] text-[#2694C6]"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
}