"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api/axios';
import { Loader2, XCircle, Clock, CheckCircle2, AlertCircle, FileQuestion, Timer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; 
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface QuestionData {
    id: number;
    answer_id: number; 
    text: string;
    question_type: 'mcq' | 'text';
    score_weight: number;
    options?: { id: number; text: string; }[];
}

interface ExistingAnswer {
    question_id: number;
    selected_option: number | null;
    user_answer_text: string | null;
}

interface AttemptStartData {
    attempt_id: number;
    quiz_title: string;
    max_score: number;
    time_limit_minutes: number | null;
    questions: QuestionData[]; 
}

interface Quiz { 
    id: number; 
    title: string; 
    description: string;
    time_limit_minutes: number | null;
    max_attempts: number; 
    latest_attempt: {
        score: number;
        max_score: number;
        attempt_number: number;
        is_completed: boolean;
        requires_review: boolean;
        completed_at: string;
    } | null;
    max_score: number; 
    questions_count: number; 
}

interface QuizAttemptFormProps {
    quiz: Quiz;
    onAttemptSubmitted: () => void; 
}

export default function QuizAttemptFormComponent({ quiz, onAttemptSubmitted }: QuizAttemptFormProps) {
    const [currentQuiz, setCurrentQuiz] = useState<Quiz>(quiz);
    const [attemptData, setAttemptData] = useState<AttemptStartData | null>(null);
    const [answers, setAnswers] = useState<Record<number, any>>({}); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false); 
    const [isLoadingStart, setIsLoadingStart] = useState(false);

    useEffect(() => {
        setCurrentQuiz(quiz);
    }, [quiz]);

    const latestAttempt = currentQuiz.latest_attempt;
    const attemptsUsed = latestAttempt?.attempt_number || 0;
    const attemptsLeft = Math.max(0, currentQuiz.max_attempts - attemptsUsed);

    const fetchExistingAnswers = useCallback(async (attemptId: number, questions: QuestionData[]) => {
        try {
            const res = await api.get(`/quizzes/${attemptId}/answers/`);
            const existingAnswers: ExistingAnswer[] = res.data; 

            const resumedAnswers: Record<number, any> = {};
            questions.forEach(q => {
                const existing = existingAnswers.find(a => a.question_id === q.id);
                if (existing) {
                    if (q.question_type === 'mcq' && existing.selected_option) {
                        resumedAnswers[q.id] = { selected_option_id: existing.selected_option };
                    } else if (q.question_type === 'text' && existing.user_answer_text) {
                        resumedAnswers[q.id] = { user_answer_text: existing.user_answer_text };
                    }
                }
            });
            setAnswers(resumedAnswers);
        } catch (err) {
            setStatusMessage({ type: 'error', text: "Warning: Failed to load previous answers for resumption." });
        }
    }, []);

    const startAttempt = async () => {
        setStatusMessage(null);
        setIsLoadingStart(true);
        try {
            const res = await api.post(`/quizzes/${currentQuiz.id}/start/`);
            const data = res.data;
            
            setAttemptData({
                ...data,
                questions: data.questions,
            });
            setIsStarted(true);

            if (data.detail === "Resuming existing attempt.") {
                await fetchExistingAnswers(data.attempt_id, data.questions);
            }
            
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err.response?.data?.detail || "Failed to start quiz attempt." });
        } finally {
            setIsLoadingStart(false);
        }
    };
    
    const handleAnswerChange = (questionId: number, questionType: 'mcq' | 'text', value: string | number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: questionType === 'mcq' ? { selected_option_id: value } : { user_answer_text: value },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!attemptData) return;

        setIsSubmitting(true);
        setStatusMessage(null);

        const submissionData = attemptData.questions.map(q => {
            const answerPayload = answers[q.id] || {}; 
            return {
                answer_id: q.answer_id, 
                ...answerPayload,
            };
        });

        try {
            const res = await api.post(`/quizzes/${attemptData.attempt_id}/submit/`, { answers: submissionData });
            const result = res.data;

            setCurrentQuiz(prev => ({
                ...prev,
                latest_attempt: {
                    score: result.score,
                    max_score: result.max_score,
                    attempt_number: (prev.latest_attempt?.attempt_number || 0) + (attemptData.attempt_id === prev.latest_attempt?.attempt_number ? 0 : 1),
                    is_completed: true,
                    requires_review: result.requires_review,
                    completed_at: new Date().toISOString()
                }
            }));
            
            setIsStarted(false); 
            setAttemptData(null);
            setAnswers({}); 
            setStatusMessage({ 
                type: 'success', 
                text: `Quiz submitted! Final Score: ${result.score}/${result.max_score}` 
            });

            onAttemptSubmitted(); 
            
        } catch (err: any) {
            const errorDetail = err.response?.data?.answers ? 'Some answers failed validation.' : err.response?.data?.detail || "Failed to submit quiz.";
            setStatusMessage({ type: 'error', text: errorDetail });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCancelAttempt = () => {
        setAttemptData(null);
        setAnswers({});
        setIsStarted(false);
        setShowCancelModal(false);
    };

    const LatestAttemptCard = () => {
        if (!latestAttempt) return null;
        
        const scorePercentage = (latestAttempt.score / latestAttempt.max_score) * 100;
        const statusText = latestAttempt.requires_review 
            ? "Pending Review" 
            : latestAttempt.is_completed 
            ? "Completed" 
            : "In Progress";

        return (
            <div className="border border-border rounded-md bg-card p-4 md:p-6 mt-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                     <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                        Last Attempt Results
                     </h4>
                     <Badge 
                        variant="outline" 
                        className={cn(
                            "rounded-sm px-2 py-0.5 text-[9px] font-black uppercase tracking-widest w-fit",
                            latestAttempt.is_completed ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        )}
                    >
                        {statusText}
                    </Badge>
                </div>

                <div className="space-y-4">
                    <div className="flex items-end justify-between">
                        <span className="text-2xl md:text-3xl font-black text-foreground tabular-nums">
                            {latestAttempt.score}<span className="text-sm text-muted-foreground font-bold ml-1">/ {latestAttempt.max_score}</span>
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            {new Date(latestAttempt.completed_at || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                    <Progress value={scorePercentage} className="h-1.5 w-full bg-secondary" />
                </div>
            </div>
        );
    };

    if (isStarted && attemptData) {
        return (
            <form onSubmit={handleSubmit} className="w-full space-y-6 md:space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/50">
                    <div className="space-y-1">
                         <h3 className="text-xl md:text-2xl font-black text-foreground tracking-tight uppercase leading-tight">{attemptData.quiz_title}</h3>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Ongoing Attempt #{currentQuiz.latest_attempt ? (currentQuiz.latest_attempt.is_completed ? currentQuiz.latest_attempt.attempt_number + 1 : currentQuiz.latest_attempt.attempt_number) : 1}</p>
                    </div>
                    <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => setShowCancelModal(true)}
                        className="text-[10px] font-black uppercase tracking-widest h-9 border-destructive/20 text-destructive hover:bg-destructive/5 hover:text-destructive rounded-md w-full md:w-auto"
                    >
                        <XCircle className="w-3.5 h-3.5 mr-2" />
                        Exit Quiz
                    </Button>
                </div>
                
                {attemptData.time_limit_minutes !== null && (
                    <div className="flex items-center gap-3 p-4 rounded-md bg-orange-500/5 border border-orange-500/10 text-orange-600">
                        <Timer className="w-4 h-4 flex-shrink-0" />
                        <div className="text-[11px] font-bold uppercase tracking-wider">
                            Timer Active: {attemptData.time_limit_minutes} Minutes Remaining
                        </div>
                    </div>
                )}
                
                <div className="space-y-8 md:space-y-10">
                    {attemptData.questions.map((q, index) => (
                        <div key={q.id} className="group">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                                    {index + 1}
                                </div>
                                <div className="space-y-6 flex-1 min-w-0">
                                    <div className="text-sm md:text-base font-bold text-foreground leading-relaxed break-words pt-1">
                                        {q.text}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 gap-3">
                                        {q.question_type === 'mcq' && q.options?.map(option => {
                                            const isSelected = (answers[q.id]?.selected_option_id || null) === option.id;
                                            return (
                                                <label 
                                                    key={option.id} 
                                                    className={cn(
                                                        "flex items-center space-x-4 p-4 border rounded-md cursor-pointer transition-all duration-200 group/opt",
                                                        isSelected 
                                                            ? "bg-primary/5 border-primary ring-1 ring-primary/20" 
                                                            : "bg-background border-border hover:border-primary/40"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                                                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30 group-hover/opt:border-primary/50"
                                                    )}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        value={option.id}
                                                        checked={isSelected}
                                                        onChange={() => handleAnswerChange(q.id, 'mcq', option.id)}
                                                        className="sr-only"
                                                        required
                                                    />
                                                    <span className={cn("text-sm font-medium transition-colors", isSelected ? "text-foreground" : "text-muted-foreground")}>
                                                        {option.text}
                                                    </span>
                                                </label>
                                            );
                                        })}

                                        {q.question_type === 'text' && (
                                            <textarea
                                                placeholder="Write your detailed response here..."
                                                onChange={(e) => handleAnswerChange(q.id, 'text', e.target.value)}
                                                className="w-full p-4 text-sm font-medium border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all min-h-[120px]"
                                                defaultValue={answers[q.id]?.user_answer_text || ''} 
                                            />
                                        )}
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">Weight: {q.score_weight} Point(s)</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-8 border-t border-border flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="w-full sm:w-auto px-10 py-6 rounded-md bg-primary hover:bg-primary/90 text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
                    >
                        {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin mr-3'/> : <CheckCircle2 className="w-4 h-4 mr-3" />}
                        {isSubmitting ? "Processing..." : "Submit for Grading"}
                    </Button>
                </div>

                <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                    <DialogContent className="rounded-md max-w-[90vw] sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-black uppercase tracking-tight">Confirm Exit</DialogTitle>
                        </DialogHeader>
                        <p className="py-4 text-sm font-medium text-muted-foreground leading-relaxed">
                            Are you sure you want to stop? Your current answers will be discarded and this attempt will remain incomplete.
                        </p>
                        <DialogFooter className="flex-col sm:flex-row gap-3">
                            <Button variant="outline" onClick={() => setShowCancelModal(false)} className="text-[10px] font-black uppercase tracking-widest rounded-md">
                                Keep Working
                            </Button>
                            <Button variant="destructive" onClick={handleCancelAttempt} className="text-[10px] font-black uppercase tracking-widest rounded-md">
                                Discard and Exit
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </form>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 md:space-y-10 animate-in fade-in duration-700">
            <div className="space-y-4">
                <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">{currentQuiz.title}</h1>
                <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed max-w-2xl">{currentQuiz.description || "Review the course materials thoroughly before starting this assessment."}</p>
            </div>
            
            {statusMessage && (
                <div className={cn(
                    "p-4 rounded-md border flex items-start gap-4",
                    statusMessage.type === 'error' ? "bg-red-500/5 border-red-500/20 text-red-600" : "bg-green-500/5 border-green-500/20 text-green-600"
                )}>
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-[11px] font-bold uppercase tracking-widest">{statusMessage.text}</div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[
                    { label: "Questions", val: currentQuiz.questions_count, icon: <FileQuestion className="w-4 h-4" /> },
                    { label: "Duration", val: currentQuiz.time_limit_minutes ? `${currentQuiz.time_limit_minutes}m` : "∞", icon: <Clock className="w-4 h-4" /> },
                    { label: "Limit", val: currentQuiz.max_attempts, icon: <Timer className="w-4 h-4" /> },
                    { label: "Left", val: attemptsLeft, icon: <CheckCircle2 className="w-4 h-4" />, highlight: attemptsLeft === 0 }
                ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-md border border-border bg-card flex flex-col items-center text-center space-y-2">
                         <div className="text-muted-foreground/40">{stat.icon}</div>
                         <span className={cn("text-xl md:text-2xl font-black tabular-nums", stat.highlight ? "text-destructive" : "text-primary")}>
                            {stat.val}
                         </span>
                         <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</span>
                    </div>
                ))}
            </div>

            <LatestAttemptCard />

            <div className="pt-4">
                {attemptsLeft > 0 ? (
                    <Button 
                        onClick={startAttempt} 
                        disabled={isLoadingStart}
                        className="w-full sm:w-auto h-14 px-12 rounded-md bg-primary hover:bg-primary/90 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20 active:scale-[0.98]"
                    >
                        {isLoadingStart ? <Loader2 className="w-4 h-4 animate-spin mr-3" /> : null}
                        {latestAttempt && !latestAttempt.is_completed ? "Resume Assessment" : "Begin Assessment"}
                    </Button>
                ) : (
                    <div className="p-6 rounded-md bg-secondary/30 border border-border text-muted-foreground text-center text-[10px] font-black uppercase tracking-[0.3em]">
                        Maximum Attempts Exhausted
                    </div>
                )}
            </div>
        </div>
    );
}