"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api/axios";
import { CheckCircle, AlertCircle, Award, Calendar, Building2, User } from "lucide-react";
import Image from "next/image";

interface VerificationData {
  status: string;
  data: {
    student_name: string;
    course_title: string;
    organization_name: string;
    issue_date: string;
    certificate_uid: string;
  };
}

export default function VerifyCertificatePage() {
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/courses/certificates/verify/${uid}/`);
        setData(res.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (uid) verify();
  }, [uid]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Verifying...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-8 text-center">
           <div className="font-black text-white text-2xl tracking-tighter mb-2">EVUKA</div>
           <p className="text-slate-400 text-xs uppercase tracking-widest">Official Verification Portal</p>
        </div>

        <div className="p-8">
          {error ? (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-slate-900">Verification Failed</h1>
              <p className="text-slate-500 mt-2">This certificate record could not be found or has been revoked.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 text-green-600 font-bold mb-8">
                <CheckCircle className="w-6 h-6" />
                <span>AUTHENTIC RECORD</span>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Recipient</p>
                    <p className="text-lg font-bold text-slate-900">{data?.data.student_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Award className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Course</p>
                    <p className="text-lg font-bold text-slate-900">{data?.data.course_title}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Building2 className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Issuing Body</p>
                    <p className="text-slate-700 font-medium">{data?.data.organization_name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-slate-400 mt-1" />
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Issue Date</p>
                    <p className="text-slate-700 font-medium">{new Date(data?.data.issue_date || "").toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-300 font-mono break-all uppercase">UID: {uid}</p>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="mt-8 text-slate-400 text-xs">Powered by Evuka Learning Ecosystem</p>
    </div>
  );
}