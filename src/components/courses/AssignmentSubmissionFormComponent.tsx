// components/courses/AssignmentSubmissionFormComponent.tsx - FINAL CORRECTED VERSION

"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import api from '@/lib/api/axios';
import { Loader2, FileText, UploadCloud, Clock, CheckCircle2, AlertCircle, RefreshCw, File } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; 
import { cn } from '@/lib/utils';

// --- Interfaces ---
interface CourseAssignment { 
    id: number; 
    title: string; 
    description: string; 
    due_date: string | null; 
    max_score: number; 
    latest_submission: {
        id: number;
        submission_status: 'pending' | 'graded' | 'resubmit' | 'dropped';
        submitted_at: string | null; 
        grade: number | null;
        feedback: string | null;
        file: string | null;
        text_submission: string | null;
    } | null; 
}

interface AssignmentSubmissionFormProps {
    assignment: CourseAssignment;
    onSubmissionSuccess: () => void; 
}

export default function AssignmentSubmissionFormComponent({ assignment, onSubmissionSuccess }: AssignmentSubmissionFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [textSubmission, setTextSubmission] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const latestSubmission = assignment.latest_submission;
    const isSubmitted = !!latestSubmission;
    const isPending = latestSubmission?.submission_status === 'pending';
    
    // The form should be available if graded or resubmit is requested
    const canResubmit = latestSubmission?.submission_status === 'graded' || latestSubmission?.submission_status === 'resubmit';

    const handleSubmitAssignment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        setStatusMessage(null);
        
        if (!file && !textSubmission) {
            setStatusMessage("Please provide a file or text submission.");
            setSubmitStatus('error');
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        if (file) formData.append('file', file);
        if (textSubmission) formData.append('text_submission', textSubmission);
        
        try {
            await api.post(`/assignments/${assignment.id}/submit/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setSubmitStatus('success');
            setStatusMessage("Submission successful! Awaiting review.");
            onSubmissionSuccess(); 

            setTextSubmission('');
            setFile(null);

        } catch (err: any) {
            console.error("Failed to submit assignment:", err);
            setSubmitStatus('error');
            setStatusMessage(err.response?.data?.detail || "Failed to submit assignment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderSubmissionStatus = () => {
        if (!latestSubmission) return null;

        const status = latestSubmission.submission_status;
        const statusText = status && status.length > 0 ? status.toUpperCase() : 'UNKNOWN';

        const isPendingReview = status === 'pending';
        const isRequestResubmit = status === 'resubmit';
        const isGraded = status === 'graded';
        const isGradedSuccess = isGraded && latestSubmission.grade !== null && latestSubmission.grade >= (assignment.max_score / 2);
        
        let statusColorClass = "bg-gray-100 text-gray-700 border-gray-200";
        let icon = <Clock className="w-4 h-4" />;
        
        if (isPendingReview) {
            statusColorClass = "bg-yellow-50 text-yellow-700 border-yellow-200";
            icon = <Clock className="w-4 h-4" />;
        } else if (isRequestResubmit) {
            statusColorClass = "bg-red-50 text-red-700 border-red-200";
            icon = <RefreshCw className="w-4 h-4" />;
        } else if (isGradedSuccess) {
            statusColorClass = "bg-green-50 text-green-700 border-green-200";
            icon = <CheckCircle2 className="w-4 h-4" />;
        } else if (isGraded) {
             statusColorClass = "bg-orange-50 text-orange-700 border-orange-200";
             icon = <AlertCircle className="w-4 h-4" />;
        }

        const gradeDisplay = latestSubmission.grade !== null ? `${latestSubmission.grade} / ${assignment.max_score}` : 'N/A';

        return (
            <div className="border border-border rounded-lg bg-card p-5 animate-in fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Latest Submission</h4>
                    <Badge variant="outline" className={cn("px-3 py-1 gap-2 rounded", statusColorClass)}>
                        {icon}
                        {statusText}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Submitted On:</span>
                        <div className="font-medium text-foreground">
                            {latestSubmission.submitted_at 
                                ? new Date(latestSubmission.submitted_at).toLocaleString() 
                                : 'N/A'
                            }
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-muted-foreground">Grade:</span>
                        <div className="font-bold text-lg text-foreground">
                            {gradeDisplay}
                        </div>
                    </div>
                </div>

                {/* Specific Messages */}
                {isPendingReview && <p className="mt-4 text-sm text-yellow-600 bg-yellow-50/50 p-2 rounded border border-yellow-100/50">Your assignment has been received and is awaiting instructor review.</p>}
                {isRequestResubmit && <p className="mt-4 text-sm text-red-600 bg-red-50/50 p-2 rounded border border-red-100/50">The instructor has requested a resubmission. Please check feedback below.</p>}

                {/* File Link */}
                {latestSubmission.file && (
                     <div className="mt-4 pt-4 border-t border-border/50">
                        <a 
                            href={latestSubmission.file} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                        >
                            <File className="w-4 h-4" /> Download Submitted File
                        </a>
                     </div>
                )}
            </div>
        );
    };

    // Form is hidden only if status is pending review
    const showSubmissionForm = !isPending;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            
            {/* 1. Instructions Card */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/50 pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">{assignment.title}</h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                             <span>Max Score: <span className="font-semibold text-foreground">{assignment.max_score}</span></span>
                             <span className="text-border">|</span>
                             <span className={cn(assignment.due_date ? "text-destructive font-medium" : "")}>
                                Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No Due Date'}
                             </span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {assignment.description || "No specific instructions provided for this assignment."}
                </div>
            </div>

            {/* Status Feedback and Alerts */}
            {submitStatus === 'success' && (
                <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{statusMessage}</AlertDescription>
                </Alert>
            )}
            
            {submitStatus === 'error' && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{statusMessage}</AlertDescription>
                </Alert>
            )}

            {/* 2. Latest Submission Summary */}
            {isSubmitted && renderSubmissionStatus()}
            
            {/* 3. Submission/Resubmission Form */}
            {showSubmissionForm ? (
                <div className="border border-border rounded-lg bg-card overflow-hidden">
                    <div className="bg-muted/30 px-6 py-4 border-b border-border">
                        <h5 className="font-semibold text-foreground flex items-center gap-2">
                            <UploadCloud className="w-5 h-5 text-primary" />
                            {isSubmitted ? "Resubmit Your Work" : "New Submission"}
                        </h5>
                    </div>
                    
                    <form onSubmit={handleSubmitAssignment} className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" /> Text Submission (Optional)
                            </label>
                            <textarea 
                                className="w-full min-h-[120px] p-3 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-y" 
                                value={textSubmission} 
                                onChange={(e) => setTextSubmission(e.target.value)} 
                                placeholder="Type your answer directly here, or provide notes for the instructor..." 
                            />
                        </div>
                        
                        <div className="space-y-2">
                             <label className="text-sm font-medium text-foreground flex items-center gap-2">
                                <File className="w-4 h-4 text-muted-foreground" /> Upload File (Optional)
                            </label>
                            <div className="flex items-center gap-3">
                                <label className="cursor-pointer">
                                    <span className="inline-flex items-center px-4 py-2 rounded border border-border bg-background hover:bg-secondary/50 hover:border-primary/50 text-sm font-medium transition-colors">
                                        Choose File
                                    </span>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                                    />
                                </label>
                                <span className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                                    {file ? file.name : "No file chosen"}
                                </span>
                            </div>
                        </div>
                        
                        <div className="pt-2">
                            <Button type="submit" disabled={isSubmitting || (!file && !textSubmission)} className="w-full sm:w-auto min-w-[150px] bg-primary hover:bg-primary/90">
                                {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                                Submit Assignment
                            </Button>
                        </div>
                    </form>
                </div>
            ) : (
                 !isSubmitted && (
                    <Alert className="bg-muted/50 border-dashed">
                        <AlertDescription className="text-muted-foreground text-center">
                            No submission has been made yet.
                        </AlertDescription>
                    </Alert>
                 )
            )}
            
            {/* Show Locked Message if Pending */}
            {isPending && (
                <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm flex items-center gap-3">
                    <Clock className="w-5 h-5 shrink-0" />
                    <p>Submission is locked while your current attempt is under review. You will be able to resubmit once it is graded.</p>
                </div>
            )}

            {/* Instructor Feedback (Display only if it exists) */}
            {latestSubmission?.feedback && (
                <div className="border border-primary/20 bg-primary/5 rounded-lg p-6 animate-in slide-in-from-bottom-2">
                    <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary" /> Instructor Feedback
                    </h4>
                    <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {latestSubmission.feedback}
                    </div>
                </div>
            )}
        </div>
    );
}