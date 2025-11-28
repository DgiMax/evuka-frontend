"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/api/axios";

interface UnsubscribePageProps {
  params: Promise<{ token: string }>;
}

export default function UnsubscribePage({ params }: UnsubscribePageProps) {
  const { token } = use(params);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Processing your request...");

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const response = await api.get(`/users/newsletter/unsubscribe/${token}/`);
        
        setStatus("success");
        setMessage(response.data.detail || "You have been successfully unsubscribed.");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.detail || 
          "Invalid or expired link. You may have already unsubscribed."
        );
      }
    };

    if (token) {
      unsubscribe();
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-800">Unsubscribing...</h1>
            <p className="text-gray-500 mt-2">Please wait while we update your preferences.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 text-3xl">
              ✓
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Unsubscribed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link 
              href="/"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-3xl">
              ✕
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to Unsubscribe</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link 
              href="/"
              className="text-blue-600 hover:underline"
            >
              Go back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}