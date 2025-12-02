"use client";

import React, { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Trophy, BookOpen, FileText, CheckSquare } from 'lucide-react';
import api from "@/lib/api/axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CourseProgressCard({ courseSlug }: { courseSlug: string }) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchProgress = async () => {
        try {
            const res = await api.get(`/courses/${courseSlug}/progress-report/`);
            setStats(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, [courseSlug]);

    const downloadCertificate = () => {
        // Your download logic here
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseSlug}/certificate/`, '_blank');
    };

    if (loading || !stats) return null;

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Your Progress</h3>
                    <p className="text-sm text-gray-500">Keep it up! You're doing great.</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">{stats.percent}%</span>
            </div>

            <Progress value={stats.percent} className="h-2" />

            <div className="grid grid-cols-3 gap-2 py-2">
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                    <BookOpen size={16} className="text-blue-500 mb-1" />
                    <span className="text-xs font-semibold text-gray-600">Lessons</span>
                    <span className="text-xs text-gray-400">{stats.breakdown.lessons}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                    <FileText size={16} className="text-orange-500 mb-1" />
                    <span className="text-xs font-semibold text-gray-600">Assign.</span>
                    <span className="text-xs text-gray-400">{stats.breakdown.assignments}</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                    <CheckSquare size={16} className="text-green-500 mb-1" />
                    <span className="text-xs font-semibold text-gray-600">Quizzes</span>
                    <span className="text-xs text-gray-400">{stats.breakdown.quizzes}</span>
                </div>
            </div>

            {stats.is_completed && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    <Button 
                        onClick={downloadCertificate}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white font-bold"
                    >
                        <Trophy className="mr-2 h-4 w-4" /> Download Certificate
                    </Button>
                </div>
            )}
        </div>
    );
}