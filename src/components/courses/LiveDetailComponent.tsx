"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LiveDetailProps {
    liveLesson: any; 
    joinLiveSession: () => void;
    setIsJoiningLive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LiveDetailComponent({ liveLesson, joinLiveSession, setIsJoiningLive }: LiveDetailProps) {
    // Function to calculate time remaining without waiting for an interval
    const calculateTimeLeft = useCallback(() => {
        if (!liveLesson?.start_datetime) return null;
        
        const start = new Date(liveLesson.start_datetime).getTime();
        const now = new Date().getTime();
        const diff = start - now;

        if (diff > 0) {
            return {
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff / 1000 / 60) % 60),
                seconds: Math.floor((diff / 1000) % 60)
            };
        }
        return null;
    }, [liveLesson?.start_datetime]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Initial sync to catch any immediate changes
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setCurrentTime(new Date());
            const updatedTime = calculateTimeLeft();
            setTimeLeft(updatedTime);
        }, 1000);

        return () => clearInterval(timer);
    }, [calculateTimeLeft]);

    if (!liveLesson) {
        return (
            <div className="w-full aspect-video bg-zinc-950 rounded-xl border border-zinc-900 flex items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Waiting for session data...</p>
            </div>
        );
    }

    const lessonStart = liveLesson.start_datetime ? new Date(liveLesson.start_datetime) : null;
    const lessonEnd = liveLesson.end_datetime ? new Date(liveLesson.end_datetime) : null;
    const isValid = lessonStart && !isNaN(lessonStart.getTime());
    const tenMinutesBeforeStart = isValid ? new Date(lessonStart!.getTime() - 10 * 60 * 1000) : currentTime;

    const isPast = liveLesson.status === 'completed' || (lessonEnd && currentTime > lessonEnd);
    const isLiveOrReady = liveLesson.status === 'live' || (isValid && currentTime >= tenMinutesBeforeStart && (!lessonEnd || currentTime <= lessonEnd));
    const isFuture = liveLesson.status === 'upcoming' && isValid && currentTime < tenMinutesBeforeStart;

    const handleJoinClick = () => {
        setIsJoiningLive(true);
        joinLiveSession();
    };

    return (
        <div className="w-full aspect-video relative flex flex-col justify-center items-center bg-zinc-950 rounded-xl border border-zinc-900 overflow-hidden p-8 sm:p-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(38,148,198,0.03)_0%,transparent_50%)]" />

            <div className="relative z-10 flex flex-col items-center max-w-xl text-center space-y-8 w-full">
                {isLiveOrReady ? (
                    <div className="flex flex-col items-center space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2 text-red-500">
                                <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Session Active</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-tight">
                                {liveLesson.title}
                            </h1>
                        </div>
                        
                        <Button 
                            onClick={handleJoinClick} 
                            className="bg-[#2694C6] hover:bg-[#1f7ba5] text-white h-14 px-10 rounded-md font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.97] shadow-lg shadow-[#2694C6]/10"
                        >
                            <Video className="w-4 h-4 mr-3" />
                            Join Session
                        </Button>
                    </div>
                ) : isFuture ? (
                    <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-500">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-[#2694C6] uppercase tracking-[0.4em]">Upcoming Stream</p>
                            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-tight">{liveLesson.title}</h1>
                            <div className="flex items-center justify-center gap-4 text-zinc-500 font-bold text-[11px] uppercase tracking-widest">
                                <span>{lessonStart?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span>{lessonStart?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {timeLeft && (
                            <div className="flex gap-10 border-y border-zinc-900 py-6 w-full justify-center">
                                {[
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Mins', value: timeLeft.minutes },
                                    { label: 'Secs', value: timeLeft.seconds }
                                ].map((unit, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="text-3xl font-black text-white tabular-nums tracking-tighter">
                                            {unit.value.toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{unit.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-800">
                            Classroom opens 10 minutes early
                        </p>
                    </div>
                ) : isPast ? (
                    <div className="flex flex-col items-center space-y-6 animate-in fade-in duration-700">
                        <Badge variant="outline" className="text-zinc-500 border-zinc-800 px-4 py-1 text-[10px] font-black tracking-widest uppercase rounded-full">
                            Concluded
                        </Badge>
                        <h1 className="text-2xl sm:text-3xl font-black text-zinc-500 tracking-tighter uppercase leading-tight">{liveLesson.title}</h1>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed max-w-xs">
                            This session has ended. Please refer to the resources tab for materials.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <Loader2 className="w-6 h-6 text-zinc-800 animate-spin" />
                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Connecting...</p>
                    </div>
                )}
            </div>
        </div>
    );
}