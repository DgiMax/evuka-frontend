"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Calendar, Clock, Radio, CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface LiveDetailProps {
    liveLesson: any; 
    joinLiveSession: () => void;
    setIsJoiningLive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LiveDetailComponent({ liveLesson, joinLiveSession, setIsJoiningLive }: LiveDetailProps) {
    const [now, setNow] = useState(new Date());
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            const currentTime = new Date();
            setNow(currentTime);

            if (liveLesson?.start_datetime) {
                const start = new Date(liveLesson.start_datetime);
                const diff = start.getTime() - currentTime.getTime();

                if (diff > 0) {
                    setTimeLeft({
                        hours: Math.floor((diff / (1000 * 60 * 60))),
                        minutes: Math.floor((diff / 1000 / 60) % 60),
                        seconds: Math.floor((diff / 1000) % 60)
                    });
                } else {
                    setTimeLeft(null);
                }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [liveLesson]);

    if (!liveLesson) {
        return (
            <div className="w-full aspect-video bg-black rounded-xl border border-white/5 flex items-center justify-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">No Session Selected</p>
            </div>
        );
    }

    const lessonStart = liveLesson.start_datetime ? new Date(liveLesson.start_datetime) : null;
    const lessonEnd = liveLesson.end_datetime ? new Date(liveLesson.end_datetime) : null;
    const isValid = lessonStart && !isNaN(lessonStart.getTime());
    const tenMinutesBeforeStart = isValid ? new Date(lessonStart!.getTime() - 10 * 60 * 1000) : now;

    const isPast = liveLesson.status === 'completed' || (lessonEnd && now > lessonEnd);
    const isLiveOrReady = liveLesson.status === 'live' || (isValid && now >= tenMinutesBeforeStart && (!lessonEnd || now <= lessonEnd));
    const isFuture = liveLesson.status === 'upcoming' && isValid && now < tenMinutesBeforeStart;

    const handleJoinClick = () => {
        setIsJoiningLive(true);
        joinLiveSession();
    };

    return (
        <div className="w-full aspect-video relative flex flex-col justify-center items-center bg-[#050505] rounded-xl border border-white/10 overflow-hidden p-6 sm:p-12 shadow-[0_0_50px_-12px_rgba(38,148,198,0.2)]">
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(38,148,198,0.15)_0%,transparent_70%)]" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                <Video className="w-[70%] h-[70%] text-[#2694C6]" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-2xl text-center space-y-10 w-full">
                
                {isLiveOrReady ? (
                    <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-700">
                        <div className="flex flex-col items-center gap-4">
                            <Badge className="bg-red-600 hover:bg-red-600 text-white border-none px-5 py-1.5 text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-2 rounded-full animate-pulse shadow-[0_0_25px_rgba(220,38,38,0.5)]">
                                <Radio className="w-3.5 h-3.5" /> Live Session
                            </Badge>
                            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                                {liveLesson.title}
                            </h1>
                        </div>
                        <Button 
                            onClick={handleJoinClick} 
                            className="bg-[#2694C6] hover:bg-[#1f7ba5] text-white h-16 px-14 rounded-xl font-black text-[12px] uppercase tracking-[0.25em] shadow-[0_0_30px_-5px_rgba(38,148,198,0.6)] transition-all active:scale-[0.96] border-b-4 border-[#1a668a]"
                        >
                            <Video className="w-5 h-5 mr-4" />
                            Enter Virtual Class
                        </Button>
                    </div>
                ) : isFuture ? (
                    <div className="flex flex-col items-center space-y-8 animate-in fade-in duration-700">
                        <Badge variant="outline" className="px-5 py-1.5 text-[11px] font-black tracking-[0.2em] uppercase border-[#2694C6]/30 text-[#2694C6] flex items-center gap-2 rounded-full bg-[#2694C6]/10 backdrop-blur-sm">
                            <Calendar className="w-3.5 h-3.5" /> Scheduled Stream
                        </Badge>
                        
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-none opacity-90">{liveLesson.title}</h1>
                            <div className="flex items-center justify-center gap-4 text-[#2694C6] font-black text-sm uppercase tracking-widest">
                                <span className="opacity-60">{lessonStart?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                <span>{lessonStart?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>

                        {timeLeft && (
                            <div className="flex gap-4 sm:gap-8 pt-4">
                                {[
                                    { label: 'Hrs', value: timeLeft.hours },
                                    { label: 'Min', value: timeLeft.minutes },
                                    { label: 'Sec', value: timeLeft.seconds }
                                ].map((unit, i) => (
                                    <div key={i} className="flex flex-col items-center min-w-[60px]">
                                        <span className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tighter">
                                            {unit.value.toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] font-black text-[#2694C6] uppercase tracking-[0.2em] mt-1">{unit.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                                Classroom Access Opens <span className="text-white">10 Minutes Early</span>
                            </p>
                        </div>
                    </div>
                ) : isPast ? (
                    <div className="flex flex-col items-center space-y-6 opacity-50 grayscale animate-in fade-in duration-1000">
                        <Badge className="bg-white/10 text-white/50 border-none px-5 py-1.5 text-[11px] font-black tracking-[0.2em] uppercase flex items-center gap-2 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Archive
                        </Badge>
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase leading-none">{liveLesson.title}</h1>
                        <div className="bg-white/5 px-8 py-5 rounded-xl border border-white/5 max-w-sm">
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                                Session Concluded. Check resources for materials.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <AlertCircle className="w-10 h-10 text-[#2694C6]/40" />
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{liveLesson.title}</h1>
                        <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Synchronizing Stream Data...</p>
                    </div>
                )}
            </div>
        </div>
    );
}