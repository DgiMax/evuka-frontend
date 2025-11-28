"use client";

import React, { useState, useEffect, useCallback } from "react";
import api from "@/lib/api/axios";
import { Loader2, MessageSquare, Send, User, UserCheck, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Interface Definitions ---
interface Reply {
  id: number;
  user_name: string;
  content: string;
  is_instructor: boolean;
  created_at: string;
}

interface Question {
  id: number;
  user_name: string;
  title: string;
  content: string;
  is_mine: boolean; 
  created_at: string;
  replies: Reply[];
}

interface CourseQnAProps {
  courseSlug: string;
}

export default function CourseQnA({ courseSlug }: CourseQnAProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Ask Question Form State ---
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- Reply State ---
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // 1. Fetch Questions
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/course-discussions/?course_slug=${courseSlug}`);
      setQuestions(res.data);
    } catch (error) {
      console.error("Failed to load discussions", error);
    } finally {
      setIsLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // 2. Handle New Question Submission
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post("/course-discussions/", {
        course_slug: courseSlug,
        title: newTitle,
        content: newContent,
      });
      setNewTitle("");
      setNewContent("");
      fetchQuestions(); 
    } catch (error) {
      console.error("Failed to post question", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle Reply Submission
  const handleReply = async (questionId: number) => {
    if (!replyContent.trim()) return;
    
    setIsReplying(true);
    try {
      await api.post(`/course-discussions/${questionId}/reply/`, {
        content: replyContent
      });
      setReplyingToId(null);
      setReplyContent("");
      fetchQuestions(); 
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
          alert("You cannot reply to this question.");
      } else {
          alert("Failed to send reply.");
      }
    } finally {
      setIsReplying(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      
      {/* --- Ask a Question Form --- */}
      <div className="bg-card p-6 rounded border-2 border-primary shrink-0">
        <h3 className="text-lg font-bold mb-4 flex items-center text-foreground gap-2">
          <div className="p-2 bg-primary/10 rounded">
             <MessageSquare className="w-5 h-5 text-primary" /> 
          </div>
          Ask a Question
        </h3>
        <form onSubmit={handleAskQuestion} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Title: What is your question about?" 
              className="w-full px-4 py-3 border border-border rounded bg-background text-sm focus:border-primary focus:ring-0 focus:outline-none transition-colors"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <textarea 
              placeholder="Describe your question in detail..." 
              rows={3}
              className="w-full px-4 py-3 border border-border rounded bg-background text-sm focus:border-primary focus:ring-0 focus:outline-none transition-colors resize-none"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="rounded bg-primary hover:bg-primary/90 text-white min-w-[120px]">
              {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                  <>Post Question <Send className="ml-2 h-3 w-3" /></>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* --- Questions List (Scrollable) --- */}
      <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
        {questions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-secondary/5 rounded border border-dashed border-border">
            <p>No questions yet. Be the first to start a discussion!</p>
          </div>
        ) : (
          questions.map((q) => (
            <div 
              key={q.id} 
              className={`border rounded p-5 transition-all ${
                  q.is_mine 
                  ? 'bg-card border-primary/20' 
                  : 'bg-card border-border'
              }`}
            >
              {/* Question Header */}
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-foreground leading-snug break-words">
                      {q.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-medium text-foreground/80">
                        <User className="w-3 h-3" /> {q.is_mine ? "You" : q.user_name}
                    </span>
                    <span>•</span>
                    <span>{new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {q.is_mine && (
                    <span className="shrink-0 text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                        Yours
                    </span>
                )}
              </div>

              {/* Question Content */}
              <div className="text-sm text-foreground/80 mb-6 whitespace-pre-wrap leading-relaxed break-words">
                  {q.content}
              </div>

              {/* Replies Section */}
              {q.replies.length > 0 && (
                  <div className="space-y-3 mb-5 pl-4 sm:pl-6 border-l-2 border-border/50">
                    {q.replies.map((reply) => (
                      <div key={reply.id} className="relative bg-secondary/10 p-4 rounded text-sm group">
                        <div className="absolute left-[-29px] top-4 w-4 h-4 border-l-2 border-b-2 border-border/50 rounded-bl"></div>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className={`font-semibold flex items-center text-xs ${reply.is_instructor ? 'text-primary' : 'text-foreground'}`}>
                            {reply.is_instructor ? <UserCheck className="w-3 h-3 mr-1" /> : null}
                            {reply.user_name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                              {new Date(reply.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-foreground/90 break-words leading-relaxed">{reply.content}</p>
                      </div>
                    ))}
                  </div>
              )}

              {/* Reply Action Area */}
              {!q.is_mine ? (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    {replyingToId === q.id ? (
                      <div className="animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col gap-3">
                            <textarea 
                              placeholder="Type your reply here..." 
                              className="w-full p-3 text-sm border border-border rounded bg-background focus:border-primary focus:ring-0 focus:outline-none transition-colors resize-none min-h-[80px]"
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              autoFocus
                              onKeyDown={(e) => {
                                  if(e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleReply(q.id);
                                  }
                              }}
                            />
                            <div className="flex items-center justify-end gap-2">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="rounded"
                                    onClick={() => {
                                        setReplyingToId(null);
                                        setReplyContent("");
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    size="sm" 
                                    onClick={() => handleReply(q.id)} 
                                    disabled={isReplying}
                                    className="rounded bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    {isReplying ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Send className="h-3 w-3 mr-2" />}
                                    Send Reply
                                </Button>
                            </div>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setReplyingToId(q.id)}
                        className="text-sm text-muted-foreground hover:text-primary font-medium flex items-center transition-colors py-2"
                      >
                        <CornerDownRight className="w-4 h-4 mr-2" /> 
                        Reply to this question
                      </button>
                    )}
                  </div>
              ) : (
                  <div className="mt-4 pt-2 border-t border-border/50 text-xs text-muted-foreground italic flex items-center opacity-70">
                      You cannot reply to your own question.
                  </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}