// components/courses/QuizAttemptFormComponent.tsx

"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api/axios';
import { Loader2, XCircle, Clock, CheckCircle2, AlertCircle, FileQuestion, Timer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; 
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils'; // Assuming you have this, if not, standard class strings work too

// --- Interfaces (Unchanged) ---
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

// --- Component ---

export default function QuizAttemptFormComponent({ quiz, onAttemptSubmitted }: QuizAttemptFormProps) {
    const [attemptData, setAttemptData] = useState<AttemptStartData | null>(null);
    const [answers, setAnswers] = useState<Record<number, any>>({}); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isStarted, setIsStarted] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false); 
    const [isLoadingStart, setIsLoadingStart] = useState(false);

    const latestAttempt = quiz.latest_attempt;
    const attemptsUsed = latestAttempt?.is_completed ? latestAttempt.attempt_number : (latestAttempt?.attempt_number || 0);
    const attemptsLeft = quiz.max_attempts - attemptsUsed;

    // --- RESUME LOGIC HANDLERS ---
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
            console.error("Failed to load existing answers:", err);
            setStatusMessage("Warning: Failed to load previous answers for resumption.");
        }
    }, []);

    // --- ATTEMPT START ---
    const startAttempt = async () => {
        setStatusMessage(null);
        setIsLoadingStart(true);
        try {
            const res = await api.post(`/quizzes/${quiz.id}/start/`);
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
            console.error("Quiz Start Error:", err);
            setStatusMessage(err.response?.data?.detail || "Failed to start quiz attempt.");
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
            
            setStatusMessage(`Quiz submitted! Score: ${res.data.score}/${res.data.max_score}. Review: ${res.data.requires_review ? 'Yes' : 'No'}`);
            setIsStarted(false); 
            setAnswers({}); 

            onAttemptSubmitted(); 
            
        } catch (err: any) {
            console.error("Submission Error:", err);
            const errorDetail = err.response?.data?.answers ? 'Some answers failed validation.' : err.response?.data?.detail || "Failed to submit quiz.";
            setStatusMessage(errorDetail);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCancelAttempt = () => {
        setAttemptData(null);
        setAnswers({});
        setIsStarted(false);
        setStatusMessage("Attempt canceled. Progress was not saved (but can be resumed).");
        setShowCancelModal(false);
    };

    // --- RENDER COMPONENTS (JSX Functions) ---

    const LatestAttemptCard = () => {
        if (!latestAttempt) return null;
        
        const scorePercentage = (latestAttempt.score / latestAttempt.max_score) * 100;
        const statusText = latestAttempt.requires_review 
            ? "Pending Review" 
            : latestAttempt.is_completed 
            ? "Completed" 
            : "In Progress";

        return (
            <div className="border border-border rounded-lg bg-card p-5 mt-6">
                <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Latest Attempt #{latestAttempt.attempt_number}
                     </h4>
                     <Badge 
                        variant="outline" 
                        className={cn(
                            "rounded px-2 py-0.5",
                            latestAttempt.is_completed ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                    >
                        {statusText}
                    </Badge>
                </div>

                <div className="space-y-3">
                    <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-foreground">
                            {latestAttempt.score} <span className="text-sm text-muted-foreground font-normal">/ {latestAttempt.max_score}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {new Date(latestAttempt.completed_at || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                    <Progress value={scorePercentage} className="h-2 w-full" />
                </div>
            </div>
        );
    };

    const renderQuizForm = () => {
        if (!attemptData) return null;

        return (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
                {/* Quiz Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-border/50 pb-6">
                    <div>
                         <h3 className="text-2xl font-bold text-foreground tracking-tight">{attemptData.quiz_title}</h3>
                         <p className="text-sm text-muted-foreground mt-1">Answer all questions to the best of your ability.</p>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={(e) => { e.preventDefault(); setShowCancelModal(true); }}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Exit Quiz
                    </Button>
                </div>
                
                {/* Timer / Info Bar */}
                {attemptData.time_limit_minutes !== null && (
                    <div className="flex items-center gap-3 p-4 rounded bg-orange-50 border border-orange-100 text-orange-800">
                        <Timer className="w-5 h-5 flex-shrink-0" />
                        <div className="text-sm">
                            <span className="font-semibold">Time Limit:</span> You have {attemptData.time_limit_minutes} minutes. Leaving this page will NOT pause the timer.
                        </div>
                    </div>
                )}
                
                {/* Question Mapping */}
                <div className="space-y-8">
                    {attemptData.questions.map((q, index) => (
                        <div key={q.id} className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <div className="prose prose-sm max-w-none text-foreground font-medium leading-relaxed break-words">
                                        {q.text}
                                    </div>
                                    <p className="text-xs text-muted-foreground font-medium">
                                        ({q.score_weight} points)
                                    </p>
                                </div>
                            </div>
                            
                            <div className="pl-11">
                                {/* MCQ Options */}
                                {q.question_type === 'mcq' && (
                                    <div className="space-y-3">
                                        {q.options?.map(option => {
                                            const isSelected = (answers[q.id]?.selected_option_id || null) === option.id;
                                            return (
                                                <label 
                                                    key={option.id} 
                                                    className={cn(
                                                        "flex items-center space-x-3 p-3 border rounded cursor-pointer transition-all duration-200 group",
                                                        isSelected 
                                                            ? "bg-primary/5 border-primary shadow-none" 
                                                            : "bg-white border-border hover:border-primary/50 hover:bg-secondary/5"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
                                                        isSelected ? "border-primary bg-primary" : "border-muted-foreground group-hover:border-primary"
                                                    )}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        value={option.id}
                                                        checked={isSelected}
                                                        onChange={() => handleAnswerChange(q.id, 'mcq', option.id)}
                                                        className="sr-only" // Hide default radio
                                                        required
                                                    />
                                                    <span className={cn("text-sm", isSelected ? "text-foreground font-medium" : "text-muted-foreground")}>
                                                        {option.text}
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Text Answer */}
                                {q.question_type === 'text' && (
                                    <textarea
                                        placeholder="Type your answer here..."
                                        onChange={(e) => handleAnswerChange(q.id, 'text', e.target.value)}
                                        className="w-full p-3 text-sm border border-border rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y min-h-[100px]"
                                        defaultValue={answers[q.id]?.user_answer_text || ''} 
                                    />
                                )}
                            </div>
                            {index !== attemptData.questions.length - 1 && <hr className="border-border/40 mt-6" />}
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-border">
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto min-w-[200px] rounded bg-primary hover:bg-primary/90 text-white">
                        {isSubmitting ? <Loader2 className='w-4 h-4 animate-spin mr-2'/> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                        {isSubmitting ? "Submitting..." : "Submit and Grade Quiz"}
                    </Button>
                </div>
            </form>
        );
    };


    // --- Main Render Logic ---

    return (
        <div className="w-full max-w-4xl mx-auto">
            {isStarted ? renderQuizForm() : (
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">{quiz.title}</h1>
                        <p className="text-muted-foreground leading-relaxed">{quiz.description || "No description provided."}</p>
                    </div>
                    
                    {statusMessage && (
                        <div className="p-4 rounded bg-red-50 border border-red-100 text-red-700 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-sm">{statusMessage}</div>
                        </div>
                    )}

                    {/* Overall Quiz Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded border border-border bg-gray-50/50 flex flex-col justify-center items-center text-center">
                             <FileQuestion className="w-6 h-6 text-muted-foreground mb-2" />
                             <span className="text-2xl font-bold text-primary">{quiz.questions_count}</span>
                             <span className="text-xs text-muted-foreground uppercase tracking-wide">Questions</span>
                        </div>
                        <div className="p-4 rounded border border-border bg-gray-50/50 flex flex-col justify-center items-center text-center">
                             <Clock className="w-6 h-6 text-muted-foreground mb-2" />
                             <span className="text-2xl font-bold text-primary">{quiz.time_limit_minutes || "∞"}</span>
                             <span className="text-xs text-muted-foreground uppercase tracking-wide">Minutes Limit</span>
                        </div>
                        <div className="p-4 rounded border border-border bg-gray-50/50 flex flex-col justify-center items-center text-center">
                             <span className="text-2xl font-bold text-primary">{quiz.max_attempts}</span>
                             <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Attempts</span>
                        </div>
                        <div className="p-4 rounded border border-border bg-gray-50/50 flex flex-col justify-center items-center text-center">
                             <span className={`text-2xl font-bold ${attemptsLeft === 0 ? 'text-destructive' : 'text-green-600'}`}>
                                {attemptsLeft}
                             </span>
                             <span className="text-xs text-muted-foreground uppercase tracking-wide">Remaining</span>
                        </div>
                    </div>

                    <LatestAttemptCard />

                    <div className="pt-4">
                        {attemptsLeft > 0 ? (
                            <Button onClick={startAttempt} size="lg" className="w-full sm:w-auto rounded bg-primary hover:bg-primary/90 text-white font-semibold">
                                {latestAttempt && !latestAttempt.is_completed ? "Resume Latest Attempt" : "Start New Attempt"}
                            </Button>
                        ) : (
                            <div className="p-4 rounded bg-gray-100 text-gray-600 text-center text-sm font-medium">
                                Maximum attempts reached.
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* CANCEL CONFIRMATION MODAL */}
            <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Exit</DialogTitle>
                    </DialogHeader>
                    <p className="py-4 text-sm text-muted-foreground leading-relaxed">
                        Are you sure you want to exit? <br/><br/>
                        <span className="text-destructive font-medium">Warning:</span> If you exit now, your current answers will be lost and your attempt will <span className="font-bold text-foreground">not</span> be submitted.
                    </p>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowCancelModal(false)} className="rounded">
                            Continue Quiz
                        </Button>
                        <Button variant="destructive" onClick={handleCancelAttempt} className="rounded">
                            Exit and Lose Progress
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}