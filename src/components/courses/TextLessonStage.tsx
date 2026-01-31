"use client";

import React, { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { BookOpen, CheckCircle2, Lock, Clock } from "lucide-react";

interface TextLessonStageProps {
  title: string;
  content: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export default function TextLessonStage({
  title,
  content,
  isCompleted,
  onToggleComplete,
}: TextLessonStageProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);

  useEffect(() => {
    if (isCompleted) {
      setIsTimerComplete(true);
      setSecondsRemaining(0);
      setIsScrolledToBottom(true);
      return;
    }

    setIsTimerComplete(false);
    setSecondsRemaining(30);
    setIsScrolledToBottom(false);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerComplete(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [title, isCompleted]);

  useEffect(() => {
    const handleScroll = () => {
      const element = scrollContainerRef.current;
      if (!element) return;
      const { scrollTop, scrollHeight, clientHeight } = element;
      const totalHeight = scrollHeight - clientHeight;
      const status = totalHeight > 0 ? (scrollTop / totalHeight) * 100 : 0;
      setReadingProgress(status);

      if (scrollTop + clientHeight >= scrollHeight - 60) {
        setIsScrolledToBottom(true);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [title]);

  const canMarkAsDone = isCompleted || (isTimerComplete && isScrolledToBottom);

  return (
    <div className="w-full bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[75vh] animate-in fade-in duration-500">
      <div className="h-1 w-full bg-white/5 shrink-0">
        <div 
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="px-6 py-1.5 border-b border-white/10 flex items-center justify-between bg-black shrink-0 min-h-[52px]">
        <div className="flex items-center gap-3 min-w-0">
          <BookOpen className="w-4 h-4 text-primary shrink-0 hidden sm:block" />
          <h2 className="text-[13px] font-black text-white truncate tracking-tight uppercase">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {!isCompleted && !canMarkAsDone && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">
              <Clock className="w-3 h-3" />
              <span>{secondsRemaining > 0 ? `${secondsRemaining}s` : "Scroll Down"}</span>
            </div>
          )}
          
          <button
            disabled={!canMarkAsDone}
            onClick={(e) => {
              e.preventDefault();
              onToggleComplete();
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
              isCompleted
                ? "bg-green-600 border-green-500 text-white"
                : canMarkAsDone
                ? "bg-primary border-primary text-white hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                : "bg-zinc-900 border-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : !canMarkAsDone ? <Lock className="w-3.5 h-3.5" /> : null}
            {isCompleted ? "Completed" : "Mark Done"}
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 md:px-10 pt-6 pb-12 scroll-smooth
        [&::-webkit-scrollbar]:w-1.5 
        [&::-webkit-scrollbar-thumb]:bg-white/10 
        hover:[&::-webkit-scrollbar-thumb]:bg-white/20"
      >
        <div className="text-white/80 leading-relaxed selection:bg-primary/30">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({...p}) => <h1 className="text-3xl font-black text-white mt-4 mb-6 tracking-tighter" {...p} />,
              h2: ({...p}) => <h2 className="text-xl font-black text-white mt-8 mb-4 tracking-tight border-b border-white/10 pb-2" {...p} />,
              h3: ({...p}) => <h3 className="text-lg font-bold text-white mt-6 mb-3" {...p} />,
              p: ({...p}) => <p className="text-base leading-[1.7] mb-6 text-white/70" {...p} />,
              ul: ({...p}) => <ul className="list-disc pl-5 mb-6 space-y-2 text-white/70" {...p} />,
              ol: ({...p}) => <ol className="list-decimal pl-5 mb-6 space-y-2 text-white/70" {...p} />,
              blockquote: ({...p}) => (
                <blockquote className="border-l-4 border-primary bg-white/5 p-4 italic rounded-r-xl my-6 text-white/80" {...p} />
              ),
              code: ({node, inline, className, children, ...p}: any) => (
                <code className={cn(
                  "bg-white/10 text-primary px-1.5 py-0.5 rounded font-mono text-xs",
                  !inline && "block p-4 bg-zinc-900 text-white/90 border border-white/5 overflow-x-auto my-6 rounded-lg"
                )} {...p}>
                  {children}
                </code>
              ),
              a: ({...p}) => <a className="text-primary font-bold underline underline-offset-4" target="_blank" {...p} />,
              img: ({...p}) => <img className="rounded-xl shadow-2xl mx-auto my-8 border border-white/10 max-h-[400px] object-contain" alt="" {...p} />,
            }}
          >
            {content}
          </ReactMarkdown>

          <div className="mt-12 py-8 border-t border-white/5 flex flex-col items-center opacity-20">
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">End of Content</p>
          </div>
        </div>
      </div>
    </div>
  );
}