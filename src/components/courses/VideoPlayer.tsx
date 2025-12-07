"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import PlaybackRateControl from "./PlaybackRateControl";

// --- ICONS ---
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
  // 🟢 NEW: Loading Spinner Icon
  Spinner: ({ className = "w-10 h-10" }) => (
    <svg className={`${className} animate-spin text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  )
};

// --- HELPERS ---
const formatTime = (t: number) =>
  `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

// --- SUBCOMPONENTS ---
const ProgressBar = ({ progressRef, progress, onSeek }: any) => (
  <div
    ref={progressRef}
    onClick={onSeek}
    className="w-full h-1 bg-gray-600/50 cursor-pointer rounded-full mb-2 relative group/progress"
  >
     {/* Added a hover effect to make bar bigger for easier clicking */}
    <div className="absolute inset-0 group-hover/progress:h-2 group-hover/progress:-top-0.5 transition-all"></div>
    <div className="h-full bg-[#2694C6] rounded-full relative" style={{ width: `${progress}%` }}>
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
      className="w-0 group-hover:w-24 h-1 ml-2 transition-all duration-300 opacity-0 group-hover:opacity-100 accent-white"
    />
  </div>
);

// --- MAIN COMPONENT ---
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
  
  // 🟢 NEW: Loading state defaults to true
  const [isLoading, setIsLoading] = useState(true);

  const lastUpdateTime = useRef(0);
  const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const isTypingInInput = (el: HTMLElement | null): boolean => {
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      el.getAttribute("contenteditable") === "true"
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

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const newState = !v.muted;
    v.muted = newState;
    setIsMuted(newState);
  };

  const changeRate = (rate: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

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
  }, [togglePlay]);

  const handleMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    if (startTime && startTime < v.duration) {
      v.currentTime = startTime;
    }
  };

  // 🟢 MODIFIED: Turn off loading when video can play
  const handleCanPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    setIsLoading(false); // Stop loading spinner
    v.play().catch(() => {
        // Handle autoplay blocking if necessary
        setIsPlaying(false);
    });
    setIsPlaying(true);
  };

  // 🟢 NEW: Handle buffering (Turn on loading when seeking/stalled)
  const handleWaiting = () => {
    setIsLoading(true);
  };

  if (!videoUrl) {
    return (
      <div className="w-full bg-black aspect-video flex items-center justify-center rounded-md">
        <p className="text-white text-center p-4">
          Select a lesson from the sidebar to begin.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      // 🟢 CHANGED: added 'aspect-video' to force 16:9 ratio even when loading
      className="relative w-full bg-black rounded-md group aspect-video overflow-hidden" 
      onMouseMove={showControls}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      {/* 🟢 NEW: Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <Icon.Spinner />
        </div>
      )}

      <video
        key={videoUrl}
        ref={videoRef}
        className="w-full h-full object-contain rounded-md"
        src={videoUrl}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleMetadata}
        onEnded={handleVideoEnd}
        // 🟢 NEW: Add waiting handler for buffering states
        onWaiting={handleWaiting} 
        onCanPlay={handleCanPlay}
      />

      {/* CONTROLS */}
      {/* 🟢 CHANGED: Hide controls completely if loading */}
      {!isLoading && (
        <div
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
            isControlsVisible ? "opacity-100" : "opacity-0"
            }`}
        >
            <ProgressBar progressRef={progressRef} progress={progress} onSeek={handleSeek} />

            <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
                <button onClick={togglePlay}>
                {isPlaying ? <Icon.Pause /> : <Icon.Play />}
                </button>

                <VolumeControl
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={changeVolume}
                onToggleMute={toggleMute}
                />

                <span className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>

            <div className="flex items-center space-x-4">
                <PlaybackRateControl playbackRate={playbackRate} onRateChange={changeRate} />

                <button onClick={toggleFullscreen}>
                <Icon.Fullscreen />
                </button>
            </div>
            </div>
        </div>
      )}
    </div>
  );
}