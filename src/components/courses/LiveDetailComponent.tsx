"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LiveLesson } from './CourseLearningView'; 
import { Video, Calendar, Clock, Radio, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LiveDetailProps {
    liveLesson: LiveLesson | null;
    joinLiveSession: () => void;
    setIsJoiningLive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LiveDetailComponent({ liveLesson, joinLiveSession, setIsJoiningLive }: LiveDetailProps) {
    // 1. Reactive state to ensure the UI updates automatically (e.g. when 10 mins before starts)
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 30000); // Update every 30s
        return () => clearInterval(timer);
    }, []);

    if (!liveLesson) {
        return (
            <div className="w-full aspect-video bg-secondary/10 border border-border rounded flex items-center justify-center text-muted-foreground">
                <p>No live session selected.</p>
            </div>
        );
    }

    // 2. Robust Date Parsing (Add 'T' to ensure ISO format works on all browsers)
    const lessonStart = new Date(`${liveLesson.date}T${liveLesson.start_time}`);
    const lessonEnd = new Date(`${liveLesson.date}T${liveLesson.end_time}`);

    // 3. Logic: Students can join 10 minutes before start
    const tenMinutesBeforeStart = new Date(lessonStart.getTime() - 10 * 60 * 1000);

    const isPast = now > lessonEnd;
    const isLiveOrReady = now >= tenMinutesBeforeStart && now <= lessonEnd;
    const isFuture = now < tenMinutesBeforeStart;

    const handleJoinClick = () => {
        setIsJoiningLive(true);
        joinLiveSession();
    };

    return (
        <div className="w-full aspect-video relative flex flex-col justify-center items-center bg-card border border-border rounded overflow-hidden p-6 sm:p-12">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Video className="w-96 h-96" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl text-center space-y-6">
                
                {/* --- STATE 1: LIVE OR READY (SHOW JOIN BUTTON) --- */}
                {isLiveOrReady && (
                    <>
                        <Badge variant="destructive" className="px-4 py-1.5 text-sm font-semibold tracking-wide uppercase flex items-center gap-2 rounded-full animate-pulse">
                            <Radio className="w-4 h-4" /> Live Now
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                            {liveLesson.title}
                        </h1>
                        <div className="space-y-3 animate-in slide-in-from-bottom-4 pt-2">
                            <Button 
                                onClick={handleJoinClick} 
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 rounded font-semibold shadow-none w-full sm:w-auto min-w-[200px]"
                            >
                                <Video className="w-5 h-5 mr-2" />
                                Join Class
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                Session is in progress. Click to enter.
                            </p>
                        </div>
                    </>
                )}

                {/* --- STATE 2: FUTURE / UPCOMING (NO BUTTON) --- */}
                {isFuture && (
                    <>
                        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium tracking-wide uppercase bg-background border-primary/20 text-primary flex items-center gap-2 rounded-full">
                            <Calendar className="w-4 h-4" /> Upcoming Session
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                            {liveLesson.title}
                        </h1>
                        <div className="space-y-3 bg-secondary/5 p-5 rounded border border-border/50 max-w-md mt-4">
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">
                                    Starts: {lessonStart.toLocaleString(undefined, { 
                                        weekday: 'short', month: 'short', day: 'numeric', 
                                        hour: 'numeric', minute: 'numeric' 
                                    })}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                The join button will appear automatically <strong>10 minutes</strong> before class starts.
                            </p>
                        </div>
                    </>
                )}

                {/* --- STATE 3: PAST / ENDED (NO BUTTON) --- */}
                {isPast && (
                    <>
                        <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium tracking-wide uppercase bg-gray-100 text-gray-600 border-gray-200 flex items-center gap-2 rounded-full">
                            <CheckCircle2 className="w-4 h-4" /> Session Ended
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-muted-foreground tracking-tight leading-tight">
                            {liveLesson.title}
                        </h1>
                        <div className="space-y-3 bg-gray-50 p-5 rounded border border-border/50 max-w-md mt-4">
                            <p className="text-sm text-muted-foreground">
                                This live session has concluded. Check the course materials for recordings or notes.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}