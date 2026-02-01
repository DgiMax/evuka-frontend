"use client";

import React, {
    useRef,
    useState,
    useEffect,
    useCallback,
} from "react";
import PlaybackRateControl from "./PlaybackRateControl";
import { cn } from "@/lib/utils";

const Icon = {
    Play: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    Pause: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    VolumeUp: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
    ),
    VolumeOff: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2" />
        </svg>
    ),
    Fullscreen: ({ className = "w-6 h-6" }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
        </svg>
    ),
    LoadingState: () => (
        <div className="flex flex-col items-center gap-3 animate-in fade-in duration-300">
            <div className="relative h-10 w-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Buffering</p>
        </div>
    )
};

const formatTime = (t: number) =>
    `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

const ProgressBar = ({ progressRef, progress, onSeek }: any) => (
    <div
        ref={progressRef}
        onClick={onSeek}
        className="w-full h-1 bg-white/20 cursor-pointer rounded-full mb-2 relative group/progress"
    >
        <div className="absolute inset-0 group-hover/progress:h-2 group-hover/progress:-top-0.5 transition-all"></div>
        <div className="h-full bg-[#2694C6] rounded-full relative transition-all" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#2694C6] rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md" />
        </div>
    </div>
);

const VolumeControl = ({ volume, isMuted, onVolumeChange, onToggleMute }: any) => (
    <div className="flex items-center group">
        <button onClick={onToggleMute}>
            {isMuted || volume === 0 ? <Icon.VolumeOff /> : <Icon.VolumeUp />}
        </button>
        <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            className="w-0 group-hover:w-24 h-1 ml-2 transition-all duration-300 opacity-0 group-hover:opacity-100 accent-[#2694C6] cursor-pointer"
        />
    </div>
);

export default function VideoPlayer({
    videoUrl,
    lessonId,
    onProgressUpdate,
    onLessonComplete,
    startTime,
}: {
    videoUrl: string | null;
    lessonId?: number;
    onProgressUpdate: (lessonId: number, timestamp: number, completed?: boolean) => void;
    onLessonComplete: () => void;
    startTime?: number;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const lastUpdateTime = useRef(0);
    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

    const isTypingInInput = (el: HTMLElement | null): boolean => {
        if (!el) return false;
        const tag = el.tagName.toLowerCase();
        return (
            tag === "input" || tag === "textarea" || tag === "select" || el.getAttribute("contenteditable") === "true"
        );
    };

    const togglePlay = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        v.paused ? v.play() : v.pause();
    }, []);

    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v) return;

        const now = v.currentTime;
        const dur = v.duration;

        setProgress((now / dur) * 100);
        setCurrentTime(now);

        if (lessonId && isPlaying && Math.abs(now - lastUpdateTime.current) > 15) {
            onProgressUpdate(lessonId, now);
            lastUpdateTime.current = now;
        }
    };

    const handleVideoEnd = () => {
        const v = videoRef.current;
        if (!v || !lessonId) return;

        setIsPlaying(false);
        onProgressUpdate(lessonId, v.duration, true);
        onLessonComplete();
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const bar = progressRef.current;
        const v = videoRef.current;
        if (!bar || !v) return;

        const rect = bar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        v.currentTime = pos * v.duration;
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        const v = videoRef.current;
        setVolume(val);
        setIsMuted(val === 0);
        if (v) {
            v.volume = val;
            v.muted = val === 0;
        }
    };

    const toggleMute = useCallback(() => {
        const v = videoRef.current;
        if (!v) return;
        const newState = !v.muted;
        v.muted = newState;
        setIsMuted(newState);
    }, []);

    const changeRate = (rate: number) => {
        const v = videoRef.current;
        if (!v) return;
        v.playbackRate = rate;
        setPlaybackRate(rate);
    };

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    const showControls = () => {
        setIsControlsVisible(true);
        if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
        hideControlsTimeout.current = setTimeout(() => {
            if (isPlaying) setIsControlsVisible(false);
        }, 3000);
    };

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (isTypingInInput(e.target as HTMLElement)) return;

            switch (e.key) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlay();
                    break;
                case "m":
                    toggleMute();
                    break;
                case "f":
                    toggleFullscreen();
                    break;
                case "ArrowRight":
                    if (videoRef.current) videoRef.current.currentTime += 5;
                    break;
                case "ArrowLeft":
                    if (videoRef.current) videoRef.current.currentTime -= 5;
                    break;
            }
        };

        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, [togglePlay, toggleMute, toggleFullscreen]);

    const handleMetadata = () => {
        const v = videoRef.current;
        if (!v) return;
        setDuration(v.duration);
        if (startTime && startTime < v.duration) {
            v.currentTime = startTime;
        }
    };

    const handleCanPlay = () => {
        setIsLoading(false);
    };

    if (!videoUrl) {
        return (
            <div className="w-full bg-black aspect-video flex items-center justify-center rounded-md">
                <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-40">
                    Select a lesson to begin
                </p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full bg-black rounded-md group aspect-video overflow-hidden border border-white/5"
            onMouseMove={showControls}
            onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
        >
            {isLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all">
                    <Icon.LoadingState />
                </div>
            )}

            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                src={videoUrl || ""} 
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleMetadata}
                onEnded={handleVideoEnd}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={handleCanPlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                muted={isMuted}
                playsInline
            />

            <div
                className={cn(
                    "absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500",
                    isControlsVisible || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                <ProgressBar progressRef={progressRef} progress={progress} onSeek={handleSeek} />

                <div className="flex items-center justify-between text-white mt-2">
                    <div className="flex items-center space-x-6">
                        <button onClick={togglePlay} className="hover:text-[#2694C6] transition-colors scale-125">
                            {isPlaying ? <Icon.Pause /> : <Icon.Play />}
                        </button>

                        <VolumeControl
                            volume={volume}
                            isMuted={isMuted}
                            onVolumeChange={changeVolume}
                            onToggleMute={toggleMute}
                        />

                        <span className="text-[11px] font-black uppercase tracking-widest tabular-nums text-white/80">
                            {formatTime(currentTime)} <span className="text-white/20 mx-1">|</span> {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <PlaybackRateControl playbackRate={playbackRate} onRateChange={changeRate} />

                        <button onClick={toggleFullscreen} className="hover:text-[#2694C6] transition-colors">
                            <Icon.Fullscreen />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}