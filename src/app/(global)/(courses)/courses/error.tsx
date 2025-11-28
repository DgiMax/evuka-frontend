"use client";

import Image from "next/image";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center mt-16 px-4 mb-16">
      <div className="max-w-md w-full bg-white rounded p-8 text-center border border-gray-100 shadow-sm">
        <div className="flex justify-center mb-6">
          <Image
            src="/failed.svg"
            alt="Error illustration"
            width={120}
            height={120}
            className="mx-auto"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Unable to Load Courses
        </h2>

        <p className="text-gray-500 mb-6">
          {error?.message ||
            "We encountered an issue fetching the course catalog. Please check your internet connection and try again."}
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded 
                     bg-primary text-white font-medium shadow-sm hover:bg-primary/90 
                     transition-colors duration-200"
        >
          <RefreshCcw size={18} />
          Try again
        </button>
      </div>
    </div>
  );
}