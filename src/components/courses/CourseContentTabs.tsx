"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ActiveContent } from "./CourseLearningView"; 

export type TabType = "Overview" | "Content" | "Resources" | "Q&A" | "Notes" | "Announcements";

interface CourseContentTabsProps {
    activeTab: TabType;
    setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
    activeContent: ActiveContent | null;
}

const ALL_TABS: { key: TabType, label: string }[] = [
    { key: "Overview", label: "Course Overview" },
    { key: "Content", label: "Lesson Content" },
    { key: "Resources", label: "Resources" },
    { key: "Q&A", label: "Q&A" },
    { key: "Notes", label: "Notes" },
    { key: "Announcements", label: "Announcements" },
];

const getRelevantTabs = (activeContent: ActiveContent | null): TabType[] => {
    if (!activeContent) return [];
    
    const { type, data } = activeContent;
    const baseTabs: TabType[] = ['Overview', 'Resources', 'Q&A', 'Notes', 'Announcements'];

    if (type === 'lesson') {
        if (data?.video_url) {
            return ['Overview', 'Content', 'Resources', 'Q&A', 'Notes', 'Announcements'];
        }
        return ['Overview', 'Resources', 'Q&A', 'Notes', 'Announcements'];
    } 
    
    return baseTabs;
};

export default function CourseContentTabs({ activeTab, setActiveTab, activeContent }: CourseContentTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const relevantTabs = getRelevantTabs(activeContent);

    useEffect(() => {
        const urlTab = searchParams.get("tab") as TabType;
        if (urlTab && relevantTabs.includes(urlTab) && urlTab !== activeTab) {
            setActiveTab(urlTab);
        }
    }, [searchParams, relevantTabs, setActiveTab, activeTab]);

    useEffect(() => {
        if (activeContent && !relevantTabs.includes(activeTab)) {
            handleTabChange("Overview");
        }
    }, [activeContent, activeTab, relevantTabs]);

    const handleTabChange = (key: TabType) => {
        setActiveTab(key);
        const params = new URLSearchParams(window.location.search);
        params.set("tab", key);
        window.history.replaceState(null, "", `?${params.toString()}`);
    };

    if (relevantTabs.length === 0) return null;

    return (
        <div className="border border-gray-200 bg-white relative mt-4 px-4 rounded-t-md">
            <nav className="-mb-px flex space-x-8 overflow-x-auto px-4 md:px-0 scrollbar-hide" aria-label="Tabs">
                {ALL_TABS
                    .filter(tab => relevantTabs.includes(tab.key))
                    .map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleTabChange(tab.key)}
                        className={`
                            whitespace-nowrap py-5 px-1 border-b-2 font-black text-[10px] uppercase tracking-[0.2em] transition-all
                            ${activeTab === tab.key
                                ? "border-[#2694C6] text-[#2694C6]"
                                : "border-transparent text-gray-400 hover:text-gray-900 hover:border-gray-300"
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